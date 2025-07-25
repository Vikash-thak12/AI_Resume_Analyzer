import { useParams } from 'react-router'

const resume = () => {
    const { id } = useParams(); 
  return (
    <div>
      <span>Resume: {id}</span>
    </div>
  )
}

export default resume
