import React from "react"
import "./styles.css"
import { nanoid } from "nanoid"
import Die from "./die"
import Confetti from "react-confetti"

export default function App() {
  const [dice, setDice] = React.useState(allNewDie())
  const [tenzies, setTenzies] = React.useState(false)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [dice])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function rollDice() {
    if (!tenzies) {
      setCount(prevCount => prevCount + 1)
      setDice(prevDice => {
        return prevDice.map((die) => {
          return die.isHeld ? die : generateNewDie()
        })
      })
    } else {
      setTenzies(false)
      setCount(0)
      setDice(allNewDie())
    }
  }

  function holdDice(id) {
    setDice(prevDice => {
      return prevDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die
      })
    })
  }

  function allNewDie() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  const diceElements = dice.map(die =>
    <Die value={die.value}
      key={die.id}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />)

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same.
        Click each die to freeze it at its current value between rolls.</p>
      <div
        className="dice-container">
        {diceElements}
      </div>
      <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      {tenzies && <h2>Dice was rolled {count} times</h2>}
    </main>
  )
}
