import { Container, Graphics } from "pixi.js";
import { BASE_LINE_WIDTH, LineTypes } from "../models/constants";

export interface Position {
  x1: number;
  y1: number;
  x2?: number;
  y2?: number;
}

export class Line {
  public x1: number;
  public y1: number;
  private x2: number;
  private y2: number;
  private width: number;
  private lineType: LineTypes;

  private graphics: Graphics;

  constructor({
    x1,
    y1,
    x2 = x1,
    y2 = y1,
    width,
    lineType,
  }: Position & { width: number; lineType: LineTypes }) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.width = width * BASE_LINE_WIDTH;
    this.lineType = lineType;

    this.graphics = new Graphics();
  }

  private render() {
    if (!this.graphics) {
      return;
    }
    this.graphics.clear();

    switch (this.lineType) {
      case LineTypes.SOLID: {
        this.graphics.moveTo(this.x1, this.y1).lineTo(this.x2, this.y2);
        break;
      }
      case LineTypes.DOTTED: {
        // Длина штриха и пробела в пикселях
        const dashLength = 16;
        const gapLength = 4;
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;

        const lineLength = Math.sqrt(dx ** 2 + dy ** 2);
        const angle = Math.atan2(dy, dx);

        let dashPosition = 0;
        while (dashPosition < lineLength) {
          const segmentStart = dashPosition;
          dashPosition += dashLength;
          const segmentEnd = Math.min(dashPosition, lineLength);

          this.graphics.moveTo(
            this.x1 + Math.cos(angle) * segmentStart,
            this.y1 + Math.sin(angle) * segmentStart
          );
          this.graphics.lineTo(
            this.x1 + Math.cos(angle) * segmentEnd,
            this.y1 + Math.sin(angle) * segmentEnd
          );

          dashPosition += gapLength;
        }
        break;
      }
      case LineTypes.STREAK_DOTTED: {
        // Длина штриха, точки и промежутка в пикселях
        const dashLength = 16;
        const dotLength = 2;
        const gapLength = 4;

        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;

        const lineLength = Math.sqrt(dx ** 2 + dy ** 2);
        const angle = Math.atan2(dy, dx);

        let position = 0;
        while (position < lineLength) {
          const segmentStart = position;
          position += dashLength;
          const segmentEnd = Math.min(position, lineLength);

          this.graphics.moveTo(
            this.x1 + Math.cos(angle) * segmentStart,
            this.y1 + Math.sin(angle) * segmentStart
          );
          this.graphics.lineTo(
            this.x1 + Math.cos(angle) * segmentEnd,
            this.y1 + Math.sin(angle) * segmentEnd
          );

          position += gapLength;

          const dotStart = position;
          position += dotLength;
          const dotEnd = Math.min(position, lineLength);

          this.graphics.moveTo(
            this.x1 + Math.cos(angle) * dotStart,
            this.y1 + Math.sin(angle) * dotStart
          );
          this.graphics.lineTo(
            this.x1 + Math.cos(angle) * dotEnd,
            this.y1 + Math.sin(angle) * dotEnd
          );

          position += gapLength;
        }

        break;
      }
    }

    this.graphics.stroke({ width: this.width, color: "#A9ADAF" });
  }

  appendTo(container: Container) {
    container.addChild(this.graphics);
  }

  setPosition(x2: number, y2: number) {
    this.x2 = x2;
    this.y2 = y2;
    this.render();
  }

  setWidth(value: number) {
    this.width = value * BASE_LINE_WIDTH;
    this.render();
  }

  setLineType(value: LineTypes) {
    this.lineType = value;
    this.render();
  }

  destroy() {
    this.graphics.removeFromParent();
    this.graphics.destroy();
  }
}
