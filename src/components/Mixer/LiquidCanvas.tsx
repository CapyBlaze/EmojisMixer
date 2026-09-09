import { forwardRef, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RefObject } from "react";
import type { EmojiData } from "../../interface/emoji";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import CONFIG from "../../config/config.json";

function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    let color = "#";
    for (let i = 0; i < 3; i++) color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
    return color;
}

interface LiquidSceneProps {
    emojis: EmojiData[];
    progressRef: RefObject<number>;
    isBlendingRef: RefObject<boolean>;
    isDrainingRef: RefObject<boolean>;
}

const LiquidScene = ({ emojis, progressRef, isBlendingRef, isDrainingRef }: LiquidSceneProps) => {
    const WAVE_SPEED = 4.0;
    const LIQUID_SPEED = 1.0;

    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const shaderTimeRef = useRef(0);
    const waveTimeRef = useRef(0);
    const activityRef = useRef(0);

    const targetColorsRef = useRef<[THREE.Color, THREE.Color, THREE.Color]>([
        new THREE.Color("#a3d9ff"),
        new THREE.Color("#000000"),
        new THREE.Color("#a3d9ff"),
    ]);

    useEffect(() => {
        const uniqueColors = Array.from(
            new Set(emojis.map((e) => e.colors[0] || stringToColor(e.name))),
        );
        uniqueColors.sort();

        if (uniqueColors.length === 0) {
            return;
        }

        targetColorsRef.current = [
            new THREE.Color(uniqueColors[0]),
            new THREE.Color(uniqueColors[1] || uniqueColors[0]),
            new THREE.Color(uniqueColors[2] || uniqueColors[0]),
        ];
    }, [emojis]);

    useFrame((_, delta) => {
        const mat = materialRef.current;
        if (!mat) return;

        const target = isBlendingRef.current || isDrainingRef.current ? 1 : 0;
        const lerpFactor = target > activityRef.current ? 0.08 : 0.015;
        activityRef.current += (target - activityRef.current) * lerpFactor;

        shaderTimeRef.current += delta * activityRef.current * LIQUID_SPEED;
        waveTimeRef.current += delta * activityRef.current * WAVE_SPEED;

        mat.uniforms.uTime.value = shaderTimeRef.current;
        mat.uniforms.uWaveTime.value = waveTimeRef.current;
        mat.uniforms.uProgress.value = progressRef.current * CONFIG.mixerMaxFillLevel;
        mat.uniforms.uActivity.value = activityRef.current;

        const [target1, target2, target3] = targetColorsRef.current;
        mat.uniforms.uColor1.value.lerp(target1, 0.05);
        mat.uniforms.uColor2.value.lerp(target2, 0.05);
        mat.uniforms.uColor3.value.lerp(target3, 0.05);
    });

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uWaveTime: { value: 0 },
            uProgress: { value: 0 },
            uActivity: { value: 0 },
            uColor1: { value: new THREE.Color("#a3d9ff") },
            uColor2: { value: new THREE.Color("#000000") },
            uColor3: { value: new THREE.Color("#a3d9ff") },
        }),
        [],
    );

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

interface LiquidCanvasProps extends LiquidSceneProps {
    className?: string;
    style?: React.CSSProperties;
}

const LiquidCanvas = forwardRef<HTMLCanvasElement, LiquidCanvasProps>(
    ({ className, style, ...sceneProps }, ref) => {
        return (
            <Canvas
                className={className}
                style={style}
                camera={{ position: [0, 0, 1] }}
                gl={{ alpha: true, antialias: false }}
                onCreated={({ gl }) => {
                    if (typeof ref === "function") ref(gl.domElement);
                    else if (ref) ref.current = gl.domElement;
                }}
            >
                <LiquidScene {...sceneProps} />
            </Canvas>
        );
    },
);

LiquidCanvas.displayName = "LiquidCanvas";
export default LiquidCanvas;
