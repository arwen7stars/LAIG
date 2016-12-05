#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;


void main() {
	float tex_x = vTextureCoord.s;
	float tex_y = vTextureCoord.t;


	float mod_x = mod(tex_x*du, 1.0);
	float mod_y = mod(tex_y*dv, 1.0);

	
	vec4 color=vec4(mod_x,0.0,mod_y,1.0);

	gl_FragColor = color;
}