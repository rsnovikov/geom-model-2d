import { Form, Button, Input, InputRef } from "antd";
import { FC, useEffect, useRef } from "react";
import { layoutModel } from "../models/layout.model";
import { CartesianCoordsField } from "./cartesian-coords-field";
import { observer } from "mobx-react-lite";

/**
 * PolarCoordsFields
 * @returns {JSX.Element}
 */
export const PolarCoordsFields: FC = observer(() => {
  const ref = useRef<InputRef>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [layoutModel.drawingLine]);

  const onFinish = ({ length, degree }: { length: string; degree: string }) => {
    layoutModel.onEnterPolar(Number(length), Number(degree));
  };

  if (layoutModel.drawingLine) {
    return (
      <Form
        onFinish={onFinish}
        rootClassName="flex items-center w-[300px] absolute left-0 top-0  rounded-lg overflow-hidden"
      >
        <Form.Item name="length" noStyle>
          <Input
            addonBefore="Длина"
            ref={ref}
            rootClassName="bg-white"
            allowClear
          />
        </Form.Item>
        <Form.Item name="degree" noStyle>
          <Input addonBefore="Угол" rootClassName="bg-white" allowClear />
        </Form.Item>
        <Button htmlType="submit" className="hidden" />
      </Form>
    );
  }

  if (layoutModel.isDrawing) {
    return <CartesianCoordsField />;
  }

  return null;
});
