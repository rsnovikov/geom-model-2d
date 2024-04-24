import { FC } from "preact/compat";
import { useRef, useEffect } from "preact/hooks";
import { observer } from "mobx-react-lite";
import { layoutModel } from "../models/layout.model";
import { CartesianCoordsField } from "./cartesian-coords-field";
import { PolarCoordsFields } from "./polar-coords-fields";
import { CoordSystemTypes } from "../models/constants";

/**
 * Layout
 * @returns {JSX.Element}
 */
export const Layout: FC = observer(() => {
  const layoutWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!layoutWrapperRef.current) {
        return;
      }

      await layoutModel.init({ resizeTo: layoutWrapperRef.current });

      if (layoutWrapperRef.current) {
        layoutModel.appendTo(layoutWrapperRef.current);
      }
    })();

    return () => {
      layoutModel.destroy();
    };
  }, []);

  return (
    <div className="w-full h-full relative" ref={layoutWrapperRef}>
      {(layoutModel.isDrawing || layoutModel.drawingLine) &&
        (layoutModel.drawingCoordSystem === CoordSystemTypes.POLAR ? (
          <PolarCoordsFields />
        ) : (
          <CartesianCoordsField />
        ))}
    </div>
  );
});
