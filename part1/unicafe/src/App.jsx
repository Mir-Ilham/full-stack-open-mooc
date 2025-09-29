import { useState } from 'react'

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const Stat = ({text, count}) => {
  if (text == 'positive') {
    return (
      <p>{text} {count} %</p>
    )
  }

  return (
    <p>{text} {count}</p>
  )
}

const Statistics = ({good, neutral, bad}) => {
  return (
    <>
      <Stat text='good' count={good} />
      <Stat text='neutral' count={neutral} />
      <Stat text='bad' count={bad} />
      <Stat text='all' count={good + bad + neutral} />
      <Stat text='average' count={(good - bad) / (good + bad + neutral)} />
      <Stat text='positive' count={good / (good + bad + neutral)} />
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>

      <Button text='good' onClick={() => setGood(good + 1)} />
      <Button text='neutral' onClick={() => setNeutral(neutral + 1)} />
      <Button text='bad' onClick={() => setBad(bad + 1)} />

      <h1>statistics</h1>

      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App