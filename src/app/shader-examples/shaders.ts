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
  description: 'Just pink, but at 60fps!'
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
    description: 'Using gl_FragCoord to colorize'
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
    description: 'Mixing colors'
  },
  {
    code: `
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 resolution;
// uniform vec2 u_mouse;
uniform float time;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) -
          smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.x);

    pct.r = smoothstep(0.0,1.0, st.x);
    pct.g = sin(st.x*PI);
    pct.b = pow(st.x,0.5);

    color = mix(colorA, colorB, pct);

    // Plot transition lines for each channel
    color = mix(color,vec3(1.0,0.0,0.0),plot(st,pct.r));
    color = mix(color,vec3(0.0,1.0,0.0),plot(st,pct.g));
    color = mix(color,vec3(0.0,0.0,1.0),plot(st,pct.b));

    gl_FragColor = vec4(color,1.0);
}`,
    description: 'Mixing colors and show a transition lines for different functions'
  },
  {
    code: `#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 resolution;
uniform float time;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/resolution;
    vec3 color = vec3(0.0);

    // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));

    gl_FragColor = vec4(color,1.0);
}`,
    description: 'Hue Colors'
  }
];
