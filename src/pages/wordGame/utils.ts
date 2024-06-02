export const COLS = 5 /* If you change this, you must also update the dictionaries */
export const ROWS = 5

export type GuessResult = 'CORRECT' | 'INCORRECT' | 'MISPLACED'

export type GameState = 'IN_PROGRESS' | 'WON' | 'LOST'

export type Square = {
  value: string | null
  result: GuessResult | null
}

export type Row = Square[]

export type Board = Row[]

export const getEmptyBoard = () =>
  new Array(ROWS).fill(new Array(COLS).fill({ value: null, result: null }))

export const isAlpha = (str: string) => /^[A-Z]+$/i.test(str)

export const isWon = (currentBoard: Board, turn: number) => {
  const activeRow = currentBoard[turn]
  return activeRow.every((square) => square.result === 'CORRECT')
}

export const isLost = (currentBoard: Board, turn: number) => {
  if (isWon(currentBoard, turn)) {
    return false
  }
  return turn === ROWS - 1
}

export const getSquareTitle = (isSquareActive: boolean, square: Square) => {
  const activeText = isSquareActive ? '- active' : ''
  const resultText = square.result ? `- ${square.result}` : ''
  const valueText = square.value ? square.value : 'Empty'
  return `${valueText} ${resultText} ${activeText}`
}

export const getSquareColorClass = (square: Square) => {
  if (!square.result) {
    // Square is ungraded.  Ungraded squares with letters have thicker borders than those without letters
    const borderStyle = square.value ? 'border-black' : 'border-slate-300'
    return 'bg-white border border-2 text-black text-bold ' + borderStyle
  }
  switch (square.result) {
    case 'CORRECT':
      return 'bg-green-500 text-white'
    case 'MISPLACED':
      return 'bg-yellow-500 text-white'
    case 'INCORRECT':
      return 'bg-gray-500 text-white'
  }
}

// Update the given square in the board and return the updated board
export const updateSquare = (
  currentBoard: Board,
  rowIndex: number,
  columnIndex: number,
  newValue?: string | null, //undefined: do not set. null: clear the square
  newResult?: GuessResult | null //undefined: do not set. null: clear the square
) => {
  if (!currentBoard[rowIndex]) {
    return currentBoard //Game is over
  }

  const newBoard = [...currentBoard]
  const newRow: Row = [...newBoard[rowIndex]]

  // Update the square in the copied row
  // If newValue or newResult are provided, use them; otherwise, keep the existing values
  newRow[columnIndex] = {
    value: newValue !== undefined ? newValue : newRow[columnIndex].value,
    result: newResult !== undefined ? newResult : newRow[columnIndex].result,
  }

  // Update and return the board
  newBoard[rowIndex] = newRow
  return newBoard
}

type DatamuseResult = {
  score: number
  tags: string[]
  word: string
}

/* Find words related to the answer to provide hints to the player. */
export const fetchHints = async (answer: string): Promise<string[]> => {
  console.info('Fetching Hint')

  /* 
    ml: "Means Like" - Find "words with a meaning similar" to the input.
    "Require that the results have a meaning related to this string value, which can be any word or sequence of words."
    https://www.datamuse.com/api/
 */
  try {
    const url = `https://api.datamuse.com/words?ml=${answer}`
    const result = await fetch(url)
    const data = await result.json()
    return data.map((item: DatamuseResult) => item.word.toUpperCase())
  } catch {
    return ['Hints not available']
  }
}

export const hasTooManySharedLetters = (word1: string, word2: string) => {
  // Create sets of unique letters for each word (with spaces removed)
  const set1 = new Set(word1.replace(/ /g, ''))
  const set2 = new Set(word2.replace(/ /g, ''))

  // Find the intersection of the two sets
  const intersection = new Set([...set1].filter((letter) => set2.has(letter)))

  // Check if the size of the intersection is 4 or more
  return intersection.size >= 3
}
