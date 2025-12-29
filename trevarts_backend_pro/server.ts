import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { encodeFunctionData } from 'viem';
import { signSmartContractData } from '@wert-io/widget-sc-signer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- CONSTANTS ---
const TREASURY_ADDRESS = '0x7866F7cb1aa889A808eE9d225b60fce3d4BE7F3e';
const PARTNER_ID = process.env.WERT_PARTNER_ID!;
const PRIVATE_KEY = process.env.WERT_PRIVATE_KEY!;
const CONTRACT_ADDRESS = process.env.NFT_CONTRACT!;
const NFT_PRICE_USD = 1; // <-- FIXED: $1 PER NFT

// LIVE or SANDBOX origin
const WERT_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://widget.wert.io"
    : "https://sandbox.wert.io";

const ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'quantity', type: 'uint256' }],
    outputs: [],
  },
];

// Fetch ETH price from CoinGecko
async function getEthPrice(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data: any = await res.json();
    return data.ethereum.usd;
  } catch (e) {
    console.error("⚠️ Live price fetch failed. Using fallback: $3000", e);
    return 3000;
  }
}

// --- 1. SESSION ROUTE ---
app.post("/api/wert/session", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    // 1. Fiat Price
    const fiatAmount = quantity * NFT_PRICE_USD;

    // 2. Live ETH Price
    const ethPrice = await getEthPrice();

    // 3. Convert USD → ETH
    const ethAmount = parseFloat((fiatAmount / ethPrice).toFixed(6));

    // 4. Encode call to mint()
    const scInputData = encodeFunctionData({
      abi: ABI,
      functionName: "mint",
      args: [BigInt(quantity)],
    });

    // 5. Sign Smart Contract Call
    const options = {
      address: TREASURY_ADDRESS,
      commodity: "ETH",
      network: "ethereum",
      sc_address: CONTRACT_ADDRESS,
      sc_input_data: scInputData,
      commodity_amount: ethAmount,
      pk_id: "key1",
    };

    const signed = signSmartContractData(options, PRIVATE_KEY);

    // 6. Response to frontend
    res.json({
      session_id: uuidv4(),
      partner_id: PARTNER_ID,
      origin: WERT_ORIGIN,
      fiat_amount: fiatAmount,
      eth_amount: ethAmount,
      eth_price_at_request: ethPrice,
      sc_address: CONTRACT_ADDRESS,
      sc_input_data: scInputData,
      signature: signed.signature,
    });

  } catch (err: any) {
    console.error("❌ Signing Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- 2. WEBHOOK ROUTE ---
app.post("/api/wert/webhook", (req: Request, res: Response) => {
  const payload = req.body;
  console.log("📩 Webhook:", payload.type);

  res.status(200).send("OK");

  if (payload.type === "order_completed") {
    console.log("✅ Order successful:", payload.click_id);
  }
});

app.listen(4000, () =>
  console.log("🚀 Wert backend running on port 4000")
);
