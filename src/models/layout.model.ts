import { action, observable } from "mobx";
import { Application, FederatedPointerEvent, Graphics } from "pixi.js";
import { Line } from "../elements/line";
import { degreeToRadian } from "../utils/degree-to-radian";
import { CoordSystemTypes, LineTypes, MIN_LINE_WIDTH } from "./constants";

class LayoutModel {
  @observable accessor selectedLineType: LineTypes = LineTypes.SOLID;
  @observable accessor isDrawing: boolean = false;
  // TODO: make private
  @observable accessor drawingLine: Line | null = null;
  @observable accessor drawingCoordSystem: CoordSystemTypes =
    CoordSystemTypes.CARTESIAN;
  @observable accessor drawingLineWidth: number = MIN_LINE_WIDTH;

  private app: Application;
  private elementList: Line[] = [];
  private centerX: number = 0;
  private centerY: number = 0;

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
      return;
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

  onEnterPolar(length: number, degree: number) {
    if (!this.drawingLine || Number.isNaN(length) || Number.isNaN(degree)) {
      return;
    }
    const x = length * Math.cos(degreeToRadian(degree));
    const y = length * Math.sin(degreeToRadian(degree));

    this.drawingLine.setPosition(
      this.drawingLine.x1 + x,
      this.drawingLine.y1 - y
    );
    this.completeDrawLine();
  }

  private startDrawLine(x1: number, y1: number) {
    const line = new Line({
      x1: x1,
      y1: y1,
      width: this.drawingLineWidth,
      lineType: this.selectedLineType,
    });
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

  destroy() {
    this.app.destroy();
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
    this.drawingLine?.setLineType(lineType);
  }

  @action
  setIsDrawing(value: boolean) {
    this.isDrawing = value;
  }

  @action
  setDrawingLine(value: Line | null) {
    this.drawingLine = value;
  }

  @action
  setDrawingCoordSystem(value: CoordSystemTypes) {
    this.drawingCoordSystem = value;
  }

  @action
  setDrawingLineWidth(value: number) {
    this.drawingLineWidth = value;
    this.drawingLine?.setWidth(value);
  }
}

export const layoutModel = new LayoutModel();
