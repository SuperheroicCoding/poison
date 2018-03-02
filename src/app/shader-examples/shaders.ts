export interface ShaderDef {
  code: string;
  description: string;
}

// noinspection TsLint
export const shaders: ShaderDef[] = [{
  code: `
    #ifdef GL_ES
    precision mediump float;
    #endif
     
    void main() {
      gl_FragColor = vec4(1.0,0.0,1.0,1.0);
    }`,
  description: 'Just red at 60fps'
},
  {
    code: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float time;

    void main() {
	    gl_FragColor = vec4(abs(sin(time)),0.0,0.0,1.0);
    }`,
    description: 'Using an uniform value time to change color'
  },
  {
    code: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float time;
    uniform vec2 resolution;

    void main() {
	    	vec2 st = gl_FragCoord.xy/resolution;
	      gl_FragColor = vec4(st, 0.0, 1.0);
    }`,
    description: 'using gl_FragCoord to colorize'
  },
  {
    code: `
    #ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

void main() {
    vec3 color = vec3(0.0);

    float pct = abs(sin(time));

    // Mix uses pct (a value from 0-1) to
    // mix the two colors
    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.0);
}`,
    description: 'mixing colors'
  }


];
