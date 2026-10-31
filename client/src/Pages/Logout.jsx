import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import { motion } from 'motion/react'
import { useDispatch } from 'react-redux'
import { clearUserData } from '../redux/userSlice'
import './style/logout.css'
import { TbLogin2 } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
const Logout = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleLogoutFun = async () => {
        try {
            await axios.get(`${ServerUrl}/api/auth/logout`, { withCredentials: true })
            //Redux state clear
            dispatch(clearUserData())
            //Redirect
            navigate('/')

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>

            <div className="square">
                Square
            </div>

            <div className="star">
                <FaStar size={150}/>
            </div>

            <div className='logout-page'>

                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1 }}
                    className="loading">
                    <div className="logout-logo">
                        <TbLogin2 className='logout-logo-color-purple' size={40} />

                    </div>

                    <h2>Do you really want to <span className='highlight' >logout?</span> </h2>
                    <div className="logout-para">
                        <p>
                            You'll need to login again to access your
                            interview preparation.
                        </p>
                    </div>
                    <div className="btns">

                        <motion.button
                            whileTap={{ scale: 1.02 }}
                            onClick={() => navigate('/')}
                            className='logout-false'>
                            No, Stay
                        </motion.button>

                        <motion.button

                            whileTap={{ scale: 1.02 }}
                            onClick={handleLogoutFun}
                            className='logout-true'>
                            <TbLogin2 size={20} />
                            Yes, Logout
                        </motion.button>


                    </div>

                </motion.div>
            </div>
        </>
    )
}

export default Logout