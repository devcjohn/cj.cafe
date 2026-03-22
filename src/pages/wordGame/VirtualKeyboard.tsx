import { KeyboardReact } from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import './virtualKeyboardStyle.css'
import { Board, GuessResult, Square } from './utils'

interface VirtualKeyboardProps {
  onKeyPress: (button: KeyboardEvent | string) => void
  board: Board
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress, board }) => {
  const getLetterStates = (): { [key: string]: GuessResult | null } => {
    const letterStates: { [key: string]: GuessResult | null } = {}
    /* On the virtual keyboard, each letter has a color representing its state.
     letterStates = {
       'A': 'CORRECT',
       'B': 'INCORRECT',
       'C': 'MISPLACED',
       'D': null,
        etc...
     }
     */

    /* Loop through the game board and extract the letter states (colors) so that they can be applied to the virtual keyboard. */
    board.forEach((row: Square[]) => {
      row.forEach((square: Square) => {
        if (square.value) {
          // If the letter already exists, prioritize the state
          if (letterStates[square.value]) {
            if (letterStates[square.value] === 'MISPLACED' && square.result === 'CORRECT') {
              letterStates[square.value] = square.result
            } else if (
              letterStates[square.value] === 'INCORRECT' &&
              (square.result === 'CORRECT' || square.result === 'MISPLACED')
            ) {
              letterStates[square.value] = square.result
            }
          } else {
            letterStates[square.value] = square.result
          }
        }
      })
    })

    return letterStates
  }

  // Extract letter states
  const letterStates = getLetterStates()

  // Generate buttonTheme based on letter states
  const generateButtonThemes = (): {
    class: string
    buttons: string
  }[] => {
    const themes = []
    for (const letter in letterStates) {
      let className = 'white'
      switch (letterStates[letter]) {
        case 'CORRECT':
          className = 'green'
          break
        case 'MISPLACED':
          className = 'yellow'
          break
        case 'INCORRECT':
          className = 'gray'
          break
        default:
          break
      }
      themes.push({
        class: className,
        buttons: letter,
      })
    }
    return themes
  }

  return (
    <KeyboardReact
      onKeyPress={onKeyPress}
      theme="hg-theme-default hg-layout-default"
      layout={{
        default: ['Q W E R T Y U I O P', 'A S D F G H J K L', 'Z X C V B N M {bksp}'],
      }}
      buttonTheme={generateButtonThemes()}
      display={{
        '{bksp}': '⌫' /* By default {bksp} is a button that says 'backspace'.  This is better */,
      }}
    />
  )
}
