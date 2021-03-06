#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 c;

void main() {
	float tex_x = vTextureCoord.s;
	float tex_y = vTextureCoord.t;

	vec4 color;

	if(tex_x < 0.05 || tex_y < 0.05 || tex_x > 0.95 || tex_y > 0.95)
		color = vec4(1.0, 1.0, 1.0, 1.0);
	else{
		color=c;
	}
	
	gl_FragColor = texture2D(uSampler, vTextureCoord);
	gl_FragColor.rgb = 0.8*gl_FragColor.rgb + 0.2*color.rgb;
}