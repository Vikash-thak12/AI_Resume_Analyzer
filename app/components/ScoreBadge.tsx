import React from 'react'

const ScoreBadge = ({ score}: {score: number}) => {
    // const textColor = score > 79 ? 'text-green-600' : score > 49 ? 'text-yellow-600' : 'text-red-600'; 
    // const textNumber = score > 79 ? 'Strong' : score > 49 ? 'Good' : 'Bad'; 

    let badgeColor = ''; 
    let badgeText = ''; 

    if(score > 70){
        badgeColor = 'bg-badge-green text-green-600'
        badgeText = "Strong"
    } else if(score > 49){
        badgeColor = 'bg-badge-yellow text-yellow-600'
        badgeText = "Good Start"
    } else {
        badgeColor = 'bg-badge-red text-red-600'
        badgeText = "Needs work"
    }

  return (
    <div className={`px-3 py-1 rounded-full ${badgeColor}`}>
      <p className='text-sm font-bold'>{badgeText}</p>
    </div>
  )
}

export default ScoreBadge
