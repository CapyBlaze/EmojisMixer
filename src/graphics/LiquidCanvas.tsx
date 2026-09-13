import { forwardRef, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { RefObject } from "react";
import type { EmojiData } from "../interfaces/emoji";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import CONFIG from "../configs/config.json";
import EMOJIS from "../configs/emojis.json";

function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    let color = "#";
    for (let i = 0; i < 3; i++) color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
    return color;
}

interface LiquidSceneProps {
    emojis: EmojiData[] | string[];
    progressRef?: RefObject<number>;
    progress?: number;
    isBlendingRef?: RefObject<boolean>;
    isDrainingRef?: RefObject<boolean>;
    maxFillLevel?: number;
    static?: boolean;
}

const WAVE_SPEED = 4.0;
const LIQUID_SPEED = 1.0;

const MAX_COLORS = 6;

const LiquidScene = ({
    emojis,
    progressRef,
    progress = 0,
    isBlendingRef,
    isDrainingRef,
    maxFillLevel = CONFIG.mixerMaxFillLevel,
    static: isStatic = false,
}: LiquidSceneProps) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { invalidate } = useThree();

    const resolvedColors = useMemo(() => {
        if (!emojis || emojis.length === 0) return [];

        const isStringArray = typeof emojis[0] === "string";

        const uniqueColors = isStringArray
            ? Array.from(
                  new Set(
                      (emojis as string[]).map(
                          (name) =>
                              EMOJIS.find((e) => e.name === name)?.colors[0] || stringToColor(name),
                      ),
                  ),
              )
            : Array.from(
                  new Set((emojis as EmojiData[]).map((e) => e.colors[0] || stringToColor(e.name))),
              );

        return uniqueColors.sort();
    }, [emojis]);

    const targetColorsRef = useRef<THREE.Color[]>(
        Array.from({ length: MAX_COLORS }, () => new THREE.Color("#a3d9ff")),
    );
    const targetPresenceRef = useRef<number[]>(
        Array.from({ length: MAX_COLORS }, (_, i) => (i === 0 ? 1 : 0)),
    );

    useEffect(() => {
        if (resolvedColors.length === 0) return;

        for (let i = 0; i < MAX_COLORS; i++) {
            if (i < resolvedColors.length) {
                targetColorsRef.current[i].set(resolvedColors[i]);
                targetPresenceRef.current[i] = 1;
            } else {
                targetPresenceRef.current[i] = 0;
            }
        }

        if (isStatic) {
            const mat = materialRef.current;
            if (mat) {
                for (let i = 0; i < MAX_COLORS; i++) {
                    (mat.uniforms.uColors.value[i] as THREE.Color).copy(targetColorsRef.current[i]);
                    mat.uniforms.uColorPresence.value[i] = targetPresenceRef.current[i];
                }
                mat.uniforms.uProgress.value = progress * maxFillLevel;
                mat.uniforms.uActivity.value = 0;
                mat.uniforms.uTime.value = 0;
                mat.uniforms.uWaveTime.value = 0;
                invalidate();
            }
        }
    }, [invalidate, isStatic, maxFillLevel, progress, emojis, resolvedColors]);

    const shaderTimeRef = useRef(0);
    const waveTimeRef = useRef(0);
    const activityRef = useRef(0);

    useFrame((_, delta) => {
        if (isStatic) return;

        const mat = materialRef.current;
        if (!mat) return;

        const target = isBlendingRef?.current || isDrainingRef?.current ? 1 : 0;
        const lerpFactor = target > activityRef.current ? 0.08 : 0.015;
        activityRef.current += (target - activityRef.current) * lerpFactor;

        shaderTimeRef.current += delta * activityRef.current * LIQUID_SPEED;
        waveTimeRef.current += delta * activityRef.current * WAVE_SPEED;

        mat.uniforms.uTime.value = shaderTimeRef.current;
        mat.uniforms.uWaveTime.value = waveTimeRef.current;
        mat.uniforms.uProgress.value = (progressRef?.current ?? progress) * maxFillLevel;
        mat.uniforms.uActivity.value = activityRef.current;

        for (let i = 0; i < MAX_COLORS; i++) {
            (mat.uniforms.uColors.value[i] as THREE.Color).lerp(targetColorsRef.current[i], 0.05);
            mat.uniforms.uColorPresence.value[i] +=
                (targetPresenceRef.current[i] - mat.uniforms.uColorPresence.value[i]) * 0.05;
        }
    });

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uWaveTime: { value: 0 },
            uProgress: { value: 0 },
            uActivity: { value: 0 },
            uColors: {
                value: Array.from({ length: MAX_COLORS }, () => new THREE.Color("#a3d9ff")),
            },
            uColorPresence: {
                value: Array.from({ length: MAX_COLORS }, (_, i) => (i === 0 ? 1 : 0)),
            },
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
                gl={{ alpha: true, antialias: false, preserveDrawingBuffer: true }}
                frameloop={sceneProps.static ? "demand" : "always"}
                resize={{ offsetSize: true }}
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
