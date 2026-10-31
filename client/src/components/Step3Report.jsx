import React from 'react'
import {
    FaDownload, FaBullseye, FaComments, FaCheckCircle,
    FaRedo, FaHome, FaClock, FaMedal
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import './style/s3.css'

const safeNumber = (value) => Math.min(10, Math.max(0, Number(value) || 0))

const Step3Report = ({ Report }) => {
    const navigate = useNavigate()
    const report = Report || {}
    const questions = report.questionWiseScore || []
    const finalScore = safeNumber(report.finalScore)
    const percentage = Math.round((finalScore / 10) * 100)

    const metrics = [
        { label: 'Confidence', value: safeNumber(report.confidence), icon: <FaBullseye /> },
        { label: 'Communication', value: safeNumber(report.communication), icon: <FaComments /> },
        { label: 'Correctness', value: safeNumber(report.correctness), icon: <FaCheckCircle /> },
    ]

    const performanceLabel = percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : percentage >= 40 ? 'Needs Improvement' : 'Needs Practice'

    const downloadReport = () => window.print()

    return (
        <main className="s3-page">
            <section className="s3-report">
                <header className="s3-header">
                    <div>
                        <span className="s3-eyebrow">InterviewwithAI</span>
                        <h1>Performance Report</h1>
                        <p>{report.role || 'Interview'} <span>•</span> {report.mode || 'Technical'} <span>•</span> {report.experience || 'Experience not provided'}</p>
                    </div>
                    <button className="download-report" type="button" onClick={downloadReport}>
                        <FaDownload /> Download PDF
                    </button>
                </header>

                <section className="score-grid">
                    <article className="overall-card">
                        <div className="score-ring" style={{ '--score': `${percentage * 3.6}deg` }}>
                            <div className="score-ring-inner">
                                <strong>{finalScore.toFixed(1)}</strong>
                                <span>/ 10</span>
                            </div>
                        </div>
                        <div>
                            <span className="card-label">Overall Score</span>
                            <h2 className='color-highlight'>{performanceLabel}</h2>
                            <p>{percentage}% performance score</p>
                        </div>
                    </article>

                    <article className="metric-card">
                        <div className="metric-heading">
                            <FaMedal />
                            <span>Skill Breakdown</span>
                        </div>
                        {metrics.map((metric) => (
                            <div className="metric-row" key={metric.label}>
                                <div className="metric-name">
                                    <span>{metric.icon}{metric.label}</span>
                                    <strong>{metric.value.toFixed(1)}</strong>
                                </div>
                                <div className="metric-track">
                                    <div className="metric-fill" style={{ width: `${metric.value * 10}%` }} />
                                </div>
                            </div>
                        ))}
                    </article>
                </section>

                <section className="question-section">
                    <div className="section-title">
                        <div>
                            <span>Detailed Analysis</span>
                            <h2>Question-wise Performance</h2>
                        </div>
                        <span className="question-total">{questions.length} Questions</span>
                    </div>

                    <div className="question-list">
                        {questions.map((item, index) => {
                            const score = safeNumber(item.score)
                            const answer = item.answer || report.answers?.[index]?.answer
                            return (
                                <article className="question-card" key={`${item.question}-${index}`}>
                                    <div className="question-number">{index + 1}</div>
                                    <div className="question-content">
                                        <div className="question-top">
                                            <h3>{item.question}</h3>
                                            <span className="question-score">{score.toFixed(1)}/10</span>
                                        </div>
                                        <div className="question-score-track">
                                            <div style={{ width: `${score * 10}%` }} />
                                        </div>
                                        {answer && <p className="candidate-answer"><strong>Your answer:</strong> {answer}</p>}
                                        <p className="feedback-text">{item.feedback || 'No feedback was generated for this answer.'}</p>
                                        <div className="mini-metrics">
                                            <span><small>Confidence</small><b>{safeNumber(item.confidence).toFixed(1)}</b></span>
                                            <span><small>Communication</small><b>{safeNumber(item.communication).toFixed(1)}</b></span>
                                            <span><small>Correctness</small><b>{safeNumber(item.correctness).toFixed(1)}</b></span>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                        {!questions.length && (
                            <div className="empty-report">No question results are available for this interview.</div>
                        )}
                    </div>
                </section>

                <footer className="s3-actions">
                    <button type="button" className="secondary-action" onClick={() => navigate('/')}>
                        <FaHome /> Back to Home
                    </button>
                    <button type="button" className="primary-action" onClick={() => navigate('/interview')}>
                        <FaRedo /> Try Another Interview
                    </button>
                </footer>
            </section>
        </main>
    )
}

export default Step3Report