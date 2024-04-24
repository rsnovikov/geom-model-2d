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
        break;
      }
      case LineTypes.STREAK_DOTTED: {
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
