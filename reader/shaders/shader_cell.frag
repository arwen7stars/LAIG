#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
	float tex_x = vTextureCoord.s;
	float tex_y = vTextureCoord.t;

	vec4 color;

	if(tex_x < 0.02 || tex_y < 0.02 || tex_x > 0.98 || tex_y > 0.98)
		color = vec4(1.0, 1.0, 1.0, 1.0);
	else{
		color= texture2D(uSampler, vTextureCoord);
	}
	
	gl_FragColor = color;
}