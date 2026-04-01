declare module 'ogl' {
  export class Renderer {
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    dpr: number;

    constructor(options?: RendererOptions);
    setSize(width: number, height: number): void;
    render(options: { scene: Transform; camera: Camera }): void;
  }

  export interface RendererOptions {
    alpha?: boolean;
    antialias?: boolean;
    dpr?: number;
  }

  export class Camera {
    fov: number;
    position: Vec3;
    near?: number;
    far?: number;
    aspect?: number;

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext);
    perspective(options?: { aspect?: number; near?: number; far?: number; fov?: number }): void;
  }

  export class Transform {
    position: Vec3;
    rotation: Vec3;
    scale: Vec3;
    matrix: Mat4;

    setParent(parent: Transform): void;
  }

  export class Mesh extends Transform {
    geometry: Geometry;
    program: Program;

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, options: MeshOptions);
    setParent(parent: Transform | Mesh): void;
  }

  export interface MeshOptions {
    geometry: Geometry;
    program: Program;
  }

  export class Program {
    uniforms: Record<string, { value: any }>;

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, options: ProgramOptions);
  }

  export interface ProgramOptions {
    vertex?: string;
    fragment?: string;
    uniforms?: Record<string, { value: any }>;
    transparent?: boolean;
    depthTest?: boolean;
    depthWrite?: boolean;
  }

  export class Geometry {
    attributes: Record<string, any>;
  }

  export class Plane extends Geometry {
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, options?: PlaneOptions);
  }

  export interface PlaneOptions {
    width?: number;
    height?: number;
    widthSegments?: number;
    heightSegments?: number;
  }

  export class Texture {
    image?: TexImageSource;

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, options?: TextureOptions);
  }

  export interface TextureOptions {
    generateMipmaps?: boolean;
  }

  export interface Vec3 {
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): void;
  }

  export interface Mat4 {
    [key: number]: number;
  }
}
