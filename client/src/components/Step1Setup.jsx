import React, { useState } from 'react'
import './style/s1.css'
import { motion } from 'motion/react'
import loadingEffect from '../assets/animatedSvg/eclipse.svg'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice.js'

import {
  FaUserTie,
  FaBriefcase,

  FaChartLine,
  FaMicrophoneAlt,
  FaUpload,
} from 'react-icons/fa'
const Step1Setup = ({ onStart }) => {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [role, setRole] = useState('')
  const [experience, setExperience] = useState('')
  const [mode, setMode] = useState("TECHNICAL")
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [resumeText, setResumeText] = useState("")
  const [analysisDone, setAnalysisDone] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')


  const serverUrl = import.meta.env.VITE_API_URL

  const handleUploadResume = async () => {
    setErrorMessage('')
    if (!resumeFile || analyzing) return;
    setAnalyzing(true)
    const formdata = new FormData()
    formdata.append("resume", resumeFile)

    try {
      console.log(serverUrl)
      const result = await axios.post(`${serverUrl}/api/interview/resume`, formdata, { withCredentials: true });
      console.log(result.data)
      console.log(result.data)

      setRole(result.data.role || "")
      setExperience(result.data.experience || "")
      setProjects(result.data.projects || [])
      setSkills(result.data.skills || [])
      setResumeText(result.data.resumeText || "")
      setAnalysisDone(true)
      setAnalyzing(false)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to upload your resume. Please try again later.')

      console.error(
        "Resume Analysis Error:",
        error.response?.data || error.message
      );
    } finally {

      setAnalyzing(false);
    }
  }


  const handleStart = async () => {
    if (!role.trim() || !experience.trim() || loading) return;

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/generate-questions`,
        {
          role: role.trim(),
          experience: experience.trim(),
          mode,
          resumeText,
          projects,
          skills,
        },
        {
          withCredentials: true,
        }
      );

      // Check the response received from the backend
      console.log("Interview API Response:", result.data);

      // Validate the response
      if (
        !result.data?.interviewId ||
        !Array.isArray(result.data?.questions)
      ) {
        setErrorMessage(error.response?.data?.message || 'Invalid interview response from server.')

        throw new Error("Invalid interview response from server");

      }

      // Update user credits
      if (userData) {
        dispatch(
          setUserData({
            ...userData,
            credits: result.data.creditsLeft,
          })
        );
      }

      // Send interview data to the parent component
      onStart(result.data);

    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to Start Interview. Please try again.')
      console.error(error.message)
    } finally {
      setLoading(false);
    }
  };





  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='s1body1'>
      <div className="area">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className='leftarea'>
          <h2 className='s1h2'>Start Your AI Interview</h2>
          <p>
            Practice real interview scenarios powered by AI.
            Improve communication, technical skills, and confidence.
          </p>
          <motion.div className='downarea'>
            <div className="s1list">
              {[
                {
                  icon: <FaUserTie className='s1icon' />,
                  text: "Choose Role & Experience",
                },
                {
                  icon: <FaMicrophoneAlt className='s1icon' />,
                  text: "Smart Voice Interview",
                },
                {
                  icon: <FaChartLine className='s1icon' />,
                  text: "Performance Analytics",
                },

              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                  className='s1listdata'
                >
                  {item.icon}
                  <span className='s1span'>{item.text}</span>
                </motion.div>
              ))

              }
            </div>
          </motion.div>

        </motion.div>

        <motion.div
          className='rightarea'
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2>Interview Setup</h2>
          <div className='s1parinp'>
            <div className='s1inp'>
              <FaUserTie className='s1usericon' />

              <input type="text" placeholder='Enter role' className='s1input'
                onChange={(e) => setRole(e.target.value)} value={role}
              />
            </div>
            <div className='s1inp'>
              <FaBriefcase className='s1usericon' />

              <input type="text" placeholder='Experience (e.g. 2 years)' className='s1input'
                onChange={(e) => setExperience(e.target.value)} value={experience}
              />


            </div>
            <select
              onChange={(e) => setMode(e.target.value)}
              name="s1select" value={mode} className='s1select'>
              <option value="TECHNICAL">Technical Interview</option>
              <option value="HR">HR Interview</option>

            </select>

            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => document.getElementById("resumeUpload").click()}
                className='s1upload'>
                <FaUpload className='uploadIcon' />
                <input
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  type="file" name="resume" id="resumeUpload" accept='application/pdf' className='hidden' />
                <p>
                  {resumeFile ? resumeFile.name : "Click to upload resume(Optional)"}
                </p>

                {resumeFile && (
                  <motion.button
                    onClick={(e) => { e.stopPropagation(), handleUploadResume() }}
                    whileHover={{ scale: 1.02 }}
                    className='s1btn'>
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}


            {/* Project Block */}
            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='s1skillpro'>
                <h3>Resume Analysis Result</h3>
                {projects.length > 0 && (
                  <div className='s1data-0'>
                    <p className='s1projectsdata'>
                      Projects:</p>
                    <ul>
                      {projects.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}

                    </ul>
                  </div>

                )}
              </motion.div>
            )}
            {/* skill block */}

            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='s1skillpro'>
                {projects.length > 0 && (
                  <div className='s1data-1'>
                    <p className='s1skillsdata'>
                      Skills:</p>
                    <div className='skilldata'>
                      {skills.map((p, i) => (
                        <span className='skilldata-1' key={i}>{p}</span>
                      ))}

                    </div>
                  </div>

                )}
              </motion.div>
            )}

            {errorMessage && <p className='error-message' role='alert' >{errorMessage}</p>}

            {!analysisDone ? (
              <motion.button
                onClick={handleStart}
                disabled={!role || !experience || loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className='s1subbtn'>
                {loading ? (<span className="user-loading">
                  <img src={loadingEffect} alt="Loading" />

                </span>) : "Start Interview"}
              </motion.button>
            ) : (
              <motion.button
                onClick={handleStart}
                disabled={!role || !experience || loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className='s1subbtn2'>
                {loading ? (<span className="user-loading">
                  <img src={loadingEffect} alt="Loading" />

                </span>) : "Start Interview"}
              </motion.button>
            )}


          </div>

        </motion.div>


      </div>
    </motion.div>
  )
}

export default Step1Setup