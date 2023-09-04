import { getRandomWord } from '../../dictionary/wordLib'
import { useState } from 'react'
import { Board, GameState, getEmptyBoard } from './utils'

export const useGameState = () => {
  /* Set this to a word to debug the game with a known answer, eg 'CLOSE' */
  const DEBUG_MANUAL_ANSWER: null | string = null

  const [turn, setTurn] = useState<number>(0)
  const [activeSquare, setActiveSquare] = useState<number>(0)
  const [board, setBoard] = useState<Board>(getEmptyBoard())
  const [answer, setAnswer] = useState<string>(() => DEBUG_MANUAL_ANSWER || getRandomWord())
  const [gameState, setGameState] = useState<GameState>('IN_PROGRESS')

  const startNewGame = () => {
    setTurn(0)
    setActiveSquare(0)
    setBoard(getEmptyBoard())
    setAnswer(DEBUG_MANUAL_ANSWER || getRandomWord())
    setGameState('IN_PROGRESS')
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
  }
}
