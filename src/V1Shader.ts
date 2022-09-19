export const V1Shader = {

    uniforms: {
        'tDiffuse': { value: null },
        'tSceneDepth': { value: null },
        'tBackground': { value: null },
        'tDepth': { value: null }
    },
    vertexShader: /* glsl */ `

	    varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
    `,
    fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
        uniform sampler2D tBackground;
        uniform sampler2D tSceneDepth;
        uniform sampler2D tDepth;


		varying vec2 vUv;

        void main() {
            vec4 diffuse = texture2D(tDiffuse,vUv);
            vec4 depth = 1. - texture2D(tSceneDepth, vUv); 

            vec4 background = texture2D(tBackground, vUv); 
            vec4 bDepth = texture2D(tDepth, vUv); 


            vec4 color = vec4(1.);
            if ((depth.r > bDepth.r && diffuse.a > 0.)
                || dot(diffuse.rgb, vec3(1.)) == 1.
            ) {
                color = diffuse;
            } else {
                color = background;
            }


            gl_FragColor = color;
		}`


}