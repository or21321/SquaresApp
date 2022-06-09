import { useFormRegister } from "../../hooks/useFormRegister";

export default function AddForm({ onAdd }) {
    const [squareToAdd, register, setSquareToAdd] = useFormRegister({ x: 100, y: 100, color: '#ffffff', length: 100 })

    const onSubmit = () => {
        onAdd(squareToAdd)
    }

    return (
        <form onSubmit={(ev) => { ev.preventDefault(); onSubmit() }}>
            <h2>Add</h2>
            <label>
                X:
                <input type="text" placeholder="x" {...register('x')} />
            </label>
            <label>
                Y:
                <input type="text" placeholder="y" {...register('y')} />
            </label>
            <label>
                Color:
                <input type="color" placeholder="Color" {...register('color')} />
            </label>
            <label>
                Length:
                <input type="text" placeholder="Length" {...register('length')} />
            </label>
            <button>Submit</button>
        </form>
    )
}