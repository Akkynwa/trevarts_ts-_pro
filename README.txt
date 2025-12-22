This `README.md` is designed to be a professional-grade technical document. It covers the full lifecycle of your "Investment Gateway" project, including the critical security steps for **Domain Authorization** and **Contract Verification** to ensure your platform is trusted by both Wert and your users.

---

# 📑 Investment Gateway NFT Platform

This repository contains the full-stack infrastructure for a secure, wallet-verified NFT minting platform. The project is designed as an **Access Layer** for an investment trading platform, ensuring that NFTs are minted directly to a user's verified cryptographic identity.

---

## 🚀 Quick Start: Deployment

### 1. Smart Contract Verification (Etherscan)

Before users can interact with your contract via Wert, the contract source code must be verified.

* **Method:** Use Hardhat or Foundry to verify.
* **Manual:** Go to the "Contract" tab on **Etherscan**, click "Verify and Publish," and upload your flattened Solidity code.
* **Why:** Wert requires verification to read the contract's ABI for transaction construction.

### 2. Backend Deployment (Node.js/Express)

1. **Host:** Deploy to **Render** or **Railway**.
2. **Environment Variables:**
```env
WERT_PRIVATE_KEY="your_private_key_here"
WERT_PARTNER_ID="your_partner_id"
SMART_CONTRACT_ADDRESS="0x..."

```


3. **CORS Setup:** Ensure your backend allows requests from your frontend production domain.

### 3. Frontend Deployment (Vercel)

1. **Connect Repo:** Point Vercel to your `/frontend` folder.
2. **Network Configuration:** Ensure `wagmi` is configured for `mainnet`.
3. **Build:** `npm run build`.

---

## 🔐 Domain Authorization & Security

To protect your users and prevent "man-in-the-middle" attacks, you must authorize your domain within the **Wert Partner Dashboard**.

### Step-by-Step Authorization:

1. **Register Domain:** Log in to your Wert Dashboard and add your production URL (e.g., `https://trevartspro.netlify.app/`).
2. **Verification File:** Wert may require you to upload a specific `.txt` file to your frontend's `public` folder to prove ownership.
3. **SSL Requirement:** Wert will **only** load on `https`. Ensure your SSL certificates are active (Vercel/Render do this automatically).
4. **Origin Locking:** Your backend should check the `Origin` header of incoming requests to ensure only your authorized frontend can request signatures.

---

## 🛠 Features

* **Identity-First Minting:** Forced Wallet Connection (EIP-1193) eliminates manual entry errors.
* **Network Guard:** Prevents transactions if the user is not on the Ethereum Mainnet.
* **Locked Signatures:** Backend-signed payloads prevent the NFT recipient address from being changed during checkout.
* **Investment Ready:** Specifically architected to act as a login gateway for financial platforms.

---

## 📁 Project Structure

```text
├── /backend
│   ├── server.js          # Signature generation & Wert integration
│   └── package.json
├── /frontend
│   ├── /components        # RainbowKit & Network Switcher logic
│   ├── /hooks             # Wallet connection hooks
│   └── App.js             # Main Gateway UI
└── /contracts
    └── AccessGateway.sol  # The ERC-721/1155 Smart Contract

```

---

## 🧪 Local Development

### Backend

```bash
cd backend
npm install
npm start

```

### Frontend

```bash
cd frontend
npm install
npm start

```

---

## 📝 Troubleshooting

| Issue | Solution |
| --- | --- |
| **Wert "Invalid Signature"** | Check that your `WERT_PRIVATE_KEY` matches exactly and your backend is signing the correct `sc_input_data`. |
| **Contract Not Found** | Ensure your contract is verified on Etherscan and you are using the correct address for the active network. |
| **Wallet Won't Connect** | Check your `ProjectID` in your `wagmi` configuration (required for WalletConnect v2). |

---
