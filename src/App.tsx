import { useRef } from "react";
import Emojis from "./components/Emojis";
import Mixer from "./features/mixer/Mixer";
import Output from "./features/output/Output";
import Title from "./components/Title";
import Pipe from "./components/Pipe";
import SmallScreen from "./components/SmallScreen";
import Cookbook from "./features/cookbook/Cookbook";
import LoadingScreen from "./components/LoadingScreen";

function App() {
    const inputPipe = useRef<HTMLDivElement | null>(null);
    const outputPipe = useRef<HTMLDivElement | null>(null);

    return (
        <>
            <Emojis />
            <Mixer outputPipeRef={outputPipe} />
            <Output inputPipeRef={inputPipe} />

            <Pipe inputPipeRef={inputPipe} outputPipeRef={outputPipe} />

            <Title />
            <Cookbook />

            <LoadingScreen />
            <SmallScreen />
        </>
    );
}

export default App;
