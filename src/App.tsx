import { useEffect, useRef, useState } from "react";
import Emojis from "./components/Emojis";
import Mixer from "./components/Mixer";
import Output from "./components/Output";
import Title from "./components/Title";
import Pipe from "./components/Pipe";
import SmallScreen from "./components/SmallScreen";
import Cookbook from "./components/Cookbook";

function App() {
    const inputPipe = useRef<HTMLDivElement | null>(null);
    const outputPipe = useRef<HTMLDivElement | null>(null);

    const [coords, setCoords] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(
        null,
    );

    const updateLinePosition = () => {
        if (inputPipe.current && outputPipe.current) {
            const rectInput = inputPipe.current.getBoundingClientRect();
            const rectOutput = outputPipe.current.getBoundingClientRect();

            setCoords({
                x1: rectOutput.left + rectOutput.width / 2,
                y1: rectOutput.top + rectOutput.height / 2,
                x2: rectInput.left + rectInput.width / 2,
                y2: rectInput.top + rectInput.height / 2,
            });
        }
    };

    useEffect(() => {
        updateLinePosition();

        window.addEventListener("resize", updateLinePosition);
        window.addEventListener("scroll", updateLinePosition);

        return () => {
            window.removeEventListener("resize", updateLinePosition);
            window.removeEventListener("scroll", updateLinePosition);
        };
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const dataValue = queryParams.get("data");

        if (dataValue) {
            window.dispatchEvent(new CustomEvent("load-data", { detail: { data: dataValue } }));
        }
    }, []);

    return (
        <>
            <Emojis />
            <Mixer outputPipeRef={outputPipe} />
            <Output inputPipeRef={inputPipe} />

            <Pipe coords={coords} />

            <Title />
            <Cookbook />

            <SmallScreen />
        </>
    );
}

export default App;
