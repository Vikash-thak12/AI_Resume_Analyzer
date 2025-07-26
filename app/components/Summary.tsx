import ScoreBadge from './ScoreBadge';
import ScoreGauge from './ScoreGauge'
interface CategoryProps{
    title: String, 
    score: number
}


const Category = ({ title, score}: CategoryProps) => {

    const textColor = score > 79 ? 'text-green-600' : score > 49 ? 'text-yellow-600' : 'text-red-600'; 
    return (
        <div className='resume-summary'>
            <div className='category'>
                <div className='flex flex-row items-center justify-center gap-4'>
                    <p className='text-2xl font-semibold'>{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className='text-2xl'>
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback}: { feedback: Feedback}) => {
  return (
    <div className='bg-white shadow-md rounded-2xl'>
        <div className='flex flex-row gap-8 p-4 w-full'>
            <ScoreGauge score={feedback.overallScore} />
            <div className='flex flex-col gap-4'>
                <h2 className='text-2xl font-bold'>Your Resume Score</h2>
                <p className='text-sm text-gray-500'>This score is calculated based on the variables below.</p>
            </div>
        </div>

        <Category title={"Tone and Style"} score={feedback.toneAndStyle.score} />
        <Category title={"Content"} score={feedback.content.score} />
        <Category title={"Strucutre"} score={feedback.structure.score} />
        <Category title={"Skills"} score={feedback.skills.score} />
    </div>
  )
}

export default Summary
