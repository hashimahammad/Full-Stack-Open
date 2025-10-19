import { useState } from 'react'

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>


const Statistics = ({good,neutral,bad})=>{
  let all = good+bad+neutral || 0
  console.log(all)
  let avg = (good - bad)/all || 0
  let goodPerc = (good/all)*100 || 0

  if (all === 0) {
    return (<p>No feedback given</p>)
  } 

  return (
    <div>
      <StatisticLine text="good" value ={good} />
      <StatisticLine text="neutral" value ={neutral} />
      <StatisticLine text="bad" value ={bad} />
      <StatisticLine text="all" value ={all} />
      <StatisticLine text="average" value ={avg} />
      <StatisticLine text="Positive" value ={goodPerc} />
    </div>
  )
}

const StatisticLine = ({text,value}) =>{
  return (
  <tr>
  <td>{text}</td>
  <td>{value}</td>
  </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button onClick = {handleGoodClick} text = 'good' ></Button>
        <Button onClick = {handleNeutralClick} text = 'neutral' ></Button>
        <Button onClick = {handleBadClick} text = 'bad' ></Button>
      </div>
      <Statistics good={good} bad={bad} neutral={neutral}></Statistics>
    </div>
  )
}

export default App