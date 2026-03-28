import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MENU_ITEMS = [
  { id: 1, name: 'Margherita Pizza', category: 'Pizza', price: 12.99 },
  { id: 2, name: 'Pepperoni Pizza', category: 'Pizza', price: 14.99 },
  { id: 3, name: 'Penne Alfredo', category: 'Pasta', price: 11.99 },
  { id: 4, name: 'Spaghetti Bolognese', category: 'Pasta', price: 13.99 },
  { id: 5, name: 'Garlic Bread', category: 'Sides', price: 5.99 },
  { id: 6, name: 'Coca Cola', category: 'Beverages', price: 2.99 },
  { id: 7, name: 'Lemonade', category: 'Beverages', price: 3.49 }
];

const OnlineOrder = () => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Payment State
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [paymentDetails, setPaymentDetails] = useState({ upiId: '', cardNumber: '', expiryDate: '', cvv: '' });
  const [paymentError, setPaymentError] = useState('');

  const addToCart = (item) => {
    const existing = cart.find(cartItem => cartItem.id === item.id);
    if (existing) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleOpenPaymentModal = () => {
    if (cart.length === 0) return;
    setShowPayment(true);
    setPaymentError('');
  };

  const processPaymentAndOrder = async () => {
    try {
      setPaymentError('');
      
      // Validation block
      if (paymentMethod === 'UPI') {
        if (!paymentDetails.upiId.includes('@') || paymentDetails.upiId.length < 5) {
          throw new Error('Invalid UPI ID. Format should be user@bank');
        }
      } else if (paymentMethod === 'CARD') {
        if (!/^[0-9]{16}$/.test(paymentDetails.cardNumber)) {
          throw new Error('Card number must be exactly 16 digits.');
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiryDate)) {
          throw new Error('Expiry date must be in MM/YY format.');
        }
        if (!/^[0-9]{3,4}$/.test(paymentDetails.cvv)) {
          throw new Error('CVV must be 3 or 4 digits.');
        }
      }

      // Proceed to order if payment validations pass
      const user = JSON.parse(localStorage.getItem('user'));
      const orderData = {
        userId: user?.id,
        items: cart.map(item => ({ itemName: item.name, price: item.price, quantity: item.quantity })),
        totalAmount: parseFloat(getTotal()),
        orderType: 'ONLINE',
        status: 'PENDING'
      };

      await axios.post('http://localhost:8080/api/orders', orderData);
      
      // Success handling
      setShowPayment(false);
      setMessage('Payment successful! Order placed. The kitchen is preparing your food.');
      setCart([]);
      setPaymentDetails({ upiId: '', cardNumber: '', expiryDate: '', cvv: '' });
      setTimeout(() => setMessage(''), 5000);

    } catch (err) {
      setPaymentError(err.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', display: 'flex', gap: '2rem', justifyContent: 'center', position: 'relative' }}>
      <div style={{ flex: 2, maxWidth: '600px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ padding:'8px 16px', cursor:'pointer', marginBottom: '1rem' }}>&larr; Back to Dashboard</button>
        <h2>Online Menu</h2>
        {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {MENU_ITEMS.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h3>
                <span style={{ color: 'gray', fontSize: '0.9rem' }}>{item.category}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>${item.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(item)}
                  style={{ padding: '8px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: '350px', backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', height: 'fit-content', position: 'sticky', top: '2rem' }}>
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p style={{ color: 'gray' }}>Cart is empty</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{item.quantity}x </span>
                    {item.name}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Total:</span>
              <span>${getTotal()}</span>
            </div>
            <button 
              onClick={handleOpenPaymentModal}
              style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Proceed to Payment
            </button>
          </>
        )}
      </div>

      {showPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
            <h2 style={{marginTop: 0}}>Payment Details</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Card
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                UPI
              </label>
            </div>

            {paymentError && <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{paymentError}</div>}

            {paymentMethod === 'UPI' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Enter UPI ID (e.g. name@bank)"
                  value={paymentDetails.upiId}
                  onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Card Number (16 digits)"
                  value={paymentDetails.cardNumber}
                  maxLength={16}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    maxLength={5}
                    onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <input 
                    type="password" 
                    placeholder="CVV"
                    value={paymentDetails.cvv}
                    maxLength={4}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button 
                onClick={() => setShowPayment(false)}
                style={{ flex: 1, padding: '10px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={processPaymentAndOrder}
                style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Pay ${getTotal()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineOrder;