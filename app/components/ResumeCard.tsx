import React from 'react'
import { Link } from 'react-router'
import ScoreCircle from './ScoreCircle'

const ResumeCard = ({ resume: { id, companyName, jobTitle, imagePath, resumePath, feedback } }: { resume: Resume }) => {
    return (
        <Link to={`/resume/${id}`} className='resume-card animate-in fade-in duration-1000'>
            <div className='resume-card-header'>
                <div className='flex flex-col gap-2'>
                    <span className='font-bold text-2xl break-words'>{companyName}</span>
                    <span className='text-lg break-words text-gray-500'>{jobTitle}</span>
                </div>
                <div className='flex-shrink-0'>
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            <div className='gradient-border animate-in fade-in duration-1000'>
                <div className='h-full w-full'>
                    <img
                        src={imagePath}
                        alt="Resume"
                        className='w-full h-[350px] max-sm:h-[250px] object-cover object-top'
                    />
                </div>
            </div>
        </Link>
    )
}

export default ResumeCard
