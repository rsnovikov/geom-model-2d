import { action, observable } from "mobx";
import { Application, FederatedPointerEvent, Graphics } from "pixi.js";
import { Line } from "../elements/line";

export enum LineTypes {
  SOLID = "SOLID",
  DOTTED = "DOTTED",
}

class LayoutModel {
  @observable accessor selectedLineType: LineTypes = LineTypes.SOLID;
  @observable accessor isDrawing: boolean = false;

  private app: Application;
  private elementList: Line[] = [];
  private centerX: number = 0;
  private centerY: number = 0;
  // TODO: make private
  @observable accessor drawingLine: Line | null = null;

  constructor() {
    this.app = new Application();
  }

  private onClick(event: FederatedPointerEvent) {
    if (this.drawingLine) {
      this.completeDrawLine();
      return;
    }

    if (this.isDrawing) {
      return this.startDrawLine(event.globalX, event.globalY);
    }
  }

  private onKeyPress(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.drawingLine?.destroy();
      this.setDrawingLine(null);
      this.setIsDrawing(false);
    }
  }

  onEnterPos(value?: string) {
    if (!value?.trim() || !value.includes(",")) {
      throw new Error("Incorrect incoming value");
    }

    let [enteredX, enteredY] = value.split(",").map(Number);
    const { x, y } = this.transformPos(enteredX, enteredY);
    if (this.drawingLine) {
      this.drawingLine.setPosition(x, y);
      this.completeDrawLine();
      return;
    }

    if (this.isDrawing) {
      this.startDrawLine(x, y);
    }
  }

  private startDrawLine(x1: number, y1: number) {
    const line = new Line({ x1: x1, y1: y1 });
    this.setDrawingLine(line);
    line.appendTo(this.app.stage);
  }

  private completeDrawLine() {
    if (!this.drawingLine) {
      return;
    }
    this.setIsDrawing(false);
    this.elementList.push(this.drawingLine);
    this.setDrawingLine(null);
  }

  private onMouseMove(event: FederatedPointerEvent) {
    this.drawingLine?.setPosition(event.globalX, event.globalY);
  }

  private initEvents() {
    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on("mousemove", this.onMouseMove.bind(this));
    this.app.stage.on("click", this.onClick.bind(this));
    window.addEventListener("keydown", this.onKeyPress.bind(this));
  }

  async init({ resizeTo }: { resizeTo?: HTMLElement } = {}) {
    await this.app.init({
      resizeTo: resizeTo || window,
      antialias: true,
      backgroundColor: "#212930",
    });
    this.centerX = this.app.screen.width / 2;
    this.centerY = this.app.screen.height / 2;
    this.initEvents();
    this.renderCenter();
  }

  private transformPos(x?: number, y?: number) {
    return {
      x: this.centerX + (x ?? 0),
      y: this.centerY - (y ?? 0),
    };
  }

  private renderCenter() {
    this.app.stage.addChild(
      new Graphics()
        .moveTo(this.centerX, this.centerY)
        .lineTo(this.centerX + 100, this.centerY)
        .fill("green")
        .stroke({ width: 2, color: "green" })
    );

    this.app.stage.addChild(
      new Graphics()
        .moveTo(this.centerX, this.centerY)
        .lineTo(this.centerX, this.centerY - 100)
        .fill("green")
        .stroke({ width: 2, color: "red" })
    );
  }

  appendTo(parent: HTMLElement) {
    parent.appendChild(this.app.canvas);
  }

  @action
  setSelectedLineType(lineType: LineTypes) {
    this.selectedLineType = lineType;
  }

  @action
  setIsDrawing(value: boolean) {
    this.isDrawing = value;
  }

  @action
  setDrawingLine(value: Line | null) {
    this.drawingLine = value;
  }
}

export const layoutModel = new LayoutModel();
