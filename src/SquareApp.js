import { useCallback, useEffect, useMemo, useState } from "react";
import SquareList from "./components/SquareList";
import Modal from "./components/Modal";
import { makeId } from "./services/utilService";

export default function SquareApp() {
  const [squares, setSquares] = useState([])
  const [undoActions, setUndoActions] = useState([])
  const [redoActions, setRedoActions] = useState([])

  const [currModalOpts, setCurrModalOpts] = useState(null)
  // Modal:
  const onOpenModal = (formType, square = null) => {
    setCurrModalOpts({ formType, square })
  }

  const onCloseModal = () => {
    setCurrModalOpts(null)
  }
  // Undo / Redo:
  const squareStrategy = (action) => {
    const squaresCopy = [...squares]
    switch (action.type) {
      case 'add':
        const { squareId } = action
        var idx = squaresCopy.findIndex(s => s.id === squareId)
        if (idx === -1) throw Error(`No sqaure was found with id ${squareId}`)
        // _addRedoAction({ type: 'remove', square: gSquares[idx], squareIdx: idx })
        squaresCopy.splice(idx, 1)
        break;
      case 'remove':
        const { square, squareIdx } = action
        squaresCopy.splice(squareIdx, 0, square)
        break;
      case 'move':
        const { id, x, y } = action
        var idx = squares.findIndex(s => s.id === id)
        if (idx === -1) throw Error(`Square with id ${id} wasn't found!`)

        const isPxIncluded = new RegExp('px', 'i')
        const newX = isPxIncluded.test(x) ? +x.split('px')[0] : +x
        const newY = isPxIncluded.test(y) ? +y.split('px')[0] : +y
        const oldSquare = squaresCopy[idx]
        // Move:
        const updatedSquare = { ...oldSquare, x: newX, y: newY }
        squaresCopy.splice(idx, 1, updatedSquare)
        break;

      default:
        break;
    }

    setSquares(squaresCopy)
  }

  const getOppositeAction = (action) => {
    try {
      const squaresCopy = [...squares]
      const matchingAction = {}
      switch (action.type) {
        case 'add':
          var { squareId } = action
          var idx = squaresCopy.findIndex(s => s.id === squareId)
          if (idx === -1) throw Error(`No sqaure was found with id ${squareId}`)

          matchingAction.type = 'remove'
          matchingAction.square = squaresCopy[idx]
          matchingAction.squareIdx = idx
          break;
        case 'remove':
          var { square } = action
          matchingAction.type = 'add'
          matchingAction.squareId = square.id
          break;
        case 'move':
          var { id } = action
          var square = squaresCopy.find(s => s.id === id)
          if (!square) throw Error(`No square was found with id ${id}`)
          matchingAction.type = 'move'
          matchingAction.x = square.x
          matchingAction.y = square.y
          matchingAction.id = id
          break;
        default:
          break;
      }

      return matchingAction
    } catch (err) {
      console.log(err);
    }
  }

  const onRedo = () => {
    try {
      const action = redoActions.pop()
      if (!action) throw Error('Cannot redo - no redo actions exist')

      const undoAction = getOppositeAction(action)
      addUndoAction(undoAction)

      squareStrategy(action)
    } catch (err) {
      console.log(err);
    }
  }

  const addRedoAction = (redoAction) => {
    try {
      const redoActionsCopy = [...redoActions]
      redoActionsCopy.push(redoAction)
      setRedoActions(redoActionsCopy)
    } catch (err) {
      console.log(err);
    }

  }

  const onUndo = () => {
    try {
      const action = undoActions.pop()
      if (!action) throw Error('Cannot undo - no actions taken')

      const redoAction = getOppositeAction(action)
      addRedoAction(redoAction)

      squareStrategy(action)
    } catch (err) {
      console.log(err);
    }
  }

  const addUndoAction = (action) => {
    setUndoActions(undoActions => {
      const lastAction = undoActions[undoActions.length - 1]
      // Plaster
      if (undoActions.length && lastAction.type === action.type && lastAction.x === action.x && lastAction.y === action.y && lastAction.id === action.id) return undoActions
      undoActions.push(action)
      return undoActions
    })
  }
  // Square:
  const onAdd = (squareToAdd) => {
    const id = makeId()
    // Undo:
    addUndoAction({ type: 'add', squareId: id })
    // Add:
    setSquares([...squares, { ...squareToAdd, id }])
    onCloseModal()
  }

  const onMove = ({ id, x, y }, isAddUndo = false) => {
    try {
      console.log('onMove');
      const idx = squares.findIndex(s => s.id === id)
      if (idx === -1) throw Error(`Square with id ${id} wasn't found!`)

      const isPxIncluded = new RegExp('px', 'i')
      const newX = isPxIncluded.test(x) ? x : x + 'px'
      const newY = isPxIncluded.test(y) ? y : y + 'px'

      setSquares(squares => {
        const oldSquare = squares[idx]
        const updatedSquare = { ...oldSquare, x: newX, y: newY }
        // Undo:
        if (isAddUndo) addUndoAction({ type: 'move', id, x: oldSquare.x, y: oldSquare.y })
        // Move:
        const squaresCopy = JSON.parse(JSON.stringify(squares))
        squaresCopy.splice(idx, 1, updatedSquare)
        return squaresCopy
      })
      onCloseModal()
    } catch (err) {
      console.log(err);
    }
  }

  const onRemove = (squareId) => {
    try {
      const idx = squares.findIndex(s => s.id === squareId)
      if (idx === -1) throw Error(`Square with id ${squareId} wasn't found!`)
      // Undo:
      addUndoAction({ type: 'remove', square: squares[idx], squareIdx: idx })
      // Splice:
      const squaresCopy = [...squares]
      squaresCopy.splice(idx, 1)
      console.log('squaresCopy', squaresCopy);
      setSquares(squaresCopy)
    } catch (err) {
      console.log(err);
    }
  }

  const onMouseUp = () => {
    console.log('onMouseUp()');
  }

  const dndCbs = useMemo(() => ({
    mousedown: onMove,
    mousemove: onMove,
    mouseup: onMouseUp
  }), [squares])

  return (
    <div className="square-app">
      <h1>Squares</h1>
      <header className="header">
        <button className="btn" onClick={() => onOpenModal('AddForm')}>Add</button>
        <button className="btn" onClick={onUndo} disabled={!undoActions.length}>Undo</button>
        <button className="btn" onClick={onRedo} disabled={!redoActions.length}>Redo</button>
      </header>
      <main className="squares-container">
        <SquareList squares={squares} onOpenModal={onOpenModal} onRemove={onRemove} dndCbs={dndCbs} />
        {currModalOpts && <Modal currModalOpts={currModalOpts} onCloseModal={onCloseModal} onAdd={onAdd} onMove={onMove} />}
      </main>
    </div>
  );
}

