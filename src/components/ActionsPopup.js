import { useRef } from "react"
import { useOnClickOutside } from "../hooks/useOnClickOutside"

export default function ActionsPopup({ onOpenModal, onRemove, square, onToggleActionsPopup }) {
    const popupRef = useRef(null)

    useOnClickOutside(popupRef, onToggleActionsPopup)

    return (
        <div onMouseDown={(ev) => ev.stopPropagation()} ref={popupRef} className="actions-popup">
            <button className="btn" onClick={() => onOpenModal('MoveForm', square)}>Move</button>
            <button className="btn" onClick={(ev) => { ev.stopPropagation(); onRemove(square.id) }}>Remove</button>
        </div>
    )
}