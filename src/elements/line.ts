import { Container, Graphics } from "pixi.js";

export interface Position {
  x1: number;
  y1: number;
  x2?: number;
  y2?: number;
}

export class Line {
  private x1: number;
  private y1: number;
  private x2: number;
  private y2: number;

  private graphics: Graphics;

  constructor({ x1, y1, x2 = x1, y2 = y1 }: Position) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.graphics = new Graphics();
  }

  private render() {
    if (!this.graphics) {
      return;
    }
    this.graphics.clear();

    this.graphics
      .moveTo(this.x1, this.y1)
      .lineTo(this.x2, this.y2)
      .stroke({ width: 2, color: "#A9ADAF" });
  }

  appendTo(container: Container) {
    container.addChild(this.graphics);
  }

  setPosition(x2: number, y2: number) {
    this.x2 = x2;
    this.y2 = y2;
    this.render();
  }

  destroy() {
    this.graphics.removeFromParent();
    this.graphics.destroy();
  }
}
