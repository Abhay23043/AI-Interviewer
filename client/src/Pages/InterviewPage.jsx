import React from 'react'
import { useState } from 'react'
import Step1Setup from '../components/Step1Setup'
import Step2Interview from '../components/Step2Interview'
import Step3Report from '../components/Step3Report'

const InterviewPage = () => {
    const [step, setStep] = useState(1)
const [interviewData, setInterviewData] = useState(null)

  return (
    <div>
        {step===1 && (
            <Step1Setup onStart={(data)=>{
                console.log("Interview Object:", data);
                setInterviewData(data);
                setStep(2);
            }}/>
        )}

        {step===2 && (
            <Step2Interview interviewData={interviewData}
            onFinish={(report)=>{setInterviewData(report);
                setStep(3);
            }}
            />
        )}

        {step===3 && (
            <Step3Report Report={interviewData}/>   
        )}

    </div>
  )
}

export default InterviewPage