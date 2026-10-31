import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaArrowRight, FaCalendarAlt, FaChartLine, FaClipboardList } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import './History.css'

const History = () => {
  const navigate = useNavigate()
  const serverUrl = import.meta.env.VITE_API_URL
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/interview/history`, { withCredentials: true })
        setInterviews(result.data.interviews || [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load interview history.')
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [serverUrl])

  const formatDate = (date) => date
    ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
    : 'Date unavailable'

  return (
    <div className="history-page">
      <Navbar />
      <main className="history-shell">
        <header className="history-header">
          <div>
            <span>Interview Dashboard</span>
            <h1>Interview History</h1>
            <p>Review your completed interviews and track your progress.</p>
          </div>
          <button type="button" onClick={() => navigate('/interview')}>Start New Interview</button>
        </header>

        {loading && <div className="history-state">Loading interview history...</div>}
        {!loading && error && <div className="history-state history-error">{error}</div>}
        {!loading && !error && interviews.length === 0 && (
          <div className="history-empty">
            <FaClipboardList />
            <h2>No completed interviews yet</h2>
            <p>Your interview reports will appear here after completion.</p>
            <button type="button" onClick={() => navigate('/interview')}>Start an Interview</button>
          </div>
        )}

        {!loading && !error && interviews.length > 0 && (
          <section className="history-grid">
            {interviews.map((interview, index) => {
              const score = Math.min(10, Math.max(0, Number(interview.finalScore) || 0))
              const percentage = Math.round(score * 10)
              return (
                <article className="history-card" key={interview._id || index}>
                  <div className="history-card-top">
                    <div className="history-icon"><FaChartLine /></div>
                    <span className="history-status">Completed</span>
                  </div>
                  <h2>{interview.role || 'Interview'}</h2>
                  <p className="history-mode">{interview.mode || 'Technical'} Interview <span>•</span> {interview.experience || 'Experience N/A'}</p>
                  <div className="history-score-row">
                    <div>
                      <strong>{score.toFixed(1)}</strong>
                      <span>/10</span>
                    </div>
                    <div className="history-score-track">
                      <div style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                  <footer>
                    <span><FaCalendarAlt /> {formatDate(interview.createdAt)}</span>
                    <button type="button" onClick={() => navigate(`/report/${interview._id}`)}>
                      View Report <FaArrowRight />
                    </button>
                  </footer>
                </article>
              )
            })}
          </section>
        )}
      </main>
    </div>
  )
}

export default History