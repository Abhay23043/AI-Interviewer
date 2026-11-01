import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { FaArrowLeft, FaBolt, FaCheck, FaCrown, FaCreditCard, FaTimes, FaShieldAlt } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import './Pricing.css'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 100,
    amount: 199,
    description: 'Perfect for practicing a few interviews.',
    icon: <FaBolt />,
    features: ['100 interview credits', 'AI-generated questions', 'Detailed performance report']
  },
  {
    id: 'professional',
    name: 'Professional',
    credits: 300,
    amount: 499,
    description: 'Best value for regular interview preparation.',
    icon: <FaCrown />,
    popular: true,
    features: ['300 interview credits', 'All Starter features', 'Priority AI evaluation']
  },
  {
    id: 'premium',
    name: 'Premium',
    credits: 700,
    amount: 999,
    description: 'Maximum practice for serious candidates.',
    icon: <FaCreditCard />,
    features: ['700 interview credits', 'All Professional features', 'Extended interview access']
  }
]

const Pricing = () => {
  const navigate = useNavigate()
  const serverUrl = import.meta.env.VITE_API_URL
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState('')

  const openCheckout = async (plan) => {
    setMessage('')
    if (!userData) {
      setMessage('Please login before purchasing credits.')
      return
    }
    try {
      const result = await axios.post(`${serverUrl}/api/user/create-payment-order`, {
        planId: plan.id
      }, { withCredentials: true })
      setSelectedPlan({ ...plan, order: result.data })
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to start checkout.')
    }
  }

  const completeDummyPayment = async () => {
    if (!selectedPlan || processing) return
    setProcessing(true)
    setMessage('')
    try {
      const paymentId = `pay_demo_${Date.now()}`
      const result = await axios.post(`${serverUrl}/api/user/verify-payment`, {
        planId: selectedPlan.id,
        orderId: selectedPlan.order.orderId,
        paymentId
      }, { withCredentials: true })
      dispatch(setUserData({ ...userData, credits: result.data.credits }))
      setMessage(`Dummy payment successful. ${selectedPlan.credits} credits added.`)
      window.setTimeout(() => setSelectedPlan(null), 1200)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Dummy payment verification failed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="pricing-page">
      <Navbar />
      <main className="pricing-shell">
        <button className="pricing-back-button" type="button" onClick={() => navigate('/')}>
          <FaArrowLeft aria-hidden="true" />
          Back to Home
        </button>
        <header className="pricing-header">
          <span>Simple Credit Packages</span>
          <h1>Choose Your Practice Plan</h1>
          <p>Add credits and continue improving with AI-powered interviews.</p>
        </header>

        {message && !selectedPlan && <div className="pricing-message">{message}</div>}

        <section className="pricing-grid">
          {plans.map((plan) => (
            <article className={`pricing-card ${plan.popular ? 'popular' : ''}`} key={plan.id}>
              {plan.popular && <span className="popular-badge">Most Popular</span>}
              <div className="plan-icon">{plan.icon}</div>
              <h2>{plan.name}</h2>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-price">
                <strong>₹{plan.amount}</strong>
                <span>one time</span>
              </div>
              <div className="plan-credits">{plan.credits} credits</div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}><FaCheck /> {feature}</li>
                ))}
              </ul>
              <button type="button" onClick={() => openCheckout(plan)}>
                Buy {plan.credits} Credits
              </button>
            </article>
          ))}
        </section>
      </main>

      {selectedPlan && (
        <div className="checkout-overlay" role="dialog" aria-modal="true">
          <section className="checkout-modal">
            <button className="checkout-close" type="button" aria-label="Close" onClick={() => !processing && setSelectedPlan(null)}>
              <FaTimes />
            </button>
            <div className="razorpay-brand">
              <span>R</span>
              <strong>Test Payment</strong>
              <small>Dummy Checkout</small>
            </div>
            <div className="checkout-summary">
              <p>Purchasing <strong>{selectedPlan.name}</strong></p>
              <strong>₹{selectedPlan.amount}</strong>
            </div>
            <div className="dummy-notice">
              <FaShieldAlt />
              <span>This is a dummy payment. No real money will be charged.</span>
            </div>
            {message && <p className="checkout-message">{message}</p>}
            <button className="pay-button" type="button" disabled={processing} onClick={completeDummyPayment}>
              {processing ? 'Processing...' : `Pay ₹${selectedPlan.amount}`}
            </button>
          </section>
        </div>
      )}
    </div>
  )
}

export default Pricing
