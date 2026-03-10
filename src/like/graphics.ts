type DrawMode = 'fill' | 'line';

interface ImageData {
  element: HTMLImageElement;
  width: number;
  height: number;
}

export class Graphics {
  private ctx: CanvasRenderingContext2D | null = null;
  private currentColor = { r: 1, g: 1, b: 1, a: 1 };
  private backgroundColor = { r: 0, g: 0, b: 0, a: 1 };
  private images = new Map<string, ImageData>();

  setContext(ctx: CanvasRenderingContext2D | null): void {
    this.ctx = ctx;
  }

  clear(): void {
    if (!this.ctx) return;
    const { r, g, b, a } = this.backgroundColor;
    this.ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  setBackgroundColor(r: number, g: number, b: number, a: number = 1): void {
    this.backgroundColor = { r, g, b, a };
    this.clear();
  }

  setColor(r: number, g: number, b: number, a: number = 1): void {
    this.currentColor = { r, g, b, a };
    if (this.ctx) {
      this.ctx.fillStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
      this.ctx.strokeStyle = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
    }
  }

  getColor(): { r: number; g: number; b: number; a: number } {
    return { ...this.currentColor };
  }

  rectangle(mode: DrawMode, x: number, y: number, width: number, height: number): void {
    if (!this.ctx) return;
    
    if (mode === 'fill') {
      this.ctx.fillRect(x, y, width, height);
    } else {
      this.ctx.strokeRect(x, y, width, height);
    }
  }

  circle(mode: DrawMode, x: number, y: number, radius: number): void {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    
    if (mode === 'fill') {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  line(x1: number, y1: number, x2: number, y2: number, ...points: number[]): void {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    
    // Handle additional points (x3, y3, x4, y4, ...)
    for (let i = 0; i < points.length; i += 2) {
      if (i + 1 < points.length) {
        this.ctx.lineTo(points[i], points[i + 1]);
      }
    }
    
    this.ctx.stroke();
  }

  print(text: string, x: number, y: number): void {
    if (!this.ctx) return;
    
    this.ctx.fillText(text, x, y);
  }

  printf(text: string, x: number, y: number, limit: number, align: 'left' | 'center' | 'right' = 'left'): void {
    if (!this.ctx) return;
    
    const lines = this.wrapText(text, limit);
    const lineHeight = this.getFontHeight();
    
    lines.forEach((line, index) => {
      let drawX = x;
      const lineWidth = this.ctx!.measureText(line).width;
      
      if (align === 'center') {
        drawX = x + (limit - lineWidth) / 2;
      } else if (align === 'right') {
        drawX = x + limit - lineWidth;
      }
      
      this.ctx!.fillText(line, drawX, y + index * lineHeight);
    });
  }

  private wrapText(text: string, maxWidth: number): string[] {
    if (!this.ctx) return [text];
    
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = this.ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  private getFontHeight(): number {
    if (!this.ctx) return 16;
    const match = this.ctx.font.match(/(\d+)px/);
    return match ? parseInt(match[1]) : 16;
  }

  setFont(size: number, font: string = 'sans-serif'): void {
    if (!this.ctx) return;
    this.ctx.font = `${size}px ${font}`;
  }

  getFont(): string {
    if (!this.ctx) return '16px sans-serif';
    return this.ctx.font;
  }

  newImage(path: string): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const imageData: ImageData = {
          element: img,
          width: img.width,
          height: img.height
        };
        this.images.set(path, imageData);
        resolve(imageData);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
      img.src = path;
    });
  }

  draw(
    drawable: ImageData | string,
    x: number,
    y: number,
    r: number = 0,
    sx: number = 1,
    sy: number = sx,
    ox: number = 0,
    oy: number = 0
  ): void {
    if (!this.ctx) return;
    
    let imageData: ImageData | undefined;
    
    if (typeof drawable === 'string') {
      imageData = this.images.get(drawable);
      if (!imageData) {
        console.warn(`Image not found: ${drawable}`);
        return;
      }
    } else {
      imageData = drawable;
    }
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(r);
    this.ctx.scale(sx, sy);
    this.ctx.drawImage(imageData.element, -ox, -oy);
    this.ctx.restore();
  }

  drawq(
    image: ImageData | string,
    quad: { x: number; y: number; width: number; height: number },
    x: number,
    y: number,
    r: number = 0,
    sx: number = 1,
    sy: number = sx,
    ox: number = 0,
    oy: number = 0
  ): void {
    if (!this.ctx) return;
    
    let imageData: ImageData | undefined;
    
    if (typeof image === 'string') {
      imageData = this.images.get(image);
      if (!imageData) {
        console.warn(`Image not found: ${image}`);
        return;
      }
    } else {
      imageData = image;
    }
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(r);
    this.ctx.scale(sx, sy);
    this.ctx.drawImage(
      imageData.element,
      quad.x,
      quad.y,
      quad.width,
      quad.height,
      -ox,
      -oy,
      quad.width,
      quad.height
    );
    this.ctx.restore();
  }

  push(): void {
    if (!this.ctx) return;
    this.ctx.save();
  }

  pop(): void {
    if (!this.ctx) return;
    this.ctx.restore();
  }

  translate(x: number, y: number): void {
    if (!this.ctx) return;
    this.ctx.translate(x, y);
  }

  rotate(angle: number): void {
    if (!this.ctx) return;
    this.ctx.rotate(angle);
  }

  scale(x: number, y: number = x): void {
    if (!this.ctx) return;
    this.ctx.scale(x, y);
  }

  getWidth(): number {
    return this.ctx?.canvas.width ?? 800;
  }

  getHeight(): number {
    return this.ctx?.canvas.height ?? 600;
  }

  polygon(mode: DrawMode, ...vertices: number[]): void {
    if (!this.ctx || vertices.length < 6) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0], vertices[1]);
    
    for (let i = 2; i < vertices.length; i += 2) {
      this.ctx.lineTo(vertices[i], vertices[i + 1]);
    }
    
    this.ctx.closePath();
    
    if (mode === 'fill') {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  arc(mode: DrawMode, x: number, y: number, radius: number, angle1: number, angle2: number): void {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, angle1, angle2);
    
    if (mode === 'fill') {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  points(...vertices: number[]): void {
    if (!this.ctx) return;
    
    this.ctx.save();
    this.ctx.fillStyle = `rgba(${this.currentColor.r * 255}, ${this.currentColor.g * 255}, ${this.currentColor.b * 255}, ${this.currentColor.a})`;
    
    for (let i = 0; i < vertices.length; i += 2) {
      if (i + 1 < vertices.length) {
        this.ctx.fillRect(vertices[i], vertices[i + 1], 1, 1);
      }
    }
    
    this.ctx.restore();
  }
}

export const graphics = new Graphics();
export default graphics;
