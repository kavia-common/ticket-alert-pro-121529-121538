import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Subscriptions.css';

// PUBLIC_INTERFACE
const Subscriptions = () => {
  const { updateUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  // PUBLIC_INTERFACE
  const fetchSubscriptionData = async () => {
    try {
      const [plansResponse, currentResponse] = await Promise.all([
        axios.get('/api/subscriptions/plans'),
        axios.get('/api/subscriptions/current')
      ]);
      
      setPlans(plansResponse.data);
      setCurrentPlan(currentResponse.data);
    } catch (error) {
      console.error('Failed to fetch subscription data:', error);
      // Mock data for demo
      setPlans([
        {
          id: 'free',
          name: 'Free',
          price: 0,
          interval: 'month',
          features: [
            'Up to 3 price alerts',
            'Email notifications',
            'Basic event search',
            'Community support'
          ],
          limitations: [
            'Limited to 3 alerts',
            'Email notifications only',
            'No priority support'
          ]
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 9.99,
          interval: 'month',
          popular: true,
          features: [
            'Unlimited price alerts',
            'SMS & Push notifications',
            'Advanced filtering',
            'Price history tracking',
            'Priority support',
            'Early access to new features'
          ]
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 19.99,
          interval: 'month',
          features: [
            'Everything in Pro',
            'Real-time price tracking',
            'VIP customer support',
            'Custom alert rules',
            'API access',
            'Bulk alert management',
            'Advanced analytics'
          ]
        }
      ]);
      setCurrentPlan({ id: 'free', name: 'Free' });
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  // PUBLIC_INTERFACE
  const handleSubscribe = async (planId, interval = 'month') => {
    try {
      const response = await axios.post('/api/subscriptions/subscribe', {
        planId,
        interval
      });
      
      setCurrentPlan(response.data.subscription);
      updateUser({ subscription: response.data.subscription });
      setShowUpgradeModal(false);
      
      // Redirect to payment or show success message
      console.log('Subscription successful:', response.data);
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  // PUBLIC_INTERFACE
  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await axios.post('/api/subscriptions/cancel');
        setCurrentPlan({ id: 'free', name: 'Free' });
        updateUser({ subscription: { id: 'free', name: 'Free' } });
      } catch (error) {
        console.error('Failed to cancel subscription:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading subscription plans...</div>;
  }

  return (
    <div className="subscriptions-page">
      <div className="page-header">
        <h1>Subscription Plans</h1>
        <p className="page-subtitle">
          Choose the plan that works best for your ticket tracking needs
        </p>
      </div>

      {/* Current Plan */}
      {currentPlan && (
        <div className="current-plan-section">
          <div className="current-plan-card">
            <div className="current-plan-header">
              <h2>Current Plan</h2>
              <div className="plan-badge">
                {currentPlan.name}
              </div>
            </div>
            <div className="current-plan-details">
              <p>
                You are currently on the <strong>{currentPlan.name}</strong> plan.
                {currentPlan.id !== 'free' && (
                  <>
                    {' '}Next billing date: <strong>{currentPlan.nextBilling || 'N/A'}</strong>
                  </>
                )}
              </p>
              {currentPlan.id !== 'free' && (
                <button 
                  className="btn btn-outline btn-small"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="plans-grid">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`plan-card ${plan.popular ? 'popular' : ''} ${
              currentPlan?.id === plan.id ? 'current' : ''
            }`}
          >
            {plan.popular && (
              <div className="popular-badge">Most Popular</div>
            )}
            
            <div className="plan-header">
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price-amount">
                  ${plan.price}
                </span>
                <span className="price-interval">
                  /{plan.interval}
                </span>
              </div>
            </div>

            <div className="plan-features">
              <h4>Features included:</h4>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              {plan.limitations && (
                <>
                  <h4>Limitations:</h4>
                  <ul className="limitations-list">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index}>
                        <span className="limitation-icon">✗</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="plan-action">
              {currentPlan?.id === plan.id ? (
                <button className="btn btn-outline w-full" disabled>
                  Current Plan
                </button>
              ) : (
                <button 
                  className="btn btn-primary w-full"
                  onClick={() => handleUpgrade(plan)}
                >
                  {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h2>Why Upgrade?</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">🚀</div>
            <h3>More Alerts</h3>
            <p>Track unlimited events and never miss a price drop</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📱</div>
            <h3>Instant Notifications</h3>
            <p>Get SMS and push notifications for faster response times</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📊</div>
            <h3>Advanced Analytics</h3>
            <p>Track price trends and optimize your buying strategy</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <h3>Priority Support</h3>
            <p>Get help when you need it with dedicated customer support</p>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                Upgrade to {selectedPlan.name}
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowUpgradeModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="upgrade-summary">
                <div className="plan-summary">
                  <h3>{selectedPlan.name} Plan</h3>
                  <div className="plan-price">
                    <span className="price-amount">${selectedPlan.price}</span>
                    <span className="price-interval">/{selectedPlan.interval}</span>
                  </div>
                </div>
                
                <div className="billing-options">
                  <h4>Billing Frequency</h4>
                  <div className="billing-buttons">
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleSubscribe(selectedPlan.id, 'month')}
                    >
                      Monthly - ${selectedPlan.price}/month
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleSubscribe(selectedPlan.id, 'year')}
                    >
                      Yearly - ${(selectedPlan.price * 10).toFixed(2)}/year
                      <span className="savings-badge">Save 17%</span>
                    </button>
                  </div>
                </div>

                <div className="upgrade-features">
                  <h4>What you'll get:</h4>
                  <ul>
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index}>
                        <span className="feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
