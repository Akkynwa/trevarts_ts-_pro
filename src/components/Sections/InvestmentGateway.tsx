import { useState, ChangeEvent } from 'react';
import { useWertWidget } from '@wert-io/module-react-component';
import type { ReactiveOptions } from '@wert-io/module-react-component';

const TREASURY_ADDRESS = '0x7866F7cb1aa889A808eE9d225b60fce3d4BE7F3e';

export default function InvestmentGateway() {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const reactiveOptions: ReactiveOptions = {
    theme: 'dark',
    listeners: {
      'payment-status': (s) => {
        if (s?.status === 'success') {
          alert('Access Layer Activated: NFT Minted to Treasury');
        }
      },
    },
  };

  const { open, isWidgetOpen } = useWertWidget(reactiveOptions);

  // Handle manual input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  const handleAcquire = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://trevarts-ts-backend-pro.onrender.com/api/wert/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const options: any = {
        partner_id: '01KC903Q0NY0H61RZ17G8H26T3',
        origin: 'https://sandbox.wert.io',
        // origin: 'https://widget.wert.io',
        network: 'ethereum',
        commodity: 'ETH',
        click_id: data.session_id,
        currency: 'USD', 
        currency_amount: data.fiat_amount,
        commodity_amount: data.eth_amount,
        sc_address: data.sc_address,
        sc_input_data: data.sc_input_data,
        signature: data.signature,
        address: TREASURY_ADDRESS,
        extra: {
          item_info: {
            name: `Investment Gateway NFT x${quantity}`,
            author: 'TrevArts',
            seller: 'TrevArts',
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
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>GATEWAY TERMINAL</h2>
        <div style={styles.statusBadge}>SECURE CONNECTION ACTIVE</div>
      </div>

      <p style={styles.description}>
        Select the number of Access Layer NFTs to authorize for your trading identity.
      </p>

      <div style={styles.inputContainer}>
        <label style={styles.label}>QUANTITY</label>
        <div style={styles.counterRow}>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={styles.mathBtn}>-</button>
          <input 
            type="number" 
            value={quantity} 
            onChange={handleInputChange} 
            style={styles.input}
          />
          <button onClick={() => setQuantity(quantity + 1)} style={styles.mathBtn}>+</button>
        </div>
      </div>

      <div style={styles.priceContainer}>
        <span style={styles.totalLabel}>TOTAL COST</span>
        <span style={styles.totalValue}>${(50 * quantity).toLocaleString()} USD</span>
      </div>

      <button
        disabled={loading || isWidgetOpen}
        onClick={handleAcquire}
        style={{ 
          ...styles.mintBtn,
          ...(loading || isWidgetOpen ? styles.disabledBtn : {})
        }}
      >
        {loading ? 'INITIALIZING...' : 'AUTHORIZE ACQUISITION'}
      </button>

      <div style={styles.footer}>
        ESTABLISHING CRYPTOGRAPHIC LINK TO TREASURY
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '30px',
    backgroundColor: '#0a0a0a',
    backgroundImage: 'radial-gradient(circle at top right, #1a1a1a, #0a0a0a)',
    color: '#fff',
    borderRadius: '16px',
    border: '1px solid #333',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    fontFamily: '"Inter", sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    letterSpacing: '3px',
    margin: 0,
    color: '#fff',
  },
  statusBadge: {
    fontSize: '9px',
    color: '#00ff00',
    border: '1px solid #00ff00',
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '1px',
  },
  description: {
    fontSize: '13px',
    color: '#888',
    lineHeight: '1.5',
    marginBottom: '30px',
  },
  inputContainer: {
    marginBottom: '25px',
  },
  label: {
    fontSize: '10px',
    color: '#555',
    display: 'block',
    marginBottom: '8px',
    letterSpacing: '2px',
  },
  counterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  mathBtn: {
    width: '40px',
    height: '40px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  input: {
    flex: 1,
    height: '40px',
    backgroundColor: 'transparent',
    border: '1px solid #333',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#00ff00',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    borderTop: '1px solid #222',
    marginBottom: '20px',
  },
  totalLabel: { fontSize: '12px', color: '#555' },
  totalValue: { fontSize: '18px', fontWeight: 'bold', color: '#fff' },
  mintBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#00ff00',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '900',
    letterSpacing: '1px',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
    transition: 'transform 0.1s, box-shadow 0.2s',
  },
  disabledBtn: {
    backgroundColor: '#222',
    color: '#555',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },
  footer: {
    marginTop: '20px',
    fontSize: '9px',
    color: '#444',
    textAlign: 'center',
    letterSpacing: '1px',
  }
};