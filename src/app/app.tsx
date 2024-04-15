import { FC } from "preact/compat";
import { Toolbox } from "../components/toolbox";
import { Layout } from "../components/layout";

/**
 * App
 * @returns {JSX.Element}
 */
export const App: FC = () => {
  return (
    <div className="w-full h-full bg-gray-800 flex flex-col">
      <Toolbox />
      <div className="flex-grow-1 h-full">
        <Layout />
      </div>
    </div>
  );
};
