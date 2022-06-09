import Square from "./Square"

export default function SquareList({ squares, onOpenModal, onRemove, dndCbs }) {

    if (!squares.length) return (
        <div>Please add a square</div>
    )
    return (
        <ul className="square-list">
            {squares.length && squares.map(square => <Square square={square} onOpenModal={onOpenModal}
                onRemove={onRemove} dndCbs={dndCbs} key={square.id} />)}
        </ul>
    )
}