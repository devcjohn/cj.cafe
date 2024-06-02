import { render, cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WordGame } from '../src/pages/wordGame/WordGame'
import { describe, expect, afterEach, it, vi } from 'vitest'
import * as wordLib from '../src/dictionary/wordLib'
import { COLS, ROWS } from '../src/pages/wordGame/utils'
import * as utils from '../src/pages/wordGame/utils'

/* Uncomment to minimize verbose output on test failure */
// import { configure } from '@testing-library/dom'
// configure({
//   getElementError: (message, container) => {
//     const error = new Error(message)
//     error.name = 'TestingLibraryElementError'
//     error.stack = null
//     return error
//   },
// })

const spyGenerateWord = vi.spyOn(wordLib, 'getRandomAnswer')
const spyCheckIsWordReal = vi.spyOn(wordLib, 'checkIsWordReal')

/* We don't want to call the actual API in tests, so we mock it out */
const spyFetchHint = vi.spyOn(utils, 'fetchHints')
spyFetchHint.mockImplementation(() => Promise.resolve(['mocked hint 1', 'mocked hint 2']))

const TOTAL_SQUARES = COLS * ROWS

// setup function.  Allows us to use user.keyboard to simlate keystrokes
function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(jsx),
  }
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('Hintle', () => {
  it('renders the empty board', () => {
    render(<WordGame />)

    // All squares are empty
    const emptySquares = screen.getAllByLabelText(/empty/i)
    expect(emptySquares.length).toBe(TOTAL_SQUARES)
  })

  it('allows user to enter a letter', async () => {
    const { user } = setup(<WordGame />)

    // User enters 'A'
    await user.keyboard('a')

    // 1 Square is filled
    const emptySquares = screen.getAllByLabelText(/empty/i)
    expect(emptySquares.length).toBe(TOTAL_SQUARES - 1)

    // Now the first square is 'A'
    const filledSquare = await screen.findByTestId('square-0-0')
    expect(filledSquare.textContent).toBe('A')
  })

  it('ignores input that is nonalphabetic (other than delete)', async () => {
    const { user } = setup(<WordGame />)

    // None of these inputs do anything

    await user.keyboard('{control}')
    expect((await screen.findByTestId('square-0-0')).textContent).toBe('')

    await user.keyboard('{insert}')
    expect((await screen.findByTestId('square-0-0')).textContent).toBe('')

    await user.keyboard('{Alt}')
    expect((await screen.findByTestId('square-0-0')).textContent).toBe('')

    await user.keyboard('{Tab}')
    expect((await screen.findByTestId('square-0-0')).textContent).toBe('')

    await user.keyboard('{Meta}')
    expect((await screen.findByTestId('square-0-0')).textContent).toBe('')

    await user.keyboard('{Enter}')
    expect((await screen.findByTestId('square-0-0')).textContent).toBe('')

    await user.keyboard('0')
    expect((await screen.findByTestId('square-0-0')).textContent).toBe('')
  })

  it('allows user to enter 4 letters', async () => {
    const { user } = setup(<WordGame />)

    // User enters 'abcd'
    await user.keyboard('a')
    await user.keyboard('b')
    await user.keyboard('c')
    await user.keyboard('d')

    // 4 Squares are filled
    const emptySquares = screen.getAllByLabelText(/empty/i)
    expect(emptySquares.length).toBe(TOTAL_SQUARES - 4)

    // Squares are filled with the user's input
    const filledSquare = await screen.findByTestId('square-0-0')
    expect(filledSquare.textContent).toBe('A')

    const filledSquare2 = await screen.findByTestId('square-0-1')
    expect(filledSquare2.textContent).toBe('B')

    const filledSquare3 = await screen.findByTestId('square-0-2')
    expect(filledSquare3.textContent).toBe('C')

    const filledSquare4 = await screen.findByTestId('square-0-3')
    expect(filledSquare4.textContent).toBe('D')
  })

  it('allows user to delete a character at the beginning of the row', async () => {
    const { user } = setup(<WordGame />)

    // User enters 'A'
    await user.keyboard('a')

    // 1 Square is empty
    const emptySquares = screen.getAllByLabelText(/empty/i)
    expect(emptySquares.length).toBe(TOTAL_SQUARES - 1)

    // Now the first square is 'A'
    const filledSquare = await screen.findByTestId('square-0-0')
    expect(filledSquare.textContent).toBe('A')

    // User hit delete
    await user.keyboard('{backspace}')

    // Now all squares are empty again
    expect(screen.getAllByLabelText(/empty/i).length).toBe(TOTAL_SQUARES)
    // The first square is empty again
    expect((await screen.findByTestId('square-0-0')).textContent).toBe('')
  })

  it('allows user to delete characters in the middle of the row', async () => {
    const { user } = setup(<WordGame />)

    // User enters 'abcd'
    await user.keyboard('a')
    await user.keyboard('b')
    await user.keyboard('c')
    await user.keyboard('d')

    expect((await screen.findByTestId('square-0-3')).textContent).toBe('D')

    // User hits backspace 4 times
    await user.keyboard('{backspace}')
    expect((await screen.findByTestId('square-0-3')).textContent).toBe('')

    await user.keyboard('{backspace}')
    expect((await screen.findByTestId('square-0-2')).textContent).toBe('')

    await user.keyboard('{backspace}')
    expect((await screen.findByTestId('square-0-1')).textContent).toBe('')

    await user.keyboard('{backspace}')
    expect((await screen.findByTestId('square-0-0')).textContent).toBe('')
  })

  it('allows user to delete characters at the end of a row ', async () => {
    const { user } = setup(<WordGame />)

    // User enters 'abcde', an invalid word
    await user.keyboard('a')
    await user.keyboard('b')
    await user.keyboard('c')
    await user.keyboard('d')
    await user.keyboard('e')

    // The last square is active (If a square is active, new user input will go there)
    expect((await screen.findByTestId('square-0-4')).title.includes('active')).toBe(true)
    expect((await screen.findByTestId('square-0-4')).textContent).toBe('E')

    await user.keyboard('{backspace}')

    // Now the last square is empty but still active
    expect((await screen.findByTestId('square-0-4')).title.includes('active')).toBe(true)
    expect((await screen.findByTestId('square-0-4')).textContent).toBe('')

    await user.keyboard('{backspace}')

    // Now the 4th square is empty and active
    expect((await screen.findByTestId('square-0-3')).title.includes('active')).toBe(true)
    expect((await screen.findByTestId('square-0-3')).textContent).toBe('')

    // Simulate user deleting remaining squares
    await user.keyboard('{backspace}')
    expect((await screen.findByTestId('square-0-2')).textContent).toBe('')

    await user.keyboard('{backspace}')
    expect((await screen.findByTestId('square-0-1')).textContent).toBe('')

    await user.keyboard('{backspace}')
    expect((await screen.findByTestId('square-0-0')).textContent).toBe('')

    // Now the first square is empty and highlighted
    expect((await screen.findByTestId('square-0-0')).title.includes('active')).toBe(true)
  })

  it('starts a new game when new game button is clicked', async () => {
    const { user } = setup(<WordGame />)

    // User enters 'abcd'
    await user.keyboard('a')
    await user.keyboard('b')
    await user.keyboard('c')
    await user.keyboard('d')

    const newGameButton = screen.getByText(/new game/i)
    await userEvent.click(newGameButton)

    // All squares are empty again
    const emptySquares = screen.getAllByLabelText(/empty/i)
    expect(emptySquares.length).toBe(TOTAL_SQUARES)
  })

  it('shows loss message when game is lost', async () => {
    // Mock out the correct answer to be 'RIGHT'
    spyGenerateWord.mockImplementation(() => 'RIGHT')

    const { user } = setup(<WordGame />)

    // User fills up each row with 'wrong' (a real word, but not the answer)
    for (let i = 0; i < 6; i++) {
      await user.keyboard('w')
      await user.keyboard('r')
      await user.keyboard('o')
      await user.keyboard('n')
      await user.keyboard('g')
    }

    // User has run out of guesses
    expect(await screen.findByText(/The answer was RIGHT/i)).toBeTruthy()
  })

  it('shows win message when game is won', async () => {
    // Mock out the correct answer to be 'RIGHT'
    spyGenerateWord.mockImplementation(() => 'RIGHT')

    const { user } = setup(<WordGame />)

    await user.keyboard('RIGHT')

    expect(screen.getByText(/You Won!/i)).toBeTruthy()
  })

  it('allows no more keyboard input when game is won', async () => {
    // Mock out the correct answer to be 'RIGHT'
    spyGenerateWord.mockImplementation(() => 'RIGHT')

    const { user } = setup(<WordGame />)

    await user.keyboard('RIGHT')

    await user.keyboard('Z')

    // Last square should not be overwritten with 'Z'
    expect((await screen.findByTestId('square-0-4')).textContent).toBe('T')
  })

  it('allows no more keyboard input when game is lost', async () => {
    spyGenerateWord.mockImplementation(() => 'RIGHT')

    const { user } = setup(<WordGame />)

    // User fills up each row with 'wrong' (a real word, but not the answer)
    for (let i = 0; i < 6; i++) {
      await user.keyboard('w')
      await user.keyboard('r')
      await user.keyboard('o')
      await user.keyboard('n')
      await user.keyboard('g')
    }

    await user.keyboard('z')

    // Last square should not be overwritten with 'Z'
    expect((await screen.findByTestId('square-0-4')).textContent).toBe('G')
  })

  describe('Grading', () => {
    it('Should not grade ANY row if entered word is not "real" (in dictionary)', async () => {
      spyGenerateWord.mockImplementation(() => 'RIGHT')

      const { user } = setup(<WordGame />)

      for (let i = 0; i < ROWS; i++) {
        /* Fill row with fake word.  Word should not be graded */
        spyCheckIsWordReal.mockImplementation(() => false)
        await user.keyboard('ABCDE')
        expect((await screen.findByTestId(`square-${i}-0`)).classList.contains('bg-white')).toBe(
          true
        )
        expect((await screen.findByTestId(`square-${i}-1`)).classList.contains('bg-white')).toBe(
          true
        )
        expect((await screen.findByTestId(`square-${i}-2`)).classList.contains('bg-white')).toBe(
          true
        )
        expect((await screen.findByTestId(`square-${i}-3`)).classList.contains('bg-white')).toBe(
          true
        )
        expect((await screen.findByTestId(`square-${i}-4`)).classList.contains('bg-white')).toBe(
          true
        )

        /* Clear the row */
        await user.keyboard('{backspace}{backspace}{backspace}{backspace}{backspace}')

        /* Fill row with real word.  Word should be graded */
        spyCheckIsWordReal.mockImplementation(() => true)
        await user.keyboard('ABCDE')
        expect((await screen.findByTestId(`square-${i}-0`)).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId(`square-${i}-1`)).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId(`square-${i}-2`)).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId(`square-${i}-3`)).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId(`square-${i}-4`)).classList.contains('bg-gray-500')).toBe(
          true
        )
      }
    })

    it('Colors squares based on correctness', async () => {
      // Mock out the correct answer to be 'RIGHT'
      spyGenerateWord.mockImplementation(() => 'RIGHT')
      spyCheckIsWordReal.mockImplementation(() => true)

      const { user } = setup(<WordGame />)

      await user.keyboard('rings')

      // The first and third squares are green because they matche the answer.
      // The 4th square is yellow because it is in the answer but in the wrong place.
      // The other squares are gray because they are not in the answer.
      expect((await screen.findByTestId('square-0-0')).classList.contains('bg-green-500')).toBe(
        true
      )
      expect((await screen.findByTestId('square-0-1')).classList.contains('bg-green-500')).toBe(
        true
      )
      expect((await screen.findByTestId('square-0-2')).classList.contains('bg-gray-500')).toBe(true)
      expect((await screen.findByTestId('square-0-3')).classList.contains('bg-yellow-500')).toBe(
        true
      )
      expect((await screen.findByTestId('square-0-4')).classList.contains('bg-gray-500')).toBe(true)
    })

    describe('Double letters', () => {
      it('marks the first letter yellow and 2nd gray when both duplicate letters are in the wrong position.', async () => {
        // Mock out the correct answer to be 'RIGHT'
        spyGenerateWord.mockImplementation(() => 'CLOSE')

        const { user } = setup(<WordGame />)

        await user.keyboard('cheer')

        // The first and third squares are green because they matche the answer.
        // The 4th square is yellow because it is in the answer but in the wrong place.
        // The other squares are gray because they are not in the answer.
        expect((await screen.findByTestId('square-0-0')).classList.contains('bg-green-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-1')).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-2')).classList.contains('bg-yellow-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-3')).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-4')).classList.contains('bg-gray-500')).toBe(
          true
        )
      })

      it('marks the first letter green and 2nd gray when first dup is in correct position and 2nd is not', async () => {
        // Mock out the correct answer to be 'RIGHT'
        spyGenerateWord.mockImplementation(() => 'CLOSE')

        const { user } = setup(<WordGame />)

        await user.keyboard('crack')

        // The first and third squares are green because they matche the answer.
        // The 4th square is yellow because it is in the answer but in the wrong place.
        // The other squares are gray because they are not in the answer.
        expect((await screen.findByTestId('square-0-0')).classList.contains('bg-green-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-1')).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-2')).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-3')).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-4')).classList.contains('bg-gray-500')).toBe(
          true
        )
      })

      it('marks the first letter gray and 2nd green when first dup is in wrong position and 2nd is in correct position', async () => {
        // Mock out the correct answer to be 'RIGHT'
        spyGenerateWord.mockImplementation(() => 'CLOSE')

        const { user } = setup(<WordGame />)

        await user.keyboard('leave')

        // The first and third squares are green because they matche the answer.
        // The 4th square is yellow because it is in the answer but in the wrong place.
        // The other squares are gray because they are not in the answer.
        expect((await screen.findByTestId('square-0-0')).classList.contains('bg-yellow-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-1')).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-2')).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-3')).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-4')).classList.contains('bg-green-500')).toBe(
          true
        )
      })
    })

    describe('triple letters', () => {
      it('correctly grades a guess when the naswer has 3 of the same letter', async () => {
        spyGenerateWord.mockImplementation(() => 'EMCEE')

        const { user } = setup(<WordGame />)

        await user.keyboard('EERIE')

        // The first and third squares are green because they matche the answer.
        // The 4th square is yellow because it is in the answer but in the wrong place.
        // The other squares are gray because they are not in the answer.
        expect((await screen.findByTestId('square-0-0')).classList.contains('bg-green-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-1')).classList.contains('bg-yellow-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-2')).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-3')).classList.contains('bg-gray-500')).toBe(
          true
        )
        expect((await screen.findByTestId('square-0-4')).classList.contains('bg-green-500')).toBe(
          true
        )
      })
    })
  })
})
