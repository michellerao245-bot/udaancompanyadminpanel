import React, { useState } from 'react';
import PaymentGatewayModal from './PaymentGatewayModal.jsx'; // .jsx extension add karein
const UpgradePlanModal = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  if (!isOpen) return null;

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: 9999,
      duration: '1 Month',
      description: 'Perfect for small businesses',
      features: ['50 Salesman Accounts', '100 Products', '25 Distributors', 'Basic Reports', 'Email Support'],
      headerBg: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
      cardBg: '#eff6ff',
      borderColor: '#93c5fd',
      btnBg: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
      icon: '🚀'
    },
    {
      id: 2,
      name: 'Growth',
      price: 14999,
      duration: '1 Month',
      description: 'Best for growing companies',
      features: ['100 Salesman Accounts', '500 Products', '50 Distributors', 'Advanced Reports', 'Live Tracking', 'Priority Support'],
      headerBg: 'linear-gradient(135deg, #059669, #047857)',
      cardBg: '#ecfdf5',
      borderColor: '#6ee7b7',
      btnBg: 'linear-gradient(135deg, #059669, #047857)',
      icon: '📈',
      popular: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 24999,
      duration: '1 Month',
      description: 'For large scale operations',
      features: ['Unlimited Salesman', 'Unlimited Products', 'Unlimited Distributors', 'Custom Reports', '24/7 Support'],
      headerBg: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      cardBg: '#f5f3ff',
      borderColor: '#c4b5fd',
      btnBg: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      icon: '👑'
    }
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentGateway(false);
    alert(`🎉 Successfully upgraded to ${selectedPlan?.name} Plan!`);
    onClose();
  };

  const calculateTotalWithGst = (price) => {
    return price + price * 0.18;
  };

  return (
    <>
      {/* Main Upgrade Plan Modal Container */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '30px',
          maxWidth: '1050px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          color: '#ffffff'
        }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          {/* Modal Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#38bdf8', fontSize: '36px', fontWeight: '900', margin: '0', letterSpacing: '-1px', lineHeight: '1' }}>
              UDAAN
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '800', letterSpacing: '0.65em', textTransform: 'uppercase', margin: '6px 0 16px 6px' }}>
              FAST TRACK
            </p>
            <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0' }}>
              Upgrade Your Subscription Plan
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Select a new plan to unlock more salesman accounts and features instantly.
            </p>
          </div>

          {/* Plan Cards Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  backgroundColor: plan.cardBg,
                  border: `2px solid ${plan.borderColor}`,
                  borderRadius: '20px',
                  width: '290px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#f59e0b',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}>
                    ⭐ Popular
                  </div>
                )}

                {/* Card Header */}
                <div style={{ background: plan.headerBg, color: '#ffffff', padding: '20px' }}>
                  <span style={{ fontSize: '28px', display: 'block', marginBottom: '4px' }}>{plan.icon}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                    {plan.name}
                  </h3>
                  <div style={{ fontSize: '28px', fontWeight: '900' }}>
                    ₹{plan.price} <span style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.8 }}>/ {plan.duration}</span>
                  </div>
                  <p style={{ fontSize: '12px', margin: '6px 0 0 0', opacity: 0.9 }}>
                    {plan.description}
                  </p>
                </div>

                {/* Features Body */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} style={{ fontSize: '12px', color: '#334155', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span> {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    style={{
                      background: plan.btnBg,
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer',
                      width: '100%',
                      textTransform: 'uppercase'
                    }}
                  >
                    Upgrade to {plan.name} →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '25px', paddingTop: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '12px' }}>
            🔒 Auto-debit will be updated for the new plan upon authorization.
          </div>
        </div>
      </div>

      {/* Auto-Debit Payment Gateway Popup */}
      {showPaymentGateway && selectedPlan && (
        <PaymentGatewayModal
          amount={calculateTotalWithGst(selectedPlan.price)}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentGateway(false)}
        />
      )}
    </>
  );
};

export default UpgradePlanModal;