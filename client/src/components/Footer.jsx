import React from 'react'
import './style/footer.css'
import { BsRobot } from 'react-icons/bs'

const Footer = () => {
  return (
    <div className='footer-body'>
      <div className='footersection1'>
        <div className='section1'>
          <div className='footer-head-data' >
            <BsRobot className='footer-icon' size={18} />
          </div>
          <h2 className='footer-heading'>InterviewWithAI</h2>
        </div>
        <p className='footer-para'>Al-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.</p>
      </div>
    </div>
  )
}

export default Footer