import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom';
// importing icons
import { HiSparkles } from "react-icons/hi";


import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux';
import { BsBarChart, BsClock, BsFileEarmark, BsFileEarmarkText, BsMic, BsRobot } from 'react-icons/bs';

import hrImg from "../assets/HR.png"
// import aiImg from "../assets/AI.png"
// import interviewImg from "../assets/interview.png"
// import performanceImg from "../assets/performance.png"
// import feedbackImg from "../assets/feedback.png"
// import historyImg from "../assets/history.png"
import techImg from "../assets/tech.png"
import confidenceImg from "../assets/confi.png"
import creditImg from "../assets/credit.png"
import evalImg from "../assets/ai-ans.png"
import resumeImg from "../assets/resume.png"
import pdfImg from "../assets/pdf.png"
import analyticsImg from "../assets/history.png"
import Footer from '../components/Footer';

import './style/HomeBody.css'

const HomeBody = () => {
    const { userData } = useSelector((state) => state.user)
    const navigate = useNavigate()
    return (
        <div className="body1">
            <div className="heroSection1">
                <span>
                    <HiSparkles className='hero-sparkle' />
                    <p className='hero-para'>AI Powered Smart Interview Platform</p>
                </span>
            </div>
            <div className="heroSection2">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span><strong>Practice Interviews with </strong></span>
                    <span className='hero-highlight'>AI Intelligence</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.1 }}
                    className='hero-para1'>
                    Role-based mock interviews with smart follow-ups,
                    adaptive difficulty and real-time performance
                    evaluation.
                </motion.p>
            </div>
            <div className="heroSection3">
                <motion.button
                    onClick={() => {
                        if (!userData) {
                            navigate('/google')
                            return
                        }
                        navigate('/interview')

                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    // transition={{ duration: 1.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='hero-btn interview-btn'
                >
                    Start Interview
                </motion.button>
                <motion.button

                    onClick={() => {
                        if (!userData) {
                            navigate('/google')
                            return
                        }
                        navigate('history')
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='hero-btn history-btn'
                >History</motion.button>
            </div>

            <div className="herosection4">
                {
                    [
                        {
                            icon: <BsRobot size={24} />,
                            step: "STEP 1",
                            title: "Role & Experience Selection",
                            desc: "AI adjusts difficulty based on selected job role."

                        },
                        {
                            icon: <BsMic size={24} />,
                            step: "STEP 2",
                            title: "Smart Voice Interview",
                            desc: "Dynamic follow-up questions based on your answers."
                        },
                        {
                            icon: <BsClock size={24} />,
                            step: "STEP 3",
                            title: "Timer Based Simulation",
                            desc: "Real interview pressure with time tracking."
                        }



                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 + index * 0.2 }}
                            animate={{
                                rotate:
                                    index === 0 ? -4 :
                                        index === 1 ? 3 :
                                            index === 2 ? -3 : 0
                            }}
                            whileHover={{
                                scale: 1.06,
                                y: -10,
                                transition: {
                                    duration: 0.1
                                }
                            }}
                            className={`steps-boxes card-${index}`}>
                            <div className="cards-icon">
                                {item.icon}
                            </div>
                            <div className="cards-data">
                                <div className='item-step' >{item.step}</div>
                                <h3 className='item-title'>{item.title}</h3>
                                <p className='item-desc'>{item.desc}</p>
                            </div>
                        </motion.div>
                    ))
                }



            </div>

            <div className="herosection5">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='section2'>
                    Advanced AI {" "}
                    <span className='green-text'>Capabilities</span>
                </motion.h2>
                <div className="grid-section">
                    {
                        [
                            {
                                image: evalImg,
                                icon: <BsBarChart size={20} />,
                                title: "AI Answer Evaluation",
                                desc: "scores communication, technical accuracy and confidence."
                            },
                            {
                                image: resumeImg,
                                icon: <BsFileEarmarkText size={20} />,
                                title: "Resume Based Interview",
                                desc: "Project-specific interview questions based on your resume."
                            },
                            {
                                image: pdfImg,
                                icon: <BsFileEarmarkText size={20} />,
                                title: "PDF Based Interview",
                                desc: "Upload PDFs to generate role-specific interview questions."
                            },
                            {
                                image: analyticsImg,
                                icon: <BsClock size={20} />,
                                title: "Performance Analytics",
                                desc: "Detailed performance metrics and improvement suggestions."
                            }

                        ].map((item, index) => (
                            <motion.div

                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.01, transition: { duration: 0.1 } }}
                                key={index} className='grid-item' >

                                <div className="grid-full-data">
                                    <div className="grid-img">
                                        <img className='gridImg' src={item.image} alt={item.title} />
                                    </div>
                                    <div className="grid-data">
                                        <div className="gridIcon">
                                            {item.icon}
                                        </div>
                                        <h3 className='gridTitle'>{item.title}</h3>
                                        <p className='gridDesc'>{item.desc}</p>
                                    </div>
                                </div>

                            </motion.div>
                        ))
                    }
                </div>

            </div>

            <div className="herosection5">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='section2'>
                    Multiple Interview{" "}
                    <span className='green-text'>Modes</span>
                </motion.h2>
                <div className="grid-section">
                    {
                        [
                            {
                                image: hrImg,
                                title: "HR Interview Mode",
                                desc: "Behavioral and communication based evaluation."
                            },
                            {
                                image: techImg,
                                title: "Technical Mode",
                                desc: "Deep technical questioning based on selected role."
                            },
                            {
                                image: confidenceImg,
                                title: "Confidence Detection",
                                desc: "Basic tone and voice analysis insights. "
                            },
                            {
                                image: creditImg,
                                title: "Credit System",
                                desc: "Unlock premium interview sessions easily."
                            }

                        ].map((mode, index) => (
                            <motion.div

                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.01, transition: { duration: 0.1 } }}
                                key={index} className='grid-item' >

                                <div className="grid-full-data2 grid-full-data">

                                    <div className="grid-data">
                                        <h3 className='gridTitle'>{mode.title}</h3>
                                        <p className='gridDesc'>{mode.desc}</p>
                                    </div>
                                    <div className="grid-img2">
                                        <img className='gridImg gridImg2' src={mode.image} alt={mode.title} />
                                    </div>
                                </div>

                            </motion.div>
                        ))
                    }
                </div>

            </div>


        </div>
    )
}

export default HomeBody