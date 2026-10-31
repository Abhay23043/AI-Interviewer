import React, { useState } from 'react'
import { motion } from "motion/react"
import { ServerUrl } from '../App'
import '../Pages/style/auth.css'
import axios from 'axios'
import { AiFillThunderbolt } from 'react-icons/ai'
import { FcGoogle } from "react-icons/fc";
import { FaArrowRightLong } from 'react-icons/fa6'
import { GrCopy } from 'react-icons/gr'
import { MdOutlineBarChart, MdOutlineLogin } from 'react-icons/md'
import { SlCalender } from 'react-icons/sl'
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import loadingEffect from '../assets/animatedSvg/eclipse.svg'
function Auth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleGoogleAuth = async () => {
        setErrorMessage('')
        setIsSubmitting(true)
        try {
            const response = await signInWithPopup(auth, provider)
            const name = response.user.displayName
            const email = response.user.email
            const result = await axios.post(`${ServerUrl}/api/auth/google`, { name, email }, { withCredentials: true })
            localStorage.setItem("token", result.data.token)
            axios.defaults.headers.common.Authorization = `Bearer ${result.data.token}`
            dispatch(setUserData(result.data.user))
            navigate('/')

        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Unable to login your google account. Please try again.')
            dispatch(setUserData(null))
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="auth-screen">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="auth-card">
                <section className="auth-art" aria-label="Interview preparation features">
                    <div className="auth-art-shade" />
                    <div className="auth-brand auth-brand-light">
                        <span className="auth-brand-icon"><AiFillThunderbolt size={19} /></span>
                        <span><strong>Interview<span>WithAI.ai</span></strong><small>AI-Powered Mock Interview Platform</small></span>
                    </div>
                    <div className="auth-art-copy">
                        <h1>Show Up<br /><span>Interview Ready</span></h1>
                        <p>Practice with AI, understand your strengths, and build a clear path toward your next opportunity.</p>
                    </div>
                    <div className="auth-highlights">
                        <div className="auth-highlight">
                            <span className="auth-highlight-icon"><GrCopy size={17} /></span>
                            <span><strong>Practice with purpose</strong><small>Questions tailored to your role</small></span>
                        </div>
                        <div className="auth-highlight">
                            <span className="auth-highlight-icon"><MdOutlineBarChart size={19} /></span>
                            <span><strong>Know where you stand</strong><small>Clear, detailed performance insights</small></span>
                        </div>
                        <div className="auth-highlight">
                            <span className="auth-highlight-icon"><SlCalender size={17} /></span>
                            <span><strong>Keep making progress</strong><small>A personalized preparation plan</small></span>
                        </div>
                    </div>
                    <div className="auth-robot" aria-hidden="true" />
                </section>

                <section className="auth-panel">
                    <div className="auth-brand auth-brand-dark">
                        <span className="auth-brand-icon"><AiFillThunderbolt size={19} /></span>
                        <span><strong>Interview<span>WithAI.ai</span></strong><small>AI-Powered Mock Interview Platform</small></span>
                    </div>
                    <div className="auth-welcome">
                        <span className="auth-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
                        <h2>Welcome back</h2>
                        <p>Sign in to continue your interview preparation journey.</p>
                    </div>
                    <div className="auth-actions">
                        <motion.button
                            onClick={() => navigate('/login')}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.99 }}
                            className="auth-email-button">
                            <MdOutlineLogin size={17} />
                            <span>Sign in with Email</span>
                            <FaArrowRightLong className="auth-button-arrow" />
                        </motion.button>
                        <div className="auth-divider"><span>Or continue with</span></div>
                        <motion.button
                            onClick={handleGoogleAuth}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.99 }}
                            className="auth-google-button">

                            {isSubmitting ?
                                (<span className="google-loading">
                                    <img src={loadingEffect} alt="Loading" />

                                </span>)
                                : (<>
                                    <FcGoogle size={18} />
                                    <span>Continue with Google</span>
                                </>)}
                        </motion.button>
                    </div>
                    {errorMessage && <p className="register-error" role="alert">{errorMessage}</p>}

                    <p className="auth-signup">New to InterviewWithAI? <a href="/signup">Create an account</a></p>
                </section>
            </motion.div>
        </main>
    )
}

export default Auth