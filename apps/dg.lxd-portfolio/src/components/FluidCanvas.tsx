import { useEffect, useRef } from "react";

type FluidCanvasProps = {
  className?: string;
  interactionRegion: HTMLElement | null;
};

type Pointer = {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: { r: number; g: number; b: number };
};

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};

function resetPointerState(pointer: Pointer | null) {
  if (!pointer) return;

  pointer.id = -1;
  pointer.down = false;
  pointer.moved = false;
  pointer.deltaX = 0;
  pointer.deltaY = 0;
}

function syncPointerPosition(
  pointer: Pointer,
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  color?: { r: number; g: number; b: number }
) {
  pointer.texcoordX = x / canvas.width;
  pointer.texcoordY = 1 - y / canvas.height;
  pointer.prevTexcoordX = pointer.texcoordX;
  pointer.prevTexcoordY = pointer.texcoordY;
  pointer.deltaX = 0;
  pointer.deltaY = 0;
  pointer.moved = false;
  if (color) pointer.color = color;
}

export default function FluidCanvas({ className, interactionRegion }: FluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const interactionRegionRef = useRef<HTMLElement | null>(interactionRegion);
  const primaryPointerRef = useRef<Pointer | null>(null);
  const mouseTrackingRef = useRef(false);
  const touchTrackingRef = useRef(false);

  useEffect(() => {
    interactionRegionRef.current = interactionRegion;

    if (!interactionRegion) {
      resetPointerState(primaryPointerRef.current);
      mouseTrackingRef.current = false;
      touchTrackingRef.current = false;
    }
  }, [interactionRegion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const PALETTE = [
      { r: 1.0, g: 0.357, b: 0.133 },
      { r: 0.682, g: 0.902, b: 0.929 },
      { r: 0.22, g: 0.22, b: 1.0 },
      { r: 0.722, g: 0.749, b: 1.0 },
      { r: 0.957, g: 0.953, b: 0.525 },
    ];
    const SCALE = 0.15;
    let palIdx = 0;

    const generateColor = () => {
      const c = PALETTE[palIdx % PALETTE.length];
      palIdx++;
      return { r: c.r * SCALE, g: c.g * SCALE, b: c.b * SCALE };
    };

    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1440,
      DENSITY_DISSIPATION: 0.5,
      VELOCITY_DISSIPATION: 3,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 20,
      CURL: 3,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLOR_UPDATE_SPEED: 10,
    };

    const pointers: Pointer[] = [
      {
        id: -1,
        texcoordX: 0,
        texcoordY: 0,
        prevTexcoordX: 0,
        prevTexcoordY: 0,
        deltaX: 0,
        deltaY: 0,
        down: false,
        moved: false,
        color: { r: 0, g: 0, b: 0 },
      },
    ];

    const CTX_ATTRS: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl: WebGL2RenderingContext | WebGLRenderingContext | null = canvas.getContext(
      "webgl2",
      CTX_ATTRS
    ) as WebGL2RenderingContext | null;

    if (!gl) {
      gl =
        (canvas.getContext("webgl", CTX_ATTRS) as WebGLRenderingContext | null) ||
        (canvas.getContext(
          "experimental-webgl",
          CTX_ATTRS
        ) as WebGLRenderingContext | null);
    }

    if (!gl) return;
    const isWebGL2 = gl instanceof WebGL2RenderingContext;

    let halfFloat:
      | OES_texture_half_float
      | null
      | undefined = undefined;
    let supportLinearFiltering: OES_texture_float_linear | OES_texture_half_float_linear | null =
      null;

    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float");
      supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
    }

    gl.clearColor(0, 0, 0, 1);

    const halfFloatTexType = isWebGL2
      ? (gl as WebGL2RenderingContext).HALF_FLOAT
      : halfFloat!.HALF_FLOAT_OES;

    let formatRGBA: { internalFormat: number; format: number } | null;
    let formatRG: { internalFormat: number; format: number } | null;
    let formatR: { internalFormat: number; format: number } | null;

    const supportRTF = (
      glCtx: WebGLRenderingContext | WebGL2RenderingContext,
      internal: number,
      format: number,
      type: number
    ) => {
      const t = glCtx.createTexture();
      if (!t) return false;
      glCtx.bindTexture(glCtx.TEXTURE_2D, t);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, internal, 4, 4, 0, format, type, null);

      const f = glCtx.createFramebuffer();
      if (!f) return false;
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, f);
      glCtx.framebufferTexture2D(
        glCtx.FRAMEBUFFER,
        glCtx.COLOR_ATTACHMENT0,
        glCtx.TEXTURE_2D,
        t,
        0
      );

      return glCtx.checkFramebufferStatus(glCtx.FRAMEBUFFER) === glCtx.FRAMEBUFFER_COMPLETE;
    };

    const getSupportedFormat = (
      glCtx: WebGLRenderingContext | WebGL2RenderingContext,
      internal: number,
      format: number,
      type: number
    ): { internalFormat: number; format: number } | null => {
      if (!supportRTF(glCtx, internal, format, type)) {
        if ("R16F" in glCtx && internal === (glCtx as WebGL2RenderingContext).R16F) {
          return getSupportedFormat(
            glCtx,
            (glCtx as WebGL2RenderingContext).RG16F,
            (glCtx as WebGL2RenderingContext).RG,
            type
          );
        }
        if ("RG16F" in glCtx && internal === (glCtx as WebGL2RenderingContext).RG16F) {
          return getSupportedFormat(
            glCtx,
            (glCtx as WebGL2RenderingContext).RGBA16F,
            glCtx.RGBA,
            type
          );
        }
        return null;
      }
      return { internalFormat: internal, format };
    };

    if (isWebGL2) {
      const gl2 = gl as WebGL2RenderingContext;
      formatRGBA = getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl2, gl2.R16F, gl2.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    if (!formatRGBA || !formatRG || !formatR) return;

    if (!supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    const baseVertSrc = `
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
      }`;

    const copySrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }`;

    const clearSrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`;

    const splatSrc = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uTarget;
      uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
      void main () {
        vec2 p = vUv - point.xy; p.x *= aspectRatio;
        vec3 splat = exp(-dot(p,p)/radius) * color;
        gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
      }`;

    const advectionSrc = `
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
      }`;

    const divergenceSrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity;
      void main () {
        float L=texture2D(uVelocity,vL).x, R=texture2D(uVelocity,vR).x;
        float T=texture2D(uVelocity,vT).y, B=texture2D(uVelocity,vB).y;
        vec2 C = texture2D(uVelocity,vUv).xy;
        if(vL.x<0.0){L=-C.x;} if(vR.x>1.0){R=-C.x;}
        if(vT.y>1.0){T=-C.y;} if(vB.y<0.0){B=-C.y;}
        gl_FragColor = vec4(0.5*(R-L+T-B),0,0,1);
      }`;

    const curlSrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity;
      void main () {
        float v = texture2D(uVelocity,vR).y - texture2D(uVelocity,vL).y
                - texture2D(uVelocity,vT).x + texture2D(uVelocity,vB).x;
        gl_FragColor = vec4(0.5*v, 0, 0, 1);
      }`;

    const vorticitySrc = `
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
      }`;

    const pressureSrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure, uDivergence;
      void main () {
        float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x;
        float T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x;
        float div = texture2D(uDivergence,vUv).x;
        gl_FragColor = vec4((L+R+B+T-div)*0.25, 0, 0, 1);
      }`;

    const gradSubSrc = `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure, uVelocity;
      void main () {
        float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x;
        float T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x;
        vec2 vel = texture2D(uVelocity,vUv).xy - vec2(R-L, T-B);
        gl_FragColor = vec4(vel, 0, 1);
      }`;

    const displaySrc = `
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
      }`;

    const compile = (type: number, src: string, keywords?: string[] | null) => {
      const shader = gl!.createShader(type);
      if (!shader) return null;

      const source =
        (keywords || []).map((k) => `#define ${k}\n`).join("") + src;

      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return shader;
    };

    const link = (vSrc: string, fSrc: string, keywords?: string[] | null) => {
      const prog = gl!.createProgram();
      if (!prog) return null;

      const vShader = compile(gl!.VERTEX_SHADER, vSrc);
      const fShader = compile(gl!.FRAGMENT_SHADER, fSrc, keywords);
      if (!vShader || !fShader) return null;

      gl!.attachShader(prog, vShader);
      gl!.attachShader(prog, fShader);
      gl!.linkProgram(prog);
      return prog;
    };

    const getUniforms = (prog: WebGLProgram) => {
      const u: Record<string, WebGLUniformLocation | null> = {};
      const count = gl!.getProgramParameter(prog, gl!.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const active = gl!.getActiveUniform(prog, i);
        if (!active) continue;
        u[active.name] = gl!.getUniformLocation(prog, active.name);
      }
      return u;
    };

    type ProgramRef = {
      uniforms: Record<string, WebGLUniformLocation | null>;
      bind: () => void;
    };

    type MaterialRef = ProgramRef & {
      setKeywords: (kw: string[]) => void;
    };

    const createProgram = (vSrc: string, fSrc: string, kw?: string[] | null): ProgramRef => {
      const program = link(vSrc, fSrc, kw);
      if (!program) throw new Error("Failed to create shader program");
      const uniforms = getUniforms(program);
      return {
        uniforms,
        bind: () => gl!.useProgram(program),
      };
    };

    const createMaterial = (vSrc: string, fSrc: string): MaterialRef => {
      const cache: Record<
        string,
        { program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null> }
      > = {};
      let currentProgram: WebGLProgram | null = null;
      let currentUniforms: Record<string, WebGLUniformLocation | null> = {};

      return {
        get uniforms() {
          return currentUniforms;
        },
        bind: () => {
          if (currentProgram) gl!.useProgram(currentProgram);
        },
        setKeywords: (kw: string[]) => {
          const key = kw.slice().sort().join(",");
          if (!cache[key]) {
            const program = link(vSrc, fSrc, kw);
            if (!program) throw new Error("Failed to create material program");
            cache[key] = { program, uniforms: getUniforms(program) };
          }

          const entry = cache[key];
          if (entry.program !== currentProgram) {
            currentProgram = entry.program;
            currentUniforms = entry.uniforms;
          }
        },
      };
    };

    const copyProg = createProgram(baseVertSrc, copySrc);
    const clearProg = createProgram(baseVertSrc, clearSrc);
    const splatProg = createProgram(baseVertSrc, splatSrc);
    const advProg = createProgram(
      baseVertSrc,
      advectionSrc,
      supportLinearFiltering ? null : ["MANUAL_FILTERING"]
    );
    const divProg = createProgram(baseVertSrc, divergenceSrc);
    const curlProg = createProgram(baseVertSrc, curlSrc);
    const vortProg = createProgram(baseVertSrc, vorticitySrc);
    const presProg = createProgram(baseVertSrc, pressureSrc);
    const gradProg = createProgram(baseVertSrc, gradSubSrc);
    const dispMat = createMaterial(baseVertSrc, displaySrc);
    dispMat.setKeywords(config.SHADING ? ["SHADING"] : []);

    const vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );

    const ib = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW
    );

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (fbo: FBO | null, clear?: boolean) => {
      if (!fbo) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, fbo.width, fbo.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
      }

      if (clear) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    const mkFBO = (
      w: number,
      h: number,
      internal: number,
      format: number,
      type: number,
      filter: number
    ): FBO => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);

      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    };

    const mkDoubleFBO = (
      w: number,
      h: number,
      internal: number,
      format: number,
      type: number,
      filter: number
    ): DoubleFBO => {
      let read = mkFBO(w, h, internal, format, type, filter);
      let write = mkFBO(w, h, internal, format, type, filter);

      return {
        width: w,
        height: h,
        texelSizeX: read.texelSizeX,
        texelSizeY: read.texelSizeY,
        get read() {
          return read;
        },
        set read(value: FBO) {
          read = value;
        },
        get write() {
          return write;
        },
        set write(value: FBO) {
          write = value;
        },
        swap() {
          const temp = read;
          read = write;
          write = temp;
        },
      };
    };

    const resizeDoubleFBO = (
      fbo: DoubleFBO,
      w: number,
      h: number,
      internal: number,
      format: number,
      type: number,
      filter: number
    ) => {
      if (fbo.width === w && fbo.height === h) return fbo;

      const newRead = mkFBO(w, h, internal, format, type, filter);
      copyProg.bind();
      gl.uniform1i(copyProg.uniforms.uTexture, fbo.read.attach(0));
      blit(newRead);

      fbo.read = newRead;
      fbo.write = mkFBO(w, h, internal, format, type, filter);
      fbo.width = w;
      fbo.height = h;
      fbo.texelSizeX = 1 / w;
      fbo.texelSizeY = 1 / h;

      return fbo;
    };

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curlFBO: FBO;
    let pressure: DoubleFBO;

    const getResolution = (res: number) => {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
      const min = Math.round(res);
      const max = Math.round(res * aspectRatio);
      return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    };

    const initFBOs = () => {
      const sr = getResolution(config.SIM_RESOLUTION);
      const dr = getResolution(config.DYE_RESOLUTION);
      const tt = halfFloatTexType;
      const fl = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

      gl.disable(gl.BLEND);

      dye = dye
        ? resizeDoubleFBO(
            dye,
            dr.width,
            dr.height,
            formatRGBA!.internalFormat,
            formatRGBA!.format,
            tt,
            fl
          )
        : mkDoubleFBO(
            dr.width,
            dr.height,
            formatRGBA!.internalFormat,
            formatRGBA!.format,
            tt,
            fl
          );

      velocity = velocity
        ? resizeDoubleFBO(
            velocity,
            sr.width,
            sr.height,
            formatRG!.internalFormat,
            formatRG!.format,
            tt,
            fl
          )
        : mkDoubleFBO(
            sr.width,
            sr.height,
            formatRG!.internalFormat,
            formatRG!.format,
            tt,
            fl
          );

      divergence = mkFBO(
        sr.width,
        sr.height,
        formatR!.internalFormat,
        formatR!.format,
        tt,
        gl.NEAREST
      );

      curlFBO = mkFBO(
        sr.width,
        sr.height,
        formatR!.internalFormat,
        formatR!.format,
        tt,
        gl.NEAREST
      );

      pressure = mkDoubleFBO(
        sr.width,
        sr.height,
        formatR!.internalFormat,
        formatR!.format,
        tt,
        gl.NEAREST
      );
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    };

    const correctRadius = (r: number) => {
      const ar = canvas.width / canvas.height;
      if (ar > 1) r *= ar;
      return r;
    };

    const splat = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      color: { r: number; g: number; b: number }
    ) => {
      splatProg.bind();
      gl.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProg.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProg.uniforms.point, x, y);
      gl.uniform3f(splatProg.uniforms.color, dx, dy, 0);
      gl.uniform1f(splatProg.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProg.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    };

    const step = (dt: number) => {
      gl.disable(gl.BLEND);

      curlProg.bind();
      gl.uniform2f(curlProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      vortProg.bind();
      gl.uniform2f(vortProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vortProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vortProg.uniforms.uCurl, curlFBO.attach(1));
      gl.uniform1f(vortProg.uniforms.curl, config.CURL);
      gl.uniform1f(vortProg.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divProg.bind();
      gl.uniform2f(divProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProg.bind();
      gl.uniform1i(clearProg.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProg.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      presProg.bind();
      gl.uniform2f(presProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(presProg.uniforms.uDivergence, divergence.attach(0));

      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(presProg.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradProg.bind();
      gl.uniform2f(gradProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradProg.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradProg.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advProg.bind();
      gl.uniform2f(advProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!supportLinearFiltering) {
        gl.uniform2f(advProg.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }

      const velocityId = velocity.read.attach(0);
      gl.uniform1i(advProg.uniforms.uVelocity, velocityId);
      gl.uniform1i(advProg.uniforms.uSource, velocityId);
      gl.uniform1f(advProg.uniforms.dt, dt);
      gl.uniform1f(advProg.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!supportLinearFiltering) {
        gl.uniform2f(advProg.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }

      gl.uniform1i(advProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advProg.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advProg.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    };

    const dprValue = (v: number) => Math.floor(v * (window.devicePixelRatio || 1));
    const isInsideInteractionRegion = (clientX: number, clientY: number) => {
      const region = interactionRegionRef.current;

      if (!region) {
        return false;
      }

      const bounds = region.getBoundingClientRect();

      return (
        clientX >= bounds.left &&
        clientX <= bounds.right &&
        clientY >= bounds.top &&
        clientY <= bounds.bottom
      );
    };

    const pDown = (p: Pointer, id: number, x: number, y: number) => {
      p.id = id;
      p.down = true;
      p.moved = false;
      p.texcoordX = x / canvas.width;
      p.texcoordY = 1 - y / canvas.height;
      p.prevTexcoordX = p.texcoordX;
      p.prevTexcoordY = p.texcoordY;
      p.deltaX = 0;
      p.deltaY = 0;
      p.color = generateColor();
    };

    const pMove = (p: Pointer, x: number, y: number, color?: { r: number; g: number; b: number }) => {
      const ar = canvas.width / canvas.height;
      p.prevTexcoordX = p.texcoordX;
      p.prevTexcoordY = p.texcoordY;
      p.texcoordX = x / canvas.width;
      p.texcoordY = 1 - y / canvas.height;
      p.deltaX = (p.texcoordX - p.prevTexcoordX) * (ar < 1 ? ar : 1);
      p.deltaY = (p.texcoordY - p.prevTexcoordY) / (ar > 1 ? ar : 1);
      p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0;
      if (color) p.color = color;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const p = pointers[0];

      if (!isInsideInteractionRegion(e.clientX, e.clientY)) {
        resetPointerState(p);
        mouseTrackingRef.current = false;
        return;
      }

      pDown(p, -1, dprValue(e.clientX), dprValue(e.clientY));
      mouseTrackingRef.current = true;
      const burst = generateColor();
      burst.r *= 10;
      burst.g *= 10;
      burst.b *= 10;
      splat(p.texcoordX, p.texcoordY, 10 * (Math.random() - 0.5), 30 * (Math.random() - 0.5), burst);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const p = pointers[0];

      if (!isInsideInteractionRegion(e.clientX, e.clientY)) {
        resetPointerState(p);
        mouseTrackingRef.current = false;
        return;
      }

      if (!mouseTrackingRef.current) {
        syncPointerPosition(p, canvas, dprValue(e.clientX), dprValue(e.clientY), p.color);
        mouseTrackingRef.current = true;
        return;
      }

      pMove(p, dprValue(e.clientX), dprValue(e.clientY), p.color);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const p = pointers[0];

      for (const t of Array.from(e.targetTouches)) {
        if (!isInsideInteractionRegion(t.clientX, t.clientY)) {
          continue;
        }

        pDown(p, t.identifier, dprValue(t.clientX), dprValue(t.clientY));
        touchTrackingRef.current = true;
        return;
      }

      resetPointerState(p);
      touchTrackingRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const p = pointers[0];

      for (const t of Array.from(e.targetTouches)) {
        if (!isInsideInteractionRegion(t.clientX, t.clientY) || !touchTrackingRef.current) {
          resetPointerState(p);
          touchTrackingRef.current = false;
          return;
        }

        pMove(p, dprValue(t.clientX), dprValue(t.clientY), p.color);
        return;
      }

      resetPointerState(p);
      touchTrackingRef.current = false;
    };

    const handleTouchEnd = () => {
      resetPointerState(pointers[0]);
      touchTrackingRef.current = false;
    };

    let animationFrame = 0;
    let lastTime = Date.now();
    let colorTimer = 0;
    let disposed = false;

    initFBOs();
    primaryPointerRef.current = pointers[0];

    const render = () => {
      if (disposed) return;

      animationFrame = window.requestAnimationFrame(render);

      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime = now;

      if (resizeCanvas()) initFBOs();

      colorTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorTimer >= 1) {
        colorTimer %= 1;
        pointers.forEach((p) => {
          p.color = generateColor();
        });
      }

      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          splat(
            p.texcoordX,
            p.texcoordY,
            p.deltaX * config.SPLAT_FORCE,
            p.deltaY * config.SPLAT_FORCE,
            p.color
          );
        }
      });

      step(dt);

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      dispMat.bind();

      if (config.SHADING) {
        gl.uniform2f(dispMat.uniforms.texelSize, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
      }

      gl.uniform1i(dispMat.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    };

    resizeCanvas();
    render();

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      disposed = true;
      primaryPointerRef.current = null;
      mouseTrackingRef.current = false;
      touchTrackingRef.current = false;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return <canvas id="fluid" ref={canvasRef} className={className} />;
}
