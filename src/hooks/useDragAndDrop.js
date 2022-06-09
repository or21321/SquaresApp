import { useEffect, useRef } from "react";

export function useDragAndDrop(ref, dndCbs) {
    const isListenerOn = useRef(false)

    const handler = (mouseDownEvent) => {
        // For left click
        if (mouseDownEvent.button !== 0) return

        const elContainer = mouseDownEvent.path[2]

        const startOffsetX = mouseDownEvent.offsetX
        const startOffsetY = mouseDownEvent.offsetY

        const x = mouseDownEvent.target.offsetLeft
        const y = mouseDownEvent.target.offsetTop

        // For nested components:
        if (mouseDownEvent.target === ref.current) dndCbs.mousedown({ id: ref.squareId, x, y }, true)

        function onMouseMove(mouseMoveEvent) {
            // index should be changed here according to the container

            let x = mouseMoveEvent.pageX - elContainer.offsetLeft - startOffsetX
            let y = mouseMoveEvent.pageY - elContainer.offsetTop - startOffsetY

            // Stricting drag only inside container:
            const { target } = mouseDownEvent
            const maxX = (elContainer.offsetWidth - target.offsetWidth)
            const maxY = (elContainer.offsetHeight - target.offsetHeight)
            if (target.offsetLeft <= 0 && x <= 0 ||
                target.offsetTop <= 0 && y <= 0 ||
                target.offsetTop >= maxY && y >= maxY ||
                target.offsetLeft >= maxX && x >= maxX) return

            // Validating item is inside container and fixing if needed:
            if (x < 0) x = 0
            else if (x > maxX) x = maxX
            if (y < 0) y = 0
            else if (y > maxY) y = maxY

            dndCbs.mousemove({ id: ref.squareId, x, y })
        }
        function onMouseUp() {
            document.body.removeEventListener("mousemove", onMouseMove);

            dndCbs.mouseup()
        }

        document.body.addEventListener("mouseup", onMouseUp, { once: true });
        document.body.addEventListener("mousemove", onMouseMove);
    };

    useEffect(() => {
        if (!ref.current || isListenerOn.current) return
        isListenerOn.current = true
        ref.current.addEventListener('mousedown', handler)
    }, [ref])
}