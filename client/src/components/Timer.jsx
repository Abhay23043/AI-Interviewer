import React from 'react'
import './style/timer.css'

const Timer = ({ timeLeft, totalTime }) => {
    const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0
    const radius = 31
    const circumference = 2 * Math.PI * radius
    const dashOffset = circumference - (percentage / 100) * circumference

    return (
        <div className="timer-ring" aria-label={`${timeLeft} seconds remaining`}>
            <svg viewBox="0 0 76 76" role="img">
                <circle className="timer-trail" cx="38" cy="38" r={radius} />
                <circle
                    className="timer-progress"
                    cx="38"
                    cy="38"
                    r={radius}
                    style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}
                />
            </svg>
            <span className="timer-text">{timeLeft}s</span>
        </div>
    )
}

export default Timer