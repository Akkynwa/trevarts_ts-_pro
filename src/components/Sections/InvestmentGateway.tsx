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
          alert('Access Layer Activated: USDT Transaction Confirmed');
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
      // 1. Fetch Session from your updated Backend
      const res = await fetch('http://localhost:4000/api/wert/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // 2. Configure Widget for Production USDT
      const options: any = {
        partner_id: data.partner_id,
        origin: data.origin,      // Uses https://widget.wert.io from backend
        network: data.network,    // Uses 'ethereum' from backend
        commodity: data.commodity, // Uses 'USDT' from backend
        click_id: data.session_id,
        currency: 'USD', 
        currency_amount: data.fiat_amount,
        commodity_amount: data.commodity_amount, // 1:1 with USD
        sc_address: data.sc_address,
        sc_input_data: data.sc_input_data,
        signature: data.signature,
        pk_id: data.pk_id,
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
      alert(`Terminal Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>GATEWAY TERMINAL</h2>
        <div style={styles.statusBadge}>USDT PRODUCTION MODE</div>
      </div>

      <p style={styles.description}>
        Authorize the acquisition of Access Layer NFTs using USDT.
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
        <span style={styles.totalLabel}>TOTAL COST (USDT)</span>
        <span style={styles.totalValue}>${(1 * quantity).toFixed(2)}</span>
      </div>

      <button
        disabled={loading || isWidgetOpen}
        onClick={handleAcquire}
        style={{ 
          ...styles.mintBtn,
          ...(loading || isWidgetOpen ? styles.disabledBtn : {})
        }}
      >
        {loading ? 'CONNECTING...' : 'AUTHORIZE ACQUISITION'}
      </button>

      <div style={styles.footer}>
        SECURE USDT GATEWAY • TREVARTS PROTOCOL
      </div>
    </div>
  );
}

// ... (Styles remain the same as your provided code)
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '30px',
    backgroundColor: '#0a0a0a',
    backgroundImage: 'radial-gradient(circle at top right, #1a1a1a, #0a0a0a)',
    color: '#fff',
    borderRadius: '16px',
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