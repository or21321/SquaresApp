import AddForm from "./modal-forms/AddForm"
import MoveForm from "./modal-forms/MoveForm"
import { useOnClickOutside } from "../hooks/useOnClickOutside"
import { useRef } from "react"

const dynamicForms = { AddForm, MoveForm }

export default function Modal({ currModalOpts, onCloseModal, onAdd, onMove }) {
    const modalRef = useRef(null)

    useOnClickOutside(modalRef, onCloseModal)


    const getDynamicCmp = () => {
        const Cmp = dynamicForms[currModalOpts.formType]
        return <Cmp key={currModalOpts.formType} square={currModalOpts.square} onAdd={onAdd} onMove={onMove} />
    }

    return (
        <section className="modal-wrapper">
            <article ref={modalRef} className="modal">
                {getDynamicCmp()}
            </article>
        </section>
    )
}