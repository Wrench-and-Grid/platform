import{a as e}from"./rolldown-runtime-BYbx6iT9.js";import{i as t,r as n}from"./vendor-motion-CKFPyit_.js";var r=e(t(),1),i=n();function a(e){e&&(e.id=-1,e.down=!1,e.moved=!1,e.deltaX=0,e.deltaY=0)}function o(e,t,n,r,i){e.texcoordX=n/t.width,e.texcoordY=1-r/t.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.moved=!1,i&&(e.color=i)}function s({className:e,interactionRegion:t}){let n=(0,r.useRef)(null),s=(0,r.useRef)(t),c=(0,r.useRef)(null),l=(0,r.useRef)(!1),u=(0,r.useRef)(!1);return(0,r.useEffect)(()=>{s.current=t,t||(a(c.current),l.current=!1,u.current=!1)},[t]),(0,r.useEffect)(()=>{let e=n.current;if(!e)return;let t=[{r:1,g:.357,b:.133},{r:.682,g:.902,b:.929},{r:.22,g:.22,b:1},{r:.722,g:.749,b:1},{r:.957,g:.953,b:.525}],r=.15,i=0,d=()=>{let e=t[i%t.length];return i++,{r:e.r*r,g:e.g*r,b:e.b*r}},f={SIM_RESOLUTION:128,DYE_RESOLUTION:1440,DENSITY_DISSIPATION:.5,VELOCITY_DISSIPATION:3,PRESSURE:.1,PRESSURE_ITERATIONS:20,CURL:3,SPLAT_RADIUS:.2,SPLAT_FORCE:6e3,SHADING:!0,COLOR_UPDATE_SPEED:10},p=[{id:-1,texcoordX:0,texcoordY:0,prevTexcoordX:0,prevTexcoordY:0,deltaX:0,deltaY:0,down:!1,moved:!1,color:{r:0,g:0,b:0}}],m={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1},h=e.getContext(`webgl2`,m);if(h||=e.getContext(`webgl`,m)||e.getContext(`experimental-webgl`,m),!h)return;let g=h instanceof WebGL2RenderingContext,ee,_=null;g?(h.getExtension(`EXT_color_buffer_float`),_=h.getExtension(`OES_texture_float_linear`)):(ee=h.getExtension(`OES_texture_half_float`),_=h.getExtension(`OES_texture_half_float_linear`)),h.clearColor(0,0,0,1);let v=g?h.HALF_FLOAT:ee.HALF_FLOAT_OES,y,b,x,te=(e,t,n,r)=>{let i=e.createTexture();if(!i)return!1;e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,t,4,4,0,n,r,null);let a=e.createFramebuffer();return a?(e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE):!1},S=(e,t,n,r)=>te(e,t,n,r)?{internalFormat:t,format:n}:`R16F`in e&&t===e.R16F?S(e,e.RG16F,e.RG,r):`RG16F`in e&&t===e.RG16F?S(e,e.RGBA16F,e.RGBA,r):null;if(g){let e=h;y=S(e,e.RGBA16F,e.RGBA,v),b=S(e,e.RG16F,e.RG,v),x=S(e,e.R16F,e.RED,v)}else y=S(h,h.RGBA,h.RGBA,v),b=S(h,h.RGBA,h.RGBA,v),x=S(h,h.RGBA,h.RGBA,v);if(!y||!b||!x)return;_||(f.DYE_RESOLUTION=256,f.SHADING=!1);let C=`
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
      }`,w=(e,t,n)=>{let r=h.createShader(e);if(!r)return null;let i=(n||[]).map(e=>`#define ${e}\n`).join(``)+t;return h.shaderSource(r,i),h.compileShader(r),r},T=(e,t,n)=>{let r=h.createProgram();if(!r)return null;let i=w(h.VERTEX_SHADER,e),a=w(h.FRAGMENT_SHADER,t,n);return!i||!a?null:(h.attachShader(r,i),h.attachShader(r,a),h.linkProgram(r),r)},E=e=>{let t={},n=h.getProgramParameter(e,h.ACTIVE_UNIFORMS);for(let r=0;r<n;r++){let n=h.getActiveUniform(e,r);n&&(t[n.name]=h.getUniformLocation(e,n.name))}return t},D=(e,t,n)=>{let r=T(e,t,n);if(!r)throw Error(`Failed to create shader program`);return{uniforms:E(r),bind:()=>h.useProgram(r)}},ne=(e,t)=>{let n={},r=null,i={};return{get uniforms(){return i},bind:()=>{r&&h.useProgram(r)},setKeywords:a=>{let o=a.slice().sort().join(`,`);if(!n[o]){let r=T(e,t,a);if(!r)throw Error(`Failed to create material program`);n[o]={program:r,uniforms:E(r)}}let s=n[o];s.program!==r&&(r=s.program,i=s.uniforms)}}},re=D(C,`
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }`),O=D(C,`
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`),k=D(C,`
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uTarget;
      uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
      void main () {
        vec2 p = vUv - point.xy; p.x *= aspectRatio;
        vec3 splat = exp(-dot(p,p)/radius) * color;
        gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
      }`),A=D(C,`
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
      }`,_?null:[`MANUAL_FILTERING`]),j=D(C,`
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity;
      void main () {
        float L=texture2D(uVelocity,vL).x, R=texture2D(uVelocity,vR).x;
        float T=texture2D(uVelocity,vT).y, B=texture2D(uVelocity,vB).y;
        vec2 C = texture2D(uVelocity,vUv).xy;
        if(vL.x<0.0){L=-C.x;} if(vR.x>1.0){R=-C.x;}
        if(vT.y>1.0){T=-C.y;} if(vB.y<0.0){B=-C.y;}
        gl_FragColor = vec4(0.5*(R-L+T-B),0,0,1);
      }`),M=D(C,`
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity;
      void main () {
        float v = texture2D(uVelocity,vR).y - texture2D(uVelocity,vL).y
                - texture2D(uVelocity,vT).x + texture2D(uVelocity,vB).x;
        gl_FragColor = vec4(0.5*v, 0, 0, 1);
      }`),N=D(C,`
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
      }`),P=D(C,`
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure, uDivergence;
      void main () {
        float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x;
        float T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x;
        float div = texture2D(uDivergence,vUv).x;
        gl_FragColor = vec4((L+R+B+T-div)*0.25, 0, 0, 1);
      }`),F=D(C,`
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure, uVelocity;
      void main () {
        float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x;
        float T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x;
        vec2 vel = texture2D(uVelocity,vUv).xy - vec2(R-L, T-B);
        gl_FragColor = vec4(vel, 0, 1);
      }`),I=ne(C,`
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
      }`);I.setKeywords(f.SHADING?[`SHADING`]:[]);let ie=h.createBuffer();h.bindBuffer(h.ARRAY_BUFFER,ie),h.bufferData(h.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),h.STATIC_DRAW);let ae=h.createBuffer();h.bindBuffer(h.ELEMENT_ARRAY_BUFFER,ae),h.bufferData(h.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),h.STATIC_DRAW),h.vertexAttribPointer(0,2,h.FLOAT,!1,0,0),h.enableVertexAttribArray(0);let L=(e,t)=>{e?(h.viewport(0,0,e.width,e.height),h.bindFramebuffer(h.FRAMEBUFFER,e.fbo)):(h.viewport(0,0,h.drawingBufferWidth,h.drawingBufferHeight),h.bindFramebuffer(h.FRAMEBUFFER,null)),t&&(h.clearColor(0,0,0,1),h.clear(h.COLOR_BUFFER_BIT)),h.drawElements(h.TRIANGLES,6,h.UNSIGNED_SHORT,0)},R=(e,t,n,r,i,a)=>{h.activeTexture(h.TEXTURE0);let o=h.createTexture();h.bindTexture(h.TEXTURE_2D,o),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MIN_FILTER,a),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MAG_FILTER,a),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_S,h.CLAMP_TO_EDGE),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_T,h.CLAMP_TO_EDGE),h.texImage2D(h.TEXTURE_2D,0,n,e,t,0,r,i,null);let s=h.createFramebuffer();return h.bindFramebuffer(h.FRAMEBUFFER,s),h.framebufferTexture2D(h.FRAMEBUFFER,h.COLOR_ATTACHMENT0,h.TEXTURE_2D,o,0),h.viewport(0,0,e,t),h.clear(h.COLOR_BUFFER_BIT),{texture:o,fbo:s,width:e,height:t,texelSizeX:1/e,texelSizeY:1/t,attach(e){return h.activeTexture(h.TEXTURE0+e),h.bindTexture(h.TEXTURE_2D,o),e}}},z=(e,t,n,r,i,a)=>{let o=R(e,t,n,r,i,a),s=R(e,t,n,r,i,a);return{width:e,height:t,texelSizeX:o.texelSizeX,texelSizeY:o.texelSizeY,get read(){return o},set read(e){o=e},get write(){return s},set write(e){s=e},swap(){let e=o;o=s,s=e}}},B=(e,t,n,r,i,a,o)=>{if(e.width===t&&e.height===n)return e;let s=R(t,n,r,i,a,o);return re.bind(),h.uniform1i(re.uniforms.uTexture,e.read.attach(0)),L(s),e.read=s,e.write=R(t,n,r,i,a,o),e.width=t,e.height=n,e.texelSizeX=1/t,e.texelSizeY=1/n,e},V,H,U,W,G,K=e=>{let t=h.drawingBufferWidth/h.drawingBufferHeight;t<1&&(t=1/t);let n=Math.round(e),r=Math.round(e*t);return h.drawingBufferWidth>h.drawingBufferHeight?{width:r,height:n}:{width:n,height:r}},q=()=>{let e=K(f.SIM_RESOLUTION),t=K(f.DYE_RESOLUTION),n=v,r=_?h.LINEAR:h.NEAREST;h.disable(h.BLEND),V=V?B(V,t.width,t.height,y.internalFormat,y.format,n,r):z(t.width,t.height,y.internalFormat,y.format,n,r),H=H?B(H,e.width,e.height,b.internalFormat,b.format,n,r):z(e.width,e.height,b.internalFormat,b.format,n,r),U=R(e.width,e.height,x.internalFormat,x.format,n,h.NEAREST),W=R(e.width,e.height,x.internalFormat,x.format,n,h.NEAREST),G=z(e.width,e.height,x.internalFormat,x.format,n,h.NEAREST)},J=()=>{let t=window.devicePixelRatio||1,n=Math.floor(e.clientWidth*t),r=Math.floor(e.clientHeight*t);return e.width!==n||e.height!==r?(e.width=n,e.height=r,!0):!1},oe=t=>{let n=e.width/e.height;return n>1&&(t*=n),t},Y=(t,n,r,i,a)=>{k.bind(),h.uniform1i(k.uniforms.uTarget,H.read.attach(0)),h.uniform1f(k.uniforms.aspectRatio,e.width/e.height),h.uniform2f(k.uniforms.point,t,n),h.uniform3f(k.uniforms.color,r,i,0),h.uniform1f(k.uniforms.radius,oe(f.SPLAT_RADIUS/100)),L(H.write),H.swap(),h.uniform1i(k.uniforms.uTarget,V.read.attach(0)),h.uniform3f(k.uniforms.color,a.r,a.g,a.b),L(V.write),V.swap()},se=e=>{h.disable(h.BLEND),M.bind(),h.uniform2f(M.uniforms.texelSize,H.texelSizeX,H.texelSizeY),h.uniform1i(M.uniforms.uVelocity,H.read.attach(0)),L(W),N.bind(),h.uniform2f(N.uniforms.texelSize,H.texelSizeX,H.texelSizeY),h.uniform1i(N.uniforms.uVelocity,H.read.attach(0)),h.uniform1i(N.uniforms.uCurl,W.attach(1)),h.uniform1f(N.uniforms.curl,f.CURL),h.uniform1f(N.uniforms.dt,e),L(H.write),H.swap(),j.bind(),h.uniform2f(j.uniforms.texelSize,H.texelSizeX,H.texelSizeY),h.uniform1i(j.uniforms.uVelocity,H.read.attach(0)),L(U),O.bind(),h.uniform1i(O.uniforms.uTexture,G.read.attach(0)),h.uniform1f(O.uniforms.value,f.PRESSURE),L(G.write),G.swap(),P.bind(),h.uniform2f(P.uniforms.texelSize,H.texelSizeX,H.texelSizeY),h.uniform1i(P.uniforms.uDivergence,U.attach(0));for(let e=0;e<f.PRESSURE_ITERATIONS;e++)h.uniform1i(P.uniforms.uPressure,G.read.attach(1)),L(G.write),G.swap();F.bind(),h.uniform2f(F.uniforms.texelSize,H.texelSizeX,H.texelSizeY),h.uniform1i(F.uniforms.uPressure,G.read.attach(0)),h.uniform1i(F.uniforms.uVelocity,H.read.attach(1)),L(H.write),H.swap(),A.bind(),h.uniform2f(A.uniforms.texelSize,H.texelSizeX,H.texelSizeY),_||h.uniform2f(A.uniforms.dyeTexelSize,H.texelSizeX,H.texelSizeY);let t=H.read.attach(0);h.uniform1i(A.uniforms.uVelocity,t),h.uniform1i(A.uniforms.uSource,t),h.uniform1f(A.uniforms.dt,e),h.uniform1f(A.uniforms.dissipation,f.VELOCITY_DISSIPATION),L(H.write),H.swap(),_||h.uniform2f(A.uniforms.dyeTexelSize,V.texelSizeX,V.texelSizeY),h.uniform1i(A.uniforms.uVelocity,H.read.attach(0)),h.uniform1i(A.uniforms.uSource,V.read.attach(1)),h.uniform1f(A.uniforms.dissipation,f.DENSITY_DISSIPATION),L(V.write),V.swap()},X=e=>Math.floor(e*(window.devicePixelRatio||1)),Z=(e,t)=>{let n=s.current;if(!n)return!1;let r=n.getBoundingClientRect();return e>=r.left&&e<=r.right&&t>=r.top&&t<=r.bottom},ce=(t,n,r,i)=>{t.id=n,t.down=!0,t.moved=!1,t.texcoordX=r/e.width,t.texcoordY=1-i/e.height,t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.deltaX=0,t.deltaY=0,t.color=d()},le=(t,n,r,i)=>{let a=e.width/e.height;t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.texcoordX=n/e.width,t.texcoordY=1-r/e.height,t.deltaX=(t.texcoordX-t.prevTexcoordX)*(a<1?a:1),t.deltaY=(t.texcoordY-t.prevTexcoordY)/(a>1?a:1),t.moved=Math.abs(t.deltaX)>0||Math.abs(t.deltaY)>0,i&&(t.color=i)},ue=e=>{let t=p[0];if(!Z(e.clientX,e.clientY)){a(t),l.current=!1;return}ce(t,-1,X(e.clientX),X(e.clientY)),l.current=!0;let n=d();n.r*=10,n.g*=10,n.b*=10,Y(t.texcoordX,t.texcoordY,10*(Math.random()-.5),30*(Math.random()-.5),n)},de=t=>{let n=p[0];if(!Z(t.clientX,t.clientY)){a(n),l.current=!1;return}if(!l.current){o(n,e,X(t.clientX),X(t.clientY),n.color),l.current=!0;return}le(n,X(t.clientX),X(t.clientY),n.color)},fe=e=>{let t=p[0];for(let n of Array.from(e.targetTouches))if(Z(n.clientX,n.clientY)){ce(t,n.identifier,X(n.clientX),X(n.clientY)),u.current=!0;return}a(t),u.current=!1},pe=e=>{let t=p[0];for(let n of Array.from(e.targetTouches)){if(!Z(n.clientX,n.clientY)||!u.current){a(t),u.current=!1;return}le(t,X(n.clientX),X(n.clientY),t.color);return}a(t),u.current=!1},Q=()=>{a(p[0]),u.current=!1},me=0,he=Date.now(),$=0,ge=!1,_e={current:!0},ve=new IntersectionObserver(([e])=>{_e.current=e.isIntersecting},{threshold:0});e&&ve.observe(e),q(),c.current=p[0];let ye=()=>{if(ge||(me=window.requestAnimationFrame(ye),!_e.current))return;let e=Date.now(),t=Math.min((e-he)/1e3,.016666);he=e,J()&&q(),$+=t*f.COLOR_UPDATE_SPEED,$>=1&&($%=1,p.forEach(e=>{e.color=d()})),p.forEach(e=>{e.moved&&(e.moved=!1,Y(e.texcoordX,e.texcoordY,e.deltaX*f.SPLAT_FORCE,e.deltaY*f.SPLAT_FORCE,e.color))}),se(t),h.blendFunc(h.ONE,h.ONE_MINUS_SRC_ALPHA),h.enable(h.BLEND),I.bind(),f.SHADING&&h.uniform2f(I.uniforms.texelSize,1/h.drawingBufferWidth,1/h.drawingBufferHeight),h.uniform1i(I.uniforms.uTexture,V.read.attach(0)),L(null)};return J(),ye(),window.addEventListener(`mousedown`,ue),window.addEventListener(`mousemove`,de),window.addEventListener(`touchstart`,fe,{passive:!0}),window.addEventListener(`touchmove`,pe,{passive:!0}),window.addEventListener(`touchend`,Q),()=>{ge=!0,c.current=null,l.current=!1,u.current=!1,ve.disconnect(),window.cancelAnimationFrame(me),window.removeEventListener(`mousedown`,ue),window.removeEventListener(`mousemove`,de),window.removeEventListener(`touchstart`,fe),window.removeEventListener(`touchmove`,pe),window.removeEventListener(`touchend`,Q)}},[]),(0,i.jsx)(`canvas`,{id:`fluid`,ref:n,className:e})}export{s as default};