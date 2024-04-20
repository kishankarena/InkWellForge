import { useState } from "react";

import { Tools, ToolsType } from "src/types";
import ActionBar from "../ActionBar/ActionBar";
import Info from "../Info/Info";

const InkWellForge = () => {
  const initialTool: ToolsType = Tools.selection;
  const [tool, setTool] = useState<ToolsType>(initialTool);
  return (
    <div>
      <Info />
      <ActionBar tool={tool} setTool={setTool} />
    </div>
  );
};

export default InkWellForge;
