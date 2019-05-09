export const MandelbrotVertex = `
  precision highp float;
  varying vec3 vPos;
  varying vec2 vMandelbrotPos;
  varying vec3 vNormal;
  uniform float zoom;
  void main () {
    vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;

    vNormal = vec3(0.,1.,0.);
    vMandelbrotPos = position.xy * zoom;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

export const MandelbrotFragment = `
  struct PointLight {
    vec3 color;
    vec3 position; // light position, in camera coordinates
    float distance; // used for attenuation purposes. Since
                  // we're writing our own shader, it can
                  // really be anything we want (as long as
                  // we assign it to our light in its
                  // "distance" field
    float decay;
  };
  uniform PointLight pointLights[NUM_POINT_LIGHTS];
  precision highp float;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying vec2 vMandelbrotPos;

  void main () {

    vec2 fractal = vMandelbrotPos.xy;
    for (int i = 0; i < 35; i++) {
      fractal = vMandelbrotPos.xy + vec2(
        fractal.x * fractal.x - fractal.y * fractal.y,
          2.0 * fractal.x * fractal.y
        );
      // interpolate fractal color over position
       gl_FragColor = vec4(fractal, 0, 1);
      // if outside of fractal, use greyish
      if (length(fractal) > 2.5) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.);
      }
    }

    vec4 addedLights = vec4(0.0,0.0,0.0, 1.0);
    for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
      vec3 lightDirection = normalize(vPos - pointLights[l].position);
      addedLights.rgb += clamp(dot(-lightDirection, vNormal), 0.0, 1.0) * pointLights[l].color;
    }
    gl_FragColor = mix(gl_FragColor, addedLights, addedLights);
  }
`;
