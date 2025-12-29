import { useState, ChangeEvent } from "react";
import { useWertWidget } from "@wert-io/module-react-component";
import type { ReactiveOptions } from "@wert-io/module-react-component";
import { ShieldCheck, Minus, Plus, Cpu } from "lucide-react";

const TREASURY_ADDRESS = "0x7866F7cb1aa889A808eE9d225b60fce3d4BE7F3e";

export default function InvestmentGateway() {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const reactiveOptions: ReactiveOptions = {
    theme: (document.documentElement.classList.contains("dark") ? "dark" : "light") as any,
    listeners: {
      "payment-status": (s) => {
        if (s?.status === "success") {
          alert("Access Layer Activated: NFT Minted to Treasury");
        }
      },
    },
  };

  const { open, isWidgetOpen } = useWertWidget(reactiveOptions);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(isNaN(value) || value < 1 ? 1 : value);
  };

  const handleAcquire = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://trevarts-ts-backend-pro.onrender.com/api/wert/session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const options: any = {
        partner_id: data.partner_id,
        origin: data.origin,
        network: "ethereum",
        commodity: "ETH",
        click_id: data.session_id,
        currency: "USD",
        currency_amount: data.fiat_amount,
        commodity_amount: data.eth_amount,
        sc_address: data.sc_address,
        sc_input_data: data.sc_input_data,
        signature: data.signature,
        address: TREASURY_ADDRESS,
        extra: {
          item_info: {
            name: `Investment Gateway NFT x${quantity}`,
            author: "TrevArts",
            seller: "TrevArts",
          },
        },
      };

      open(options);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 mt-24 mb-10">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[10px] font-semibold tracking-widest text-[var(--muted)] uppercase">
              Access Panel
            </h2>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Gateway Module
            </h1>
          </div>

          <div className="px-2.5 py-1 flex items-center gap-1 border border-green-500/30 bg-green-500/10 rounded-full text-[10px] font-semibold text-green-500">
            <ShieldCheck size={12} />
            Secure
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
          Acquire Access Layer NFTs to authenticate your presence inside the TrevArts ecosystem.
        </p>

        {/* Quantity Selector */}
        <label className="text-[10px] font-semibold text-[var(--muted)] uppercase mb-2 block tracking-widest">
          Quantity
        </label>

        <div className="flex items-center justify-between bg-[var(--background)] border border-[var(--border)] rounded-xl p-2 mb-6">

          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[var(--card)] transition"
          >
            <Minus size={18} />
          </button>

          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            className="text-center w-20 bg-transparent text-xl font-bold text-[#f53513ff] outline-none"
          />

          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[var(--card)] transition"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Price */}
        <div className="border border-[#f53513ff]/30 bg-[#f53513ff]/5 p-4 rounded-xl mb-6">
          <p className="text-[11px] text-[var(--muted)] tracking-wide mb-1">
            Total Amount
          </p>
          <p className="text-2xl font-extrabold text-[var(--foreground)]">
            ${(1 * quantity).toLocaleString()}{" "}
            <span className="text-[12px] text-[var(--muted)]">USD</span>
          </p>
        </div>

        {/* Button */}
        <button
          disabled={loading || isWidgetOpen}
          onClick={handleAcquire}
          className={`w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest
          ${loading || isWidgetOpen
            ? "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
            : "bg-[#f53513ff] text-white shadow-[0_0_20px_rgba(245,53,19,0.4)] hover:shadow-[0_0_30px_rgba(245,53,19,0.6)]"}
          `}
        >
          {loading ? "Initializing..." : "Authorize Acquisition"}
        </button>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-[var(--muted)] tracking-widest">
          <Cpu size={13} />
          <span>Secure Treasury Link</span>
        </div>

      </div>
    </div>
  );
}
