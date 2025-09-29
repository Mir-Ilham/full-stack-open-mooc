import { useState } from 'react'

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const StatisticLine = ({text, count}) => {
  if (text == 'positive') {
    return (
      <tr>
        <td>{text}</td>
        <td>{count} %</td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{text}</td>
      <td>{count}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  if (good + neutral + bad == 0) {
    return (
      <p>No feedback given</p>
    )
  }

  return (
    <table>
      <tbody>
      <StatisticLine text='good' count={good} />
      <StatisticLine text='neutral' count={neutral} />
      <StatisticLine text='bad' count={bad} />
      <StatisticLine text='all' count={good + bad + neutral} />
      <StatisticLine text='average' count={(good - bad) / (good + bad + neutral)} />
      <StatisticLine text='positive' count={good / (good + bad + neutral)} />
      </tbody>
    </table>
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