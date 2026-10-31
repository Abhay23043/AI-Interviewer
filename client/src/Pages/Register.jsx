import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { motion } from 'motion/react'
import { AiFillThunderbolt } from 'react-icons/ai'
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { FaArrowRightLong, FaGithub } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'
import { GrCopy } from 'react-icons/gr'
import { MdOutlineBarChart } from 'react-icons/md'
import { SlCalender } from 'react-icons/sl'
import { setUserData } from '../redux/userSlice'
import { ServerUrl } from '../App'
import './style/register.css'
import LoadingEffect from '../assets/animatedSvg/eclipse.svg'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleRegister = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    if (!acceptedTerms) {
      setErrorMessage('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await axios.post(`${ServerUrl}/api/auth/register`, { name, email, password }, { withCredentials: true })
      localStorage.setItem("token", result.data.token)
      axios.defaults.headers.common.Authorization = `Bearer ${result.data.token}`
      dispatch(setUserData(result.data.user))
      navigate('/')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to create your account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="register-page">
      <motion.div className="register-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <section className="register-art" aria-label="Interview preparation features">
          <div className="register-art-shade" />
          <div className="register-brand register-brand-light">
            <span className="register-brand-icon"><AiFillThunderbolt size={19} /></span>
            <span><strong>Interview<span>WithAI.ai</span></strong><small>AI-Powered Mock Interview Platform</small></span>
          </div>
          <div className="register-art-copy">
            <h1>Start Your<br /><span>Interview Journey</span></h1>
            <p>Create your account and get AI-powered interview questions, personalized feedback, and a detailed preparation plan.</p>
          </div>
          <div className="register-features">
            <div className="register-feature">
              <span className="register-feature-icon"><GrCopy size={17} /></span>
              <span><strong>AI Generated Questions</strong><small>Role specific &amp; updated</small></span>
            </div>
            <div className="register-feature">
              <span className="register-feature-icon"><MdOutlineBarChart size={19} /></span>
              <span><strong>Detailed Analysis</strong><small>Strengths, weaknesses &amp; skill gaps</small></span>
            </div>
            <div className="register-feature">
              <span className="register-feature-icon"><SlCalender size={17} /></span>
              <span><strong>Personalized Plan</strong><small>Day-wise preparation to get job ready</small></span>
            </div>
          </div>
          <div className="register-robot" aria-hidden="true" />
        </section>

        <section className="register-form-panel">
          <div className="register-brand register-brand-dark">
            <span className="register-brand-icon"><AiFillThunderbolt size={19} /></span>
            <span><strong>Interview<span>WithAI.ai</span></strong><small>AI-Powered Mock Interview Platform</small></span>
          </div>
          <header className="register-heading">
            <h2>Create Your Account</h2>
            <p>Join thousands of learners preparing with AI</p>
          </header>

          <form className="register-form" onSubmit={handleRegister}>
            <div className="register-field register-field-name">
              <FiUser aria-hidden="true" />
              <input aria-label="Full name" type="text" autoComplete="name" placeholder="Full Name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="register-field register-field-email">
              <FiMail aria-hidden="true" />
              <input aria-label="Email address" type="email" autoComplete="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="register-field register-field-password">
              <FiLock aria-hidden="true" />
              <input aria-label="Password" type={passwordVisible ? 'text' : 'password'} autoComplete="new-password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              <button className="register-visibility" type="button" aria-label={passwordVisible ? 'Hide password' : 'Show password'} onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <FiEyeOff /> : <FiEye />}</button>
            </div>
            <div className="register-field register-field-confirm">
              <FiLock aria-hidden="true" />
              <input aria-label="Confirm password" type={confirmPasswordVisible ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm Password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              <button className="register-visibility" type="button" aria-label={confirmPasswordVisible ? 'Hide password' : 'Show password'} onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>{confirmPasswordVisible ? <FiEyeOff /> : <FiEye />}</button>
            </div>

            <label className="register-terms">
              <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
              <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a></span>
            </label>
            {errorMessage && <p className="register-error" role="alert">{errorMessage}</p>}
            <button className="register-submit" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? (
                <span className='register-loading'>
                  <img src={ LoadingEffect } alt="loading" />
                </span>
                      
              ) :  ( <span>
                Create Account
                <FaArrowRightLong aria-hidden="true" /> 
              </span> )}</span>
            </button>
          </form>

          <div className="register-divider"><span>Or sign up with</span></div>
          <div className="register-socials">
            <button type="button" onClick={() => navigate('/google')}><FcGoogle size={17} />Continue with Google</button>
            <button type="button" disabled title="GitHub sign-up is not configured"><FaGithub size={17} />Continue with GitHub</button>
          </div>

          <p className="register-login">Already have an account? <Link to="/login">Login</Link></p>
        </section>
      </motion.div>
    </main>
  )
}

export default Register