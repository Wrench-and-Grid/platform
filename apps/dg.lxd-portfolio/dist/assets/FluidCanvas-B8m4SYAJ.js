import{a as e}from"./rolldown-runtime-BYbx6iT9.js";import{i as t,r as n}from"./vendor-motion-CKFPyit_.js";var r=e(t(),1),i=n(),a=[{r:1,g:.357,b:.133},{r:.682,g:.902,b:.929},{r:.22,g:.22,b:1},{r:.722,g:.749,b:1},{r:.957,g:.953,b:.525}],o=.15,s=`
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }`,ee=`
  precision mediump float; precision mediump sampler2D;
  varying highp vec2 vUv; uniform sampler2D uTexture;
  void main () { gl_FragColor = texture2D(uTexture, vUv); }`,te=`
  precision mediump float; precision mediump sampler2D;
  varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
  void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`,ne=`
  precision highp float; precision highp sampler2D;
  varying vec2 vUv; uniform sampler2D uTarget;
  uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
  void main () {
    vec2 p = vUv - point.xy; p.x *= aspectRatio;
    vec3 splat = exp(-dot(p,p)/radius) * color;
    gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
  }`,re=`
  precision highp float; precision highp sampler2D;
  varying vec2 vUv; uniform sampler2D uVelocity, uSource;
  uniform vec2 texelSize, dyeTexelSize; uniform float dt, dissipation;
  vec4 bilerp(sampler2D s, vec2 uv, vec2 ts) {
    vec2 st = uv/ts - 0.5, iuv = floor(st), fuv = fract(st);
    vec4 a = texture2D(s,(iuv+vec2(0.5,0.5))*ts), b = texture2D(s,(iuv+vec2(1.5,0.5))*ts);
    vec4 c = texture2D(s,(iuv+vec2(0.5,1.5))*ts), d = texture2D(s,(iuv+vec2(1.5,1.5))*ts);
    return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);
  }
  void main () {
  #ifdef MANUAL_FILTERING
    vec2 coord = vUv - dt * bilerp(uVelocity,vUv,texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
  #else
    vec2 coord = vUv - dt * texture2D(uVelocity,vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
  #endif
    gl_FragColor = result / (1.0 + dissipation * dt);
  }`,ie=`
  precision mediump float; precision mediump sampler2D;
  varying highp vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity;
  void main () {
    float L=texture2D(uVelocity,vL).x, R=texture2D(uVelocity,vR).x;
    float T=texture2D(uVelocity,vT).y, B=texture2D(uVelocity,vB).y;
    vec2 C = texture2D(uVelocity,vUv).xy;
    if(vL.x<0.0){L=-C.x;} if(vR.x>1.0){R=-C.x;}
    if(vT.y>1.0){T=-C.y;} if(vB.y<0.0){B=-C.y;}
    gl_FragColor = vec4(0.5*(R-L+T-B),0,0,1);
  }`,ae=`
  precision mediump float; precision mediump sampler2D;
  varying highp vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity;
  void main () {
    float v = texture2D(uVelocity,vR).y - texture2D(uVelocity,vL).y
            - texture2D(uVelocity,vT).x + texture2D(uVelocity,vB).x;
    gl_FragColor = vec4(0.5*v, 0, 0, 1);
  }`,oe=`
  precision highp float; precision highp sampler2D;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uVelocity, uCurl; uniform float curl, dt;
  void main () {
    float L=texture2D(uCurl,vL).x, R=texture2D(uCurl,vR).x;
    float T=texture2D(uCurl,vT).x, B=texture2D(uCurl,vB).x, C=texture2D(uCurl,vUv).x;
    vec2 force = 0.5*vec2(abs(T)-abs(B), abs(R)-abs(L));
    force = force/(length(force)+0.0001) * curl * C;
    force.y *= -1.0;
    vec2 vel = texture2D(uVelocity,vUv).xy + force*dt;
    gl_FragColor = vec4(clamp(vel,-1000.0,1000.0), 0, 1);
  }`,se=`
  precision mediump float; precision mediump sampler2D;
  varying highp vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uPressure, uDivergence;
  void main () {
    float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x;
    float T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x;
    float div = texture2D(uDivergence,vUv).x;
    gl_FragColor = vec4((L+R+B+T-div)*0.25, 0, 0, 1);
  }`,ce=`
  precision mediump float; precision mediump sampler2D;
  varying highp vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uPressure, uVelocity;
  void main () {
    float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x;
    float T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x;
    vec2 vel = texture2D(uVelocity,vUv).xy - vec2(R-L, T-B);
    gl_FragColor = vec4(vel, 0, 1);
  }`,le=`
  precision highp float; precision highp sampler2D;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uTexture, uDithering; uniform vec2 ditherScale, texelSize;
  vec3 linearToGamma(vec3 c) {
    c = max(c, vec3(0));
    return max(1.055*pow(c, vec3(0.416666667))-0.055, vec3(0));
  }
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
  #ifdef SHADING
    vec3 lc=texture2D(uTexture,vL).rgb, rc=texture2D(uTexture,vR).rgb;
    vec3 tc=texture2D(uTexture,vT).rgb, bc=texture2D(uTexture,vB).rgb;
    float dx=length(rc)-length(lc), dy=length(tc)-length(bc);
    vec3 n = normalize(vec3(dx, dy, length(texelSize)));
    float diffuse = clamp(dot(n, vec3(0,0,1)) + 0.7, 0.7, 1.0);
    c *= diffuse;
  #endif
    gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
  }`;function c(e){e&&(e.id=-1,e.down=!1,e.moved=!1,e.deltaX=0,e.deltaY=0)}function ue(e,t,n,r,i){e.texcoordX=n/t.width,e.texcoordY=1-r/t.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.moved=!1,i&&(e.color=i)}function l({className:e,interactionRegion:t}){let n=(0,r.useRef)(null),l=(0,r.useRef)(t),u=(0,r.useRef)(null),d=(0,r.useRef)(!1),f=(0,r.useRef)(!1);return(0,r.useEffect)(()=>{l.current=t,t||(c(u.current),d.current=!1,f.current=!1)},[t]),(0,r.useEffect)(()=>{let e=n.current;if(!e)return;let t=0,r=()=>{let e=a[t%a.length];return t++,{r:e.r*o,g:e.g*o,b:e.b*o}},i={SIM_RESOLUTION:128,DYE_RESOLUTION:1440,DENSITY_DISSIPATION:.5,VELOCITY_DISSIPATION:3,PRESSURE:.1,PRESSURE_ITERATIONS:20,CURL:3,SPLAT_RADIUS:.2,SPLAT_FORCE:6e3,SHADING:!0,COLOR_UPDATE_SPEED:10},p=[{id:-1,texcoordX:0,texcoordY:0,prevTexcoordX:0,prevTexcoordY:0,deltaX:0,deltaY:0,down:!1,moved:!1,color:{r:0,g:0,b:0}}],m={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1},h=e.getContext(`webgl2`,m);if(h||=e.getContext(`webgl`,m)||e.getContext(`experimental-webgl`,m),!h)return;let g=h instanceof WebGL2RenderingContext,_,v=null;g?(h.getExtension(`EXT_color_buffer_float`),v=h.getExtension(`OES_texture_float_linear`)):(_=h.getExtension(`OES_texture_half_float`),v=h.getExtension(`OES_texture_half_float_linear`)),h.clearColor(0,0,0,1);let y=g?h.HALF_FLOAT:_.HALF_FLOAT_OES,b,x,S,de=(e,t,n,r)=>{let i=e.createTexture();if(!i)return!1;e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,t,4,4,0,n,r,null);let a=e.createFramebuffer();return a?(e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE):!1},C=(e,t,n,r)=>de(e,t,n,r)?{internalFormat:t,format:n}:`R16F`in e&&t===e.R16F?C(e,e.RG16F,e.RG,r):`RG16F`in e&&t===e.RG16F?C(e,e.RGBA16F,e.RGBA,r):null;if(g){let e=h;b=C(e,e.RGBA16F,e.RGBA,y),x=C(e,e.RG16F,e.RG,y),S=C(e,e.R16F,e.RED,y)}else b=C(h,h.RGBA,h.RGBA,y),x=C(h,h.RGBA,h.RGBA,y),S=C(h,h.RGBA,h.RGBA,y);if(!b||!x||!S)return;v||(i.DYE_RESOLUTION=256,i.SHADING=!1);let w=(e,t,n)=>{let r=h.createShader(e);if(!r)return null;let i=(n||[]).map(e=>`#define ${e}\n`).join(``)+t;return h.shaderSource(r,i),h.compileShader(r),r},T=(e,t,n)=>{let r=h.createProgram();if(!r)return null;let i=w(h.VERTEX_SHADER,e),a=w(h.FRAGMENT_SHADER,t,n);return!i||!a?null:(h.attachShader(r,i),h.attachShader(r,a),h.linkProgram(r),r)},E=e=>{let t={},n=h.getProgramParameter(e,h.ACTIVE_UNIFORMS);for(let r=0;r<n;r++){let n=h.getActiveUniform(e,r);n&&(t[n.name]=h.getUniformLocation(e,n.name))}return t},D=(e,t,n)=>{let r=T(e,t,n);if(!r)throw Error(`Failed to create shader program`);return{uniforms:E(r),bind:()=>h.useProgram(r)}},fe=(e,t)=>{let n={},r=null,i={};return{get uniforms(){return i},bind:()=>{r&&h.useProgram(r)},setKeywords:a=>{let o=a.slice().sort().join(`,`);if(!n[o]){let r=T(e,t,a);if(!r)throw Error(`Failed to create material program`);n[o]={program:r,uniforms:E(r)}}let s=n[o];s.program!==r&&(r=s.program,i=s.uniforms)}}},O=D(s,ee),k=D(s,te),A=D(s,ne),j=D(s,re,v?null:[`MANUAL_FILTERING`]),M=D(s,ie),N=D(s,ae),P=D(s,oe),F=D(s,se),I=D(s,ce),L=fe(s,le);L.setKeywords(i.SHADING?[`SHADING`]:[]);let pe=h.createBuffer();h.bindBuffer(h.ARRAY_BUFFER,pe),h.bufferData(h.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),h.STATIC_DRAW);let me=h.createBuffer();h.bindBuffer(h.ELEMENT_ARRAY_BUFFER,me),h.bufferData(h.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),h.STATIC_DRAW),h.vertexAttribPointer(0,2,h.FLOAT,!1,0,0),h.enableVertexAttribArray(0);let R=(e,t)=>{e?(h.viewport(0,0,e.width,e.height),h.bindFramebuffer(h.FRAMEBUFFER,e.fbo)):(h.viewport(0,0,h.drawingBufferWidth,h.drawingBufferHeight),h.bindFramebuffer(h.FRAMEBUFFER,null)),t&&(h.clearColor(0,0,0,1),h.clear(h.COLOR_BUFFER_BIT)),h.drawElements(h.TRIANGLES,6,h.UNSIGNED_SHORT,0)},z=(e,t,n,r,i,a)=>{h.activeTexture(h.TEXTURE0);let o=h.createTexture();h.bindTexture(h.TEXTURE_2D,o),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MIN_FILTER,a),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MAG_FILTER,a),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_S,h.CLAMP_TO_EDGE),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_T,h.CLAMP_TO_EDGE),h.texImage2D(h.TEXTURE_2D,0,n,e,t,0,r,i,null);let s=h.createFramebuffer();return h.bindFramebuffer(h.FRAMEBUFFER,s),h.framebufferTexture2D(h.FRAMEBUFFER,h.COLOR_ATTACHMENT0,h.TEXTURE_2D,o,0),h.viewport(0,0,e,t),h.clear(h.COLOR_BUFFER_BIT),{texture:o,fbo:s,width:e,height:t,texelSizeX:1/e,texelSizeY:1/t,attach(e){return h.activeTexture(h.TEXTURE0+e),h.bindTexture(h.TEXTURE_2D,o),e}}},B=(e,t,n,r,i,a)=>{let o=z(e,t,n,r,i,a),s=z(e,t,n,r,i,a);return{width:e,height:t,texelSizeX:o.texelSizeX,texelSizeY:o.texelSizeY,get read(){return o},set read(e){o=e},get write(){return s},set write(e){s=e},swap(){let e=o;o=s,s=e}}},V=(e,t,n,r,i,a,o)=>{if(e.width===t&&e.height===n)return e;let s=z(t,n,r,i,a,o);return O.bind(),h.uniform1i(O.uniforms.uTexture,e.read.attach(0)),R(s),e.read=s,e.write=z(t,n,r,i,a,o),e.width=t,e.height=n,e.texelSizeX=1/t,e.texelSizeY=1/n,e},H,U,W,G,K,q=e=>{let t=h.drawingBufferWidth/h.drawingBufferHeight;t<1&&(t=1/t);let n=Math.round(e),r=Math.round(e*t);return h.drawingBufferWidth>h.drawingBufferHeight?{width:r,height:n}:{width:n,height:r}},J=()=>{let e=q(i.SIM_RESOLUTION),t=q(i.DYE_RESOLUTION),n=y,r=v?h.LINEAR:h.NEAREST;h.disable(h.BLEND),H=H?V(H,t.width,t.height,b.internalFormat,b.format,n,r):B(t.width,t.height,b.internalFormat,b.format,n,r),U=U?V(U,e.width,e.height,x.internalFormat,x.format,n,r):B(e.width,e.height,x.internalFormat,x.format,n,r),W=z(e.width,e.height,S.internalFormat,S.format,n,h.NEAREST),G=z(e.width,e.height,S.internalFormat,S.format,n,h.NEAREST),K=B(e.width,e.height,S.internalFormat,S.format,n,h.NEAREST)},Y=()=>{let t=window.devicePixelRatio||1,n=Math.floor(e.clientWidth*t),r=Math.floor(e.clientHeight*t);return e.width!==n||e.height!==r?(e.width=n,e.height=r,!0):!1},he=t=>{let n=e.width/e.height;return n>1&&(t*=n),t},ge=(t,n,r,a,o)=>{A.bind(),h.uniform1i(A.uniforms.uTarget,U.read.attach(0)),h.uniform1f(A.uniforms.aspectRatio,e.width/e.height),h.uniform2f(A.uniforms.point,t,n),h.uniform3f(A.uniforms.color,r,a,0),h.uniform1f(A.uniforms.radius,he(i.SPLAT_RADIUS/100)),R(U.write),U.swap(),h.uniform1i(A.uniforms.uTarget,H.read.attach(0)),h.uniform3f(A.uniforms.color,o.r,o.g,o.b),R(H.write),H.swap()},_e=e=>{h.disable(h.BLEND),N.bind(),h.uniform2f(N.uniforms.texelSize,U.texelSizeX,U.texelSizeY),h.uniform1i(N.uniforms.uVelocity,U.read.attach(0)),R(G),P.bind(),h.uniform2f(P.uniforms.texelSize,U.texelSizeX,U.texelSizeY),h.uniform1i(P.uniforms.uVelocity,U.read.attach(0)),h.uniform1i(P.uniforms.uCurl,G.attach(1)),h.uniform1f(P.uniforms.curl,i.CURL),h.uniform1f(P.uniforms.dt,e),R(U.write),U.swap(),M.bind(),h.uniform2f(M.uniforms.texelSize,U.texelSizeX,U.texelSizeY),h.uniform1i(M.uniforms.uVelocity,U.read.attach(0)),R(W),k.bind(),h.uniform1i(k.uniforms.uTexture,K.read.attach(0)),h.uniform1f(k.uniforms.value,i.PRESSURE),R(K.write),K.swap(),F.bind(),h.uniform2f(F.uniforms.texelSize,U.texelSizeX,U.texelSizeY),h.uniform1i(F.uniforms.uDivergence,W.attach(0));for(let e=0;e<i.PRESSURE_ITERATIONS;e++)h.uniform1i(F.uniforms.uPressure,K.read.attach(1)),R(K.write),K.swap();I.bind(),h.uniform2f(I.uniforms.texelSize,U.texelSizeX,U.texelSizeY),h.uniform1i(I.uniforms.uPressure,K.read.attach(0)),h.uniform1i(I.uniforms.uVelocity,U.read.attach(1)),R(U.write),U.swap(),j.bind(),h.uniform2f(j.uniforms.texelSize,U.texelSizeX,U.texelSizeY),v||h.uniform2f(j.uniforms.dyeTexelSize,U.texelSizeX,U.texelSizeY);let t=U.read.attach(0);h.uniform1i(j.uniforms.uVelocity,t),h.uniform1i(j.uniforms.uSource,t),h.uniform1f(j.uniforms.dt,e),h.uniform1f(j.uniforms.dissipation,i.VELOCITY_DISSIPATION),R(U.write),U.swap(),v||h.uniform2f(j.uniforms.dyeTexelSize,H.texelSizeX,H.texelSizeY),h.uniform1i(j.uniforms.uVelocity,U.read.attach(0)),h.uniform1i(j.uniforms.uSource,H.read.attach(1)),h.uniform1f(j.uniforms.dissipation,i.DENSITY_DISSIPATION),R(H.write),H.swap()},X=e=>Math.floor(e*(window.devicePixelRatio||1)),Z=(e,t)=>{let n=l.current;if(!n)return!1;let r=n.getBoundingClientRect();return e>=r.left&&e<=r.right&&t>=r.top&&t<=r.bottom},ve=(t,n,i,a)=>{t.id=n,t.down=!0,t.moved=!1,t.texcoordX=i/e.width,t.texcoordY=1-a/e.height,t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.deltaX=0,t.deltaY=0,t.color=r()},ye=(t,n,r,i)=>{let a=e.width/e.height;t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.texcoordX=n/e.width,t.texcoordY=1-r/e.height,t.deltaX=(t.texcoordX-t.prevTexcoordX)*(a<1?a:1),t.deltaY=(t.texcoordY-t.prevTexcoordY)/(a>1?a:1),t.moved=Math.abs(t.deltaX)>0||Math.abs(t.deltaY)>0,i&&(t.color=i)},be=e=>{let t=p[0];if(!Z(e.clientX,e.clientY)){c(t),d.current=!1;return}ve(t,-1,X(e.clientX),X(e.clientY)),d.current=!0;let n=r();n.r*=10,n.g*=10,n.b*=10,ge(t.texcoordX,t.texcoordY,10*(Math.random()-.5),30*(Math.random()-.5),n)},xe=t=>{let n=p[0];if(!Z(t.clientX,t.clientY)){c(n),d.current=!1;return}if(!d.current){ue(n,e,X(t.clientX),X(t.clientY),n.color),d.current=!0;return}ye(n,X(t.clientX),X(t.clientY),n.color)},Se=e=>{let t=p[0];for(let n of Array.from(e.targetTouches))if(Z(n.clientX,n.clientY)){ve(t,n.identifier,X(n.clientX),X(n.clientY)),f.current=!0;return}c(t),f.current=!1},Ce=e=>{let t=p[0];for(let n of Array.from(e.targetTouches)){if(!Z(n.clientX,n.clientY)||!f.current){c(t),f.current=!1;return}ye(t,X(n.clientX),X(n.clientY),t.color);return}c(t),f.current=!1},we=()=>{c(p[0]),f.current=!1},Te=0,Ee=Date.now(),Q=0,De=!1,Oe={current:!0},ke=new IntersectionObserver(([e])=>{Oe.current=e.isIntersecting},{threshold:0});e&&ke.observe(e),J(),u.current=p[0];let $=()=>{if(De||(Te=window.requestAnimationFrame($),!Oe.current))return;let e=Date.now(),t=Math.min((e-Ee)/1e3,.016666);Ee=e,Y()&&J(),Q+=t*i.COLOR_UPDATE_SPEED,Q>=1&&(Q%=1,p.forEach(e=>{e.color=r()})),p.forEach(e=>{e.moved&&(e.moved=!1,ge(e.texcoordX,e.texcoordY,e.deltaX*i.SPLAT_FORCE,e.deltaY*i.SPLAT_FORCE,e.color))}),_e(t),h.blendFunc(h.ONE,h.ONE_MINUS_SRC_ALPHA),h.enable(h.BLEND),L.bind(),i.SHADING&&h.uniform2f(L.uniforms.texelSize,1/h.drawingBufferWidth,1/h.drawingBufferHeight),h.uniform1i(L.uniforms.uTexture,H.read.attach(0)),R(null)};return Y(),$(),window.addEventListener(`mousedown`,be),window.addEventListener(`mousemove`,xe),window.addEventListener(`touchstart`,Se,{passive:!0}),window.addEventListener(`touchmove`,Ce,{passive:!0}),window.addEventListener(`touchend`,we),()=>{De=!0,u.current=null,d.current=!1,f.current=!1,ke.disconnect(),window.cancelAnimationFrame(Te),window.removeEventListener(`mousedown`,be),window.removeEventListener(`mousemove`,xe),window.removeEventListener(`touchstart`,Se),window.removeEventListener(`touchmove`,Ce),window.removeEventListener(`touchend`,we)}},[]),(0,i.jsx)(`canvas`,{id:`fluid`,ref:n,className:e})}export{l as default};