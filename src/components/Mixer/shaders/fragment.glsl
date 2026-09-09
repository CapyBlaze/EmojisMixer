#define MAX_COLORS 6

uniform float uTime;
uniform float uWaveTime;
uniform float uProgress;
uniform float uActivity;
uniform vec3 uColors[MAX_COLORS];
uniform float uColorPresence[MAX_COLORS];

varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 q = vec2(0.);
    q.x = fbm(vUv + 0.00 * uTime);
    q.y = fbm(vUv + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm(vUv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime);
    r.y = fbm(vUv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime);

    vec2 warped = vUv + r;

    float weights[MAX_COLORS];
    float totalWeight = 0.0;

    for (int i = 0; i < MAX_COLORS; i++) {
        vec2 offset = vec2(float(i) * 12.9898, float(i) * 78.233);
        float n = fbm(warped * 1.4 + offset);
        float w = pow(smoothstep(-0.5, 0.5, n), 2.0) * uColorPresence[i];
        weights[i] = w;
        totalWeight += w;
    }

    vec3 color = uColors[0];
    if (totalWeight > 0.0001) {
        color = vec3(0.0);
        for (int i = 0; i < MAX_COLORS; i++) {
            color += uColors[i] * (weights[i] / totalWeight);
        }
    }

    float wave = sin(vUv.x * 10.0 + uWaveTime) * 0.03 * uActivity;
    float currentFill = uProgress + wave;

    float edge = smoothstep(currentFill - 0.01, currentFill + 0.01, vUv.y);
    if (edge > 0.5) {
        discard;
    }

    gl_FragColor = vec4(color, 1.0);
}