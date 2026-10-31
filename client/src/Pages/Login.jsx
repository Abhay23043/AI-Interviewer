import React, { useState } from 'react'
import './style/login.css'
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react'
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice'
import axios from 'axios';
import { AiFillThunderbolt } from "react-icons/ai";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRightLong } from "react-icons/fa6";
import { GrCopy } from "react-icons/gr";
import { MdOutlineBarChart } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { ServerUrl } from '../App';
import loadingEffect from '../assets/animatedSvg/eclipse.svg'
import threedotBounce from '../assets/animatedSvg/3-dots-bounce.svg'
const Login = () => {
    const [visivility, setVisivility] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogin = async (e) => {
        e.preventDefault()
        setErrorMessage('')


        setIsSubmitting(true)
        try {
            const result = await axios.post(`${ServerUrl}/api/auth/login`, { email, password }, { withCredentials: true })
            dispatch(setUserData(result.data.user))
            navigate('/')

        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Unable to Login your account. Please try again.')
            dispatch(setUserData(null))
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className='login-container'>
            <motion.div className="mainbox">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.1 }}
                    className="box1">
                    <div className="heading">
                        <div className="heading-icon">
                            <AiFillThunderbolt className='sparkle-icon' size={20} />

                        </div>

                        <div className="heading-data">
                            <h3 className="heading-title">Interview<span className="highlight">WithAI.ai</span></h3>
                            <p>AI-Powered Mock Interview Platform</p>
                        </div>
                    </div>
                    <div className="login-greet">
                        <div className="welcoming">
                            <h3>Welcome Back👋</h3>
                        </div>
                        <div className='login-para'>
                            <p>Login to continue your interview preparation journey</p>
                        </div>
                    </div>
                    <div className="input-fields">
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <FiMail className="input-icon" />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                />
                            </div>

                            <div className="input-group">
                                <FiLock className="input-icon" />

                                <input
                                    type={visivility ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                                {visivility ? (
                                    <FiEyeOff
                                        onClick={() => setVisivility(false)}
                                        className='password-icon'
                                    />

                                ) : (
                                    <FiEye
                                        onClick={() => setVisivility(true)}
                                        className='password-icon'
                                    />
                                )}

                            </div>
                            <div className="line6">
                                <div className="keepmeSignin">
                                    <input type="checkbox" />
                                    <p>keep me signed in</p>
                                </div>
                                <div className="forgotPass">
                                    <a href="/forgot">Forgot password?</a>
                                </div>
                            </div>
                            {errorMessage && <p className="register-error" role="alert">{errorMessage}</p>}
                            <div className="loginBtn">
                                <button type='submit' className="login-btn" disabled={isSubmitting}>
                                    <span>{
                                        isSubmitting ? (<span className="user-loading">
                                            <img src={loadingEffect} alt="Loading" />

                                        </span>) : (
                                            <span>
                                                <span>Login</span>
                                                <FaArrowRightLong className="login-icon" />
                                            </span>
                                        )}</span>


                                </button>
                            </div>

                        </form>

                    </div>

                    <div className="line7">
                        <div className="otherlogin">

                            <hr />
                            <span>Or continue with</span>
                            <hr />


                        </div>
                    </div>
                    <div className="otherloginbtns">
                        <motion.button
                            onClick={() => navigate('/google')}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}

                            className='googleBtn'>
                            <FcGoogle size={18} />
                            Continue with Google
                        </motion.button>
                    </div>
                    <div className="signUp">
                        <p className='signup-data'>
                            Don't have an account? <a href="/signup">Sign up</a>
                        </p>
                    </div>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.1 }}
                    className="box2">
                    <div className="container2">
                        <div className="container-data">
                            <div className="headofBox2">
                                <h2 className='first-sent'>Crack Your</h2> <br />
                                <h2 className='second-sent'>Dream Interview</h2>
                                <p><small>Get Al-powered interview questions, personalized
                                    feedback, and a detailed preparation plan.</small></p>
                            </div>
                            <div className="boxes">
                                <div className="bblock">
                                    <div className="b1">
                                        <GrCopy size={18} />

                                    </div>
                                    <div className="bdata">
                                        <h3>Al Generated <br />
                                            Questions</h3>
                                        <p>Role specific & updated</p>
                                    </div>

                                </div>
                                <div className="bblock">
                                    <div className="b2">
                                        <MdOutlineBarChart size={18} />
                                    </div>
                                    <div className="bdata">
                                        <h3>Detailed Analysis</h3>
                                        <p>Strengths, weaknesses <br />
                                            & skill gaps</p>
                                    </div>

                                </div>
                                <div className="bblock">

                                    <div className="b3">
                                        <SlCalender size={18} />
                                    </div>
                                    <div className="bdata">
                                        <h3>Personalized Plan</h3>
                                        <p>Day-wise preparation <br />
                                            to get job ready</p>
                                    </div>

                                </div>
                            </div>
                            <div className="robot">

                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

        </div>
    )
}

export default Login