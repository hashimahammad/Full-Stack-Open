import { useState } from 'react'

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Button = ({handleClick,text}) => <button onClick={handleClick}>{text}</button>




const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [voteList,setVote] = useState(new Array(anecdotes.length).fill(0))
  const [fav,setFav] = useState(0)
  const  handleNextAnecdote = () => {
    let n = getRandomIntInclusive(0,anecdotes.length-1)
    setSelected(n)
  }

  const handleVote = () =>{
    const copy = [...voteList]
    copy[selected]+= 1
    setVote(copy)
    let maxVotes = Math.max(...copy);
    let iMax = copy.indexOf(maxVotes);
    setFav(iMax);
    
  }

  return (
    <div>
      <div>
        <h1>Anecdote of the day</h1>
      </div>
      {anecdotes[selected]}
      <p><br />has {voteList[selected]} votes</p>
      <div>
        <Button handleClick={handleNextAnecdote} text='Next Anecdote'></Button>
        <Button handleClick={handleVote} text='Vote'></Button>
      </div>
      <div>
        <h1>Anecdote with most votes</h1>
      </div>
      {anecdotes[fav]}
    </div>
  )
}

export default App

