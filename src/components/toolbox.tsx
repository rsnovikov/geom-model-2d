import { observer } from "mobx-react-lite";
import { FC } from "preact/compat";
import { layoutModel } from "../models/layout.model";
import { Button, Select } from "antd";
import {
  MAX_LINE_WIDTH,
  MIN_LINE_WIDTH,
  LINE_WIDTH_STEP,
  CoordSystemTypes,
  LineTypes,
} from "../models/constants";

const lineTypeOptions: { value: LineTypes; label: string }[] = [
  { value: LineTypes.SOLID, label: "Сплошная" },
  { value: LineTypes.DOTTED, label: "Пунктирная" },
  { value: LineTypes.STREAK_DOTTED, label: "Штрихпунктирная" },
];

const lineWidthOptions = [
  ...new Array(
    Math.ceil((MAX_LINE_WIDTH - MIN_LINE_WIDTH) / LINE_WIDTH_STEP) + 1
  ),
].map((_, index) =>
  Number((MIN_LINE_WIDTH + index * LINE_WIDTH_STEP).toFixed(1))
);

const coordSystemOptions: { value: CoordSystemTypes; label: string }[] = [
  { value: CoordSystemTypes.CARTESIAN, label: "Декартова" },
  { value: CoordSystemTypes.POLAR, label: "Полярная" },
];

/**
 * Toolbox
 * @returns {JSX.Element}
 */
export const Toolbox: FC = observer(() => {
  const onSelectLineType = (value: LineTypes) => {
    layoutModel.setSelectedLineType(value);
  };

  const onSelectLineWidth = (value: number) => {
    layoutModel.setDrawingLineWidth(value);
  };

  const onSelectCoordSystem = (value: CoordSystemTypes) => {
    layoutModel.setDrawingCoordSystem(value);
  };

  return (
    <div className="border-b-2 border-gray-900 bg-gray-700 px-5 py-3 flex gap-2">
      <Button
        onClick={() => layoutModel.setIsDrawing(!layoutModel.isDrawing)}
        color
        type={layoutModel.isDrawing ? "primary" : "default"}
      >
        Линия
      </Button>
      <Select
        value={layoutModel.selectedLineType}
        className="w-[140px]"
        onChange={onSelectLineType}
        options={lineTypeOptions}
      />
      <Select
        value={layoutModel.drawingLineWidth}
        className="w-[100px]"
        onChange={onSelectLineWidth}
        options={lineWidthOptions.map((item) => ({ label: item, value: item }))}
      />
      <Select
        value={layoutModel.drawingCoordSystem}
        defaultValue={CoordSystemTypes.CARTESIAN}
        className="w-[140px]"
        onChange={onSelectCoordSystem}
        options={coordSystemOptions}
      />
    </div>
  );
});
