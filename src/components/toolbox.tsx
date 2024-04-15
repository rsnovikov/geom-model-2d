import { observer } from "mobx-react-lite";
import { FC } from "preact/compat";
import { LineTypes, layoutModel } from "../models/layout.model";
import { Button, Select } from "antd";

const lineTypeOptions: { value: LineTypes; label: string }[] = [
  { value: LineTypes.SOLID, label: "Сплошная" },
  { value: LineTypes.DOTTED, label: "Пунктирная" },
];

/**
 * Toolbox
 * @returns {JSX.Element}
 */
export const Toolbox: FC = observer(() => {
  const onSelectLineType = (value: LineTypes) => {
    layoutModel.setSelectedLineType(value);
  };

  return (
    <div className="border-b-2 border-gray-900 bg-gray-700 px-5 py-3">
      <Button
        onClick={() => layoutModel.setIsDrawing(!layoutModel.isDrawing)}
        color
        type={layoutModel.isDrawing ? "primary" : "default"}
      >
        Линия
      </Button>
      <Select
        value={layoutModel.selectedLineType}
        defaultValue={LineTypes.SOLID}
        className="w-[140px]"
        onChange={onSelectLineType}
        options={lineTypeOptions}
      />
      {/* <Button.Group outline={false} pill>
        <Button
          color={Boolean(layoutModel.isDrawing) ? "gray" : "info"}
          onClick={() => layoutModel.setIsDrawing(!layoutModel.isDrawing)}
        >
          Линия
        </Button>
        <Dropdown label={lineTypesRecord[layoutModel.selectedLineType]}>
          {Object.entries(lineTypesRecord).map(([value, label]) => (
            <Dropdown.Item
              onClick={() =>
                layoutModel.setSelectedLineType(value as LineTypes)
              }
            >
              {label}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </Button.Group> */}
    </div>
  );
});
