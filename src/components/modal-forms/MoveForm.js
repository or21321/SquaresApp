import { useFormRegister } from "../../hooks/useFormRegister";

export default function MoveForm({ onMove, square }) {
    const [moveAction, register,] = useFormRegister({ x: square.x, y: square.y, id: square.id })

    const onSubmit = () => {
        onMove(moveAction, true)
    }

    return (
        <form onSubmit={(ev) => { ev.preventDefault(); onSubmit() }}>
            <h2>Move</h2>
            <label>
                X:
                <input type="text" placeholder="x" {...register('x')} />
            </label>
            <label>
                Y:
                <input type="text" placeholder="y" {...register('y')} />
            </label>
            <button>Submit</button>
        </form>
    )
}