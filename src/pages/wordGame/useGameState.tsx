import { getRandomAnswer } from '../../dictionary/wordLib'
import { useEffect, useState } from 'react'
import { Board, GameState, fetchHints, getEmptyBoard, hasTooManySharedLetters } from './utils'

export const useGameState = () => {
  /* Set this to a word to debug the game with a known answer, eg 'DUMMY' */
  const DEBUG_MANUAL_ANSWER: null | string = null

  const [turn, setTurn] = useState<number>(0) /* The row the game is on */
  const [activeSquare, setActiveSquare] = useState<number>(0) /* The column the game is on */
  const [board, setBoard] = useState<Board>(getEmptyBoard())
  const [answer, setAnswer] = useState<string>(() => DEBUG_MANUAL_ANSWER || getRandomAnswer())
  const [gameState, setGameState] = useState<GameState>('IN_PROGRESS')
  const [allHints, setAllHints] = useState<string[]>([])
  const [displayedHints, setDisplayedHints] = useState<string[]>([])

  useEffect(() => {
    /* Fetch hints when answer changes */
    if (gameState !== 'IN_PROGRESS' || allHints.length) {
      return
    }
    const doFetchHint = async () => {
      const newHints = await fetchHints(answer)
      /* filter out hints that are too similar to the answer */
      const filteredHints = newHints.filter(
        (hint) =>
          !hint.includes(answer) && !answer.includes(hint) && !hasTooManySharedLetters(answer, hint)
      )
      setAllHints(filteredHints)
    }
    doFetchHint()
  }, [allHints.length, answer, gameState])

  useEffect(() => {
    /* Update displayed hints every round */
    if (gameState !== 'IN_PROGRESS') {
      return
    }

    const newHint = allHints[turn]
    setDisplayedHints((oldHints) => {
      return oldHints.includes(newHint) ? oldHints : [...oldHints, newHint]
    })
  }, [allHints, answer, gameState, turn])

  const startNewGame = () => {
    setTurn(0)
    setActiveSquare(0)
    setBoard(getEmptyBoard())
    setAnswer(DEBUG_MANUAL_ANSWER || getRandomAnswer())
    setGameState('IN_PROGRESS')
    setAllHints([])
    setDisplayedHints([])
  }

  return {
    turn,
    setTurn,
    activeSquare,
    setActiveSquare,
    board,
    setBoard,
    answer,
    gameState,
    setGameState,
    startNewGame,
    displayedHints,
  }
}
