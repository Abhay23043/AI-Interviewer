import React, { useState } from 'react'
import { motion } from 'motion/react'
import './style/navbar.css'
import { useSelector } from 'react-redux'
import { BsCoin, BsRobot } from 'react-icons/bs'
// import { FaUserAstronaut } from 'react-icons/fa'
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom'
import { IoLogOutOutline } from "react-icons/io5";
const Navbar = () => {
    const { userData } = useSelector((state) => state.user)
    const [showCreditPopup, setShowCreditPopup] = useState(false)
    const [showUserPopup, setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    return (
        <div className='Navbar-body'>
            <motion.div
                
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="navbar-container">
                <div className="main-logo">
                    <div className="logo-icon">
                        <BsRobot size={18} />
                    </div>
                    <h3 className='site-main-text'>InterviewWithAI</h3>
                </div>
                <div className="page-navigations">
                    <div className="credits">
                        <button
                            onClick={() => {
                                if (!userData) {
                                    navigate('/google')
                                    return
                                }
                                setShowCreditPopup(!showCreditPopup)
                                setShowUserPopup(false)
                            }}
                            className='coin-data'>
                            <BsCoin size={20} />
                            {userData?.credits || 0}
                        </button>

                        {showCreditPopup && (
                            <div className='popupScreen' >
                                <p className='buy-coins-para'>
                                    Need more credits to continue interviews?
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.01, backgroundColor: "#424141" }}
                                    whileTap={{ scale: 0.99, backgroundColor: "#9e9a9a" }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => navigate('/pricing')}
                                    className='navigateToPricing'>
                                    Buy more credits
                                </motion.button>
                            </div>
                        )}
                    </div>

                    <div className="user-logo">
                        <motion.button
                            onClick={() => {
                                setShowUserPopup(!showUserPopup)
                                setShowCreditPopup(false)
                            }}
                            className='user-data'>
                            {userData?.name
                                ? userData.name.slice(0, 1).toUpperCase()
                                : <CgProfile size={20} />
                            }
                        </motion.button>
                        {showUserPopup && (
                            <div className="usersData">
                                <p>
                                    <CgProfile
                                        className='profile-icon' />
                                    {userData ? userData?.name : (<a href="/google">Login</a>)}</p>
                                <button
                                    onClick={() => {
                                        if (!userData) {
                                            navigate('/google')
                                            return
                                        }
                                        navigate('/history')
                                    }}
                                    className='history-data btn'>Interview History</button> <br />
                                <button
                                    onClick={() => {
                                        if (!userData) {
                                            navigate('/google')
                                            return
                                        }
                                        navigate('/logout')
                                    }}
                                    className='logout-btn btn'
                                >
                                    <IoLogOutOutline />
                                    Logout</button>
                            </div>
                        )}
                    </div>
                </div>

            </motion.div >
        </div >
    )
}

export default Navbar