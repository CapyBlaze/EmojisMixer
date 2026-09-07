import { useEffect, useRef } from "react";
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

            <Pipe inputPipeRef={inputPipe} outputPipeRef={outputPipe} />

            <Title />
            <Cookbook />

            <SmallScreen />
        </>
    );
}

export default App;
