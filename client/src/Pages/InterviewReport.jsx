import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Step3Report from '../components/Step3Report'

const InterviewReport = () => {
  const { id } = useParams()
  const serverUrl = import.meta.env.VITE_API_URL
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadReport = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/interview/history/${id}`, { withCredentials: true })
        setReport(result.data)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load this interview report.')
      }
    }
    loadReport()
  }, [id, serverUrl])

  if (error) return <><Navbar /><div className="history-state history-error">{error}</div></>
  if (!report) return <><Navbar /><div className="history-state">Loading report...</div></>
  return <><Navbar /><Step3Report Report={report} /></>
}

export default InterviewReport