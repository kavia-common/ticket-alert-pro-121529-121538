import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Referrals.css';

// PUBLIC_INTERFACE
const Referrals = () => {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState({
    code: '',
    totalReferrals: 0,
    pendingRewards: 0,
    earnedRewards: 0,
    referralHistory: []
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PUBLIC_INTERFACE
  const fetchReferralData = async () => {
    try {
      const response = await axios.get('/api/referrals/my-data');
      setReferralData(response.data);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
      // Mock data for demo
      setReferralData({
        code: user?.email?.split('@')[0]?.toUpperCase() || 'USER123',
        totalReferrals: 5,
        pendingRewards: 25.00,
        earnedRewards: 150.00,
        referralHistory: [
          {
            id: 1,
            email: 'friend1@example.com',
            status: 'completed',
            reward: 50.00,
            date: '2024-03-01'
          },
          {
            id: 2,
            email: 'friend2@example.com',
            status: 'pending',
            reward: 25.00,
            date: '2024-03-10'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/register?ref=${referralData.code}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // PUBLIC_INTERFACE
  const shareViaEmail = () => {
    const subject = 'Join TicketHawk and save money on tickets!';
    const body = `Hey! I've been using TicketHawk to track ticket prices and save money on concerts and events. 

Join using my referral link and we'll both get $25 in credits:
${window.location.origin}/register?ref=${referralData.code}

TicketHawk sends instant alerts when ticket prices drop, so you never miss a deal!`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // PUBLIC_INTERFACE
  const shareViaSMS = () => {
    const message = `Join TicketHawk with my referral code ${referralData.code} and we'll both get $25! Track ticket prices and never overpay again: ${window.location.origin}/register?ref=${referralData.code}`;
    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return <div className="loading-spinner">Loading referral data...</div>;
  }

  return (
    <div className="referrals-page">
      <div className="page-header">
        <h1>Referral Program</h1>
        <p className="page-subtitle">
          Earn $25 for every friend you refer to TicketHawk
        </p>
      </div>

      {/* Stats Cards */}
      <div className="referral-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{referralData.totalReferrals}</div>
            <div className="stat-label">Total Referrals</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">${referralData.pendingRewards}</div>
            <div className="stat-label">Pending Rewards</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">${referralData.earnedRewards}</div>
            <div className="stat-label">Total Earned</div>
          </div>
        </div>
      </div>

      <div className="referral-content">
        {/* Referral Link Section */}
        <div className="referral-section card">
          <div className="card-header">
            <h2 className="card-title">Your Referral Code</h2>
          </div>
          
          <div className="referral-code-section">
            <div className="referral-code">
              <span className="code-label">Referral Code:</span>
              <span className="code-value">{referralData.code}</span>
            </div>
            
            <div className="referral-link">
              <span className="link-label">Referral Link:</span>
              <div className="link-container">
                <input
                  type="text"
                  className="link-input"
                  value={`${window.location.origin}/register?ref=${referralData.code}`}
                  readOnly
                />
                <button 
                  className="btn btn-primary"
                  onClick={copyReferralLink}
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>

          <div className="share-buttons">
            <h3>Share with friends:</h3>
            <div className="share-options">
              <button 
                className="share-btn email"
                onClick={shareViaEmail}
              >
                📧 Email
              </button>
              <button 
                className="share-btn sms"
                onClick={shareViaSMS}
              >
                💬 SMS
              </button>
              <button 
                className="share-btn social"
                onClick={copyReferralLink}
              >
                🔗 Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="how-it-works card">
          <div className="card-header">
            <h2 className="card-title">How It Works</h2>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Share Your Link</h3>
                <p>Send your unique referral link to friends and family</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Friend Signs Up</h3>
                <p>They create an account using your referral code</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Both Get Rewarded</h3>
                <p>You both receive $25 in account credits</p>
              </div>
            </div>
          </div>

          <div className="program-benefits">
            <h3>Program Benefits:</h3>
            <ul>
              <li>✅ $25 for you, $25 for your friend</li>
              <li>✅ No limit on referrals</li>
              <li>✅ Credits applied instantly</li>
              <li>✅ Use credits for premium subscriptions</li>
            </ul>
          </div>
        </div>

        {/* Referral History */}
        <div className="referral-history card">
          <div className="card-header">
            <h2 className="card-title">Referral History</h2>
          </div>
          
          {referralData.referralHistory.length > 0 ? (
            <div className="history-list">
              {referralData.referralHistory.map((referral) => (
                <div key={referral.id} className="history-item">
                  <div className="referral-info">
                    <div className="referral-email">{referral.email}</div>
                    <div className="referral-date">
                      {new Date(referral.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="referral-status">
                    <span className={`status-badge ${referral.status}`}>
                      {referral.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                    <div className="reward-amount">
                      ${referral.reward}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-history">
              <div className="empty-icon">👥</div>
              <h3>No referrals yet</h3>
              <p>Start sharing your referral link to earn rewards!</p>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="referral-terms card">
          <div className="card-header">
            <h2 className="card-title">Terms & Conditions</h2>
          </div>
          
          <div className="terms-content">
            <ul>
              <li>Both the referrer and referred user must maintain active accounts</li>
              <li>Referral credits are applied within 24 hours of successful signup</li>
              <li>Credits can be used towards premium subscriptions and features</li>
              <li>Self-referrals and fake accounts are prohibited</li>
              <li>TicketHawk reserves the right to modify or terminate the program</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
