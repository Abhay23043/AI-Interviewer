import React, { useEffect, useRef, useState } from 'react'
import { FaMicrophone } from 'react-icons/fa'
import Timer from './Timer'
import femaleVideo from '../assets/Videos/female-ai.mp4'
import './style/s2.css'
import axios from 'axios'

const Step2Interview = ({ interviewData, onFinish }) => {
    const { interviewId, questions = [], userName } = interviewData || {}
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answer, setAnswer] = useState('')
    const [answers, setAnswers] = useState([])

    const currentQuestion = questions[currentIndex]
    const questionText = typeof currentQuestion === 'string'
        ? currentQuestion
        : currentQuestion?.question || currentQuestion?.text || 'First Question'
    const totalTime = typeof currentQuestion === 'object' && Number.isFinite(currentQuestion?.timeLimit)
        ? currentQuestion.timeLimit
        : 30
    const [timeLeft, setTimeLeft] = useState(totalTime)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [micError, setMicError] = useState('')
    const [interviewPhase, setInterviewPhase] = useState('greeting')
    const videoRef = useRef(null)
    const recognitionRef = useRef(null)
    const shouldListenRef = useRef(false)
    const restartMicRef = useRef(null)

    const speakText = (text, onComplete) => {
        if (!('speechSynthesis' in window) || !text) {
            if (typeof onComplete === 'function') onComplete()
            return
        }

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-IN'
        utterance.rate = 0.9
        utterance.pitch = 1
        const voices = window.speechSynthesis.getVoices()
        const femaleVoice = voices.find((voice) =>
            /female|samantha|zira|hazel|heera|priya|neerja|google uk english female/i.test(voice.name)
        )
        const indianFemaleVoice = voices.find((voice) =>
            voice.lang?.toLowerCase().startsWith('en-in') &&
            /female|samantha|priya|neerja/i.test(voice.name)
        )
        if (indianFemaleVoice || femaleVoice) {
            utterance.voice = indianFemaleVoice || femaleVoice
        }
        utterance.onstart = () => {
            setIsSpeaking(true)
            if (videoRef.current) {
                videoRef.current.currentTime = 0
                videoRef.current.play().catch(() => {})
            }
        }
        utterance.onend = () => {
            setIsSpeaking(false)
            if (videoRef.current) {
                videoRef.current.pause()
                videoRef.current.currentTime = 0
            }
            if (typeof onComplete === 'function') onComplete()
        }
        utterance.onerror = () => {
            setIsSpeaking(false)
            if (videoRef.current) {
                videoRef.current.pause()
                videoRef.current.currentTime = 0
            }
            if (typeof onComplete === 'function') onComplete()
        }
        window.speechSynthesis.speak(utterance)
    }

    useEffect(() => {
        if (!questionText) return
        const timer = window.setTimeout(() => {
            if (currentIndex === 0 && interviewPhase === 'greeting') {
                const greeting = `Hello${userName ? ` ${userName}` : ''}. Welcome to your AI interview. The interview will begin now.`
                speakText(greeting, () => {
                    setInterviewPhase('question')
                    speakText(questionText)
                })
            } else {
                setInterviewPhase('question')
                speakText(questionText)
            }
        }, 300)
        return () => {
            window.clearTimeout(timer)
            window.speechSynthesis?.cancel()
            setIsSpeaking(false)
            if (videoRef.current) {
                videoRef.current.pause()
                videoRef.current.currentTime = 0
            }
        }
    }, [currentIndex, questionText, userName])

    useEffect(() => {
        return () => {
            shouldListenRef.current = false
            if (restartMicRef.current) window.clearTimeout(restartMicRef.current)
            if (recognitionRef.current) recognitionRef.current.stop()
            window.speechSynthesis?.cancel()
        }
    }, [])

    const toggleMicrophone = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            setMicError('Speech recognition is not supported in this browser. Use Chrome or Edge.')
            return
        }

        if (isListening && recognitionRef.current) {
            shouldListenRef.current = false
            recognitionRef.current.stop()
            return
        }

        setMicError('')
        window.speechSynthesis?.cancel()
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-IN'
        recognition.interimResults = true
        recognition.continuous = true
        const startingAnswer = answer.trim()
        let finalTranscript = ''

        recognition.onstart = () => setIsListening(true)
        recognition.onresult = (event) => {
            let interimTranscript = ''
            for (let index = event.resultIndex; index < event.results.length; index += 1) {
                const transcript = event.results[index][0].transcript
                if (event.results[index].isFinal) {
                    finalTranscript += `${transcript.trim()} `
                } else {
                    interimTranscript += transcript
                }
            }
            setAnswer(startingAnswer
                ? `${startingAnswer} ${finalTranscript}${interimTranscript}`.trim()
                : `${finalTranscript}${interimTranscript}`.trim())
        }
        recognition.onend = () => {
            if (shouldListenRef.current) {
                setIsListening(true)
                restartMicRef.current = window.setTimeout(() => {
                    try {
                        recognition.start()
                    } catch (error) {
                        setMicError('Microphone restart failed. Please turn it off and on again.')
                        shouldListenRef.current = false
                        setIsListening(false)
                    }
                }, 250)
            } else {
                setIsListening(false)
            }
        }
        recognition.onerror = (event) => {
            setMicError(event.error === 'not-allowed'
                ? 'Microphone permission was denied.'
                : 'Could not hear your answer. Please try again.')
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                shouldListenRef.current = false
                setIsListening(false)
            }
        }

        recognitionRef.current = recognition
        shouldListenRef.current = true
        recognition.start()
    }

    useEffect(() => {
        if (interviewPhase !== 'question') return
        setTimeLeft(totalTime)
        const countdown = window.setInterval(() => {
            setTimeLeft((value) => value > 0 ? value - 1 : 0)
        }, 1000)
        return () => window.clearInterval(countdown)
    }, [currentIndex, totalTime, interviewPhase])

    const handleSubmit = async () => {
        if (isSubmitting || !interviewId) return
        window.speechSynthesis?.cancel()
        shouldListenRef.current = false
        if (restartMicRef.current) window.clearTimeout(restartMicRef.current)
        if (recognitionRef.current) recognitionRef.current.stop()
        setIsListening(false)
        setIsSubmitting(true)
        setSubmitError('')
        const timeTaken = totalTime - timeLeft
        const submittedAnswer = answer.trim()
        const serverUrl = import.meta.env.VITE_API_URL

        try {
            await axios.post(`${serverUrl}/api/interview/submit-answers`, {
                interviewId,
                questionIndex: currentIndex,
                answer: submittedAnswer,
                timeTaken
            }, { withCredentials: true })

            const nextAnswers = [...answers, { question: questionText, answer: submittedAnswer }]
            setAnswers(nextAnswers)

            if (currentIndex < questions.length - 1) {
                setAnswer('')
                setCurrentIndex((index) => index + 1)
            } else {
                const result = await axios.post(`${serverUrl}/api/interview/finish`, {
                    interviewId
                }, { withCredentials: true })
                if (typeof onFinish === 'function') {
                    onFinish({ ...result.data, answers: nextAnswers })
                }
            }
        } catch (error) {
            console.error('Unable to evaluate answer:', error.response?.data || error.message)
            setSubmitError(error.response?.data?.message || 'Unable to submit this answer. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="s2-page">
            <section className="interview-shell">
                <aside className="interview-left">
                    <div className="ai-video-card">
                        <video
                            className="ai-video"
                            src={femaleVideo}
                            muted
                            playsInline
                            preload='auto'
                            ref={videoRef}
                        />
                    </div>

                    <div className="status-card">
                        <div className="status-header">
                            <span>Interview Status</span>
                            <strong>{isListening ? 'Listening' : isSpeaking ? 'AI Speaking' : 'Ready'}</strong>
                        </div>
                        <div className="timer-area">
                            <Timer timeLeft={timeLeft} totalTime={totalTime} />
                        </div>
                        <div className="question-counts">
                            <div><strong>{currentIndex + 1}</strong><span> Current Questions</span></div>
                            <div><strong>{Math.max(questions.length, 1)}</strong><span> Total Questions</span></div>
                        </div>
                    </div>
                </aside>

                <section className="interview-right">
                    <h2>AI Smart Interview</h2>
                    <div className="question-box">
                        <span>Question {currentIndex + 1} of {Math.max(questions.length, 1)}</span>
                        <p>{questionText}</p>
                    </div>

                    <textarea
                        className="answer-box"
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        placeholder="Type your answer here..."
                    />
                    {submitError && <p className="submit-error">{submitError}</p>}
                    {micError && <p className="submit-error">{micError}</p>}

                    <div className="answer-actions">
                        <button
                            className={`mic-button${isListening ? ' is-listening' : ''}`}
                            type="button"
                            aria-label={isListening ? 'Stop microphone' : 'Start microphone'}
                            onClick={toggleMicrophone}
                        >
                            <FaMicrophone />
                        </button>
                        <button className="submit-answer" type="button" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Evaluating...' : currentIndex === questions.length - 1 ? 'Finish Interview' : 'Submit Answer'}
                        </button>
                    </div>
                </section>
            </section>
        </main>
    )
}

export default Step2Interview