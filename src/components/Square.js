import { useRef, useState } from "react"
import { useDragAndDrop } from "../hooks/useDragAndDrop"
import ActionsPopup from "./ActionsPopup"

export default function Square({ square, onOpenModal, onRemove, dndCbs }) {

    const squareRef = useRef(null)
    squareRef.squareId = square.id
    useDragAndDrop(squareRef, dndCbs)

    const [isPopupOpen, setIsPopupOpen] = useState(false)

    const onToggleActionsPopup = () => {
        setIsPopupOpen(!isPopupOpen)
    }

    const onRightClick = (ev) => {
        ev.preventDefault()
        onToggleActionsPopup()
    }


    return (
        <div ref={squareRef} onContextMenu={onRightClick} className="square" style={{
            top: square.y,
            left: square.x,
            backgroundColor: square.color,
            width: `${square.length}px`
        }}>
            {isPopupOpen && <ActionsPopup onOpenModal={onOpenModal} onRemove={onRemove} square={square} onToggleActionsPopup={onToggleActionsPopup} />}
        </div>
    )
}