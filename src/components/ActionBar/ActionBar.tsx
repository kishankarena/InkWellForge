import { Tools, ToolsType } from "src/types";
import styles from "./ActionBar.module.css";
import { IoHandRightOutline, IoText } from "react-icons/io5";
import { FiMinus, FiMousePointer, FiSquare } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";

type ActionBarProps = {
  tool: ToolsType;
  setTool: (tool: ToolsType) => void;
};
const ActionBar = ({ tool, setTool }: ActionBarProps) => {
  return (
    <div className={styles.action_bar}>
      {Object.values(Tools).map((toolValue, index) => (
        <div
          className={`${styles.input_wrapper} ${tool === toolValue ? styles.selected : ""}`}
          key={toolValue}
          onClick={() => setTool(toolValue)}
        >
          <input
            type="radio"
            id={toolValue}
            checked={tool === toolValue}
            onChange={() => setTool(toolValue)}
            readOnly
          />
          <label htmlFor={toolValue}>{toolValue}</label>
          {toolValue === "pan" && <IoHandRightOutline />}
          {toolValue === "selection" && <FiMousePointer />}
          {toolValue === "rectangle" && <FiSquare />}
          {toolValue === "line" && <FiMinus />}
          {toolValue === "pencil" && <LuPencil />}
          {toolValue === "text" && <IoText />}
          <span>{index + 1}</span>
        </div>
      ))}
    </div>
  );
};
export default ActionBar;
