import { Tldraw, Editor, createShapeId, TLNoteShape, toRichText } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { createArrowBetweenShapes } from './whiteboardUtils'

const handleMount = (editor: Editor) => {
  /* On mount, draw two notes and an arrow between them */

  const note1ID = createShapeId('note1')
  const note2ID = createShapeId('note2')

  editor.createShapes<TLNoteShape>([
    {
      id: note1ID,
      type: 'note',
      /* Starting coordinates: Top left-ish */
      x: 128,
      y: 128,
      props: {
        color: 'yellow',
        size: 'm',
        richText: toRichText('This whiteboard was created by TLDraw'),
      },
    },
  ])

  editor.createShapes<TLNoteShape>([
    {
      id: note2ID,
      type: 'note',
      /* Starting coordinates: Down and to the right of the first note */
      x: 512,
      y: 512,
      props: {
        color: 'orange',
        size: 'm',
        richText: toRichText('These notes were created using code!'),
      },
    },
  ])

  /* Draw an arrow from the first note to the second note */
  createArrowBetweenShapes(editor, note1ID, note2ID)

  /* Zoom to fit the entire canvas */
  editor.zoomToFit()
}

export const WhiteBoard = () => {
  return (
    <div className="fixed inset-0">
      <Tldraw onMount={handleMount} />
    </div>
  )
}
