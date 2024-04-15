import { Input, InputRef } from "antd";
import { FC, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { layoutModel } from "../models/layout.model";

/**
 * CoordsField
 * @returns {JSX.Element}
 */
export const CoordsField: FC = observer(() => {
  const ref = useRef<InputRef>(null);

  useEffect(() => {
    ref.current?.focus();
    console.log("mount");
  }, []);

  const onEnter = () => {
    if (!ref.current?.input) {
      return;
    }
    layoutModel.onEnterPos(ref.current?.input.value);
    setTimeout(() => {
      if (!ref.current?.input) {
        return;
      }
      ref.current.input.value = "";
    }, 0);
  };

  return (
    <Input
      addonBefore={
        layoutModel.drawingLine
          ? "Вторая точка"
          : layoutModel.isDrawing
          ? "Первая точка"
          : null
      }
      ref={ref}
      placeholder="0,0"
      rootClassName="w-[300px] absolute left-0 top-0 bg-white rounded-lg"
      allowClear
      onPressEnter={onEnter}
    />
  );
});
