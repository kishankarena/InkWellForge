import Tippy from "@tippyjs/react";
import { PiMinus, PiPlus } from "react-icons/pi";

import styles from "./ControlPanel.module.css";
import { HiOutlineArrowUturnLeft, HiOutlineArrowUturnRight } from "react-icons/hi2";

type ControlPanelProps = {
  undo: () => void;
  redo: () => void;
  onZoom: (scale: number) => void;
  scale: number;
  setScale: (scale: number) => void;
};

const ControlPanel = ({ undo, redo, onZoom, scale, setScale }: ControlPanelProps) => {
  return (
    <>
      <div className={styles.control_panel}>
        <div className={styles.zoom_panel}>
          <Tippy content="Zoom Out">
            <button onClick={() => onZoom(-0.1)} aria-label="Zoom Out">
              <PiMinus />
            </button>
          </Tippy>
          <Tippy content={`Set scale to 100%`}>
            <button onClick={() => setScale(1)} aria-label={`Set scale to 100%`}>
              {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
            </button>
          </Tippy>
          <Tippy content="Zoom In">
            <button onClick={() => onZoom(0.1)} aria-label="Zoom In">
              <PiPlus />
            </button>
          </Tippy>
        </div>

        <div className={styles.edit_panel}>
          <Tippy content="Undo last action">
            <button onClick={undo} aria-label="Undo last action">
              <HiOutlineArrowUturnLeft />
            </button>
          </Tippy>
          <Tippy content="Redo last action">
            <button onClick={redo} aria-label="Redo last action">
              <HiOutlineArrowUturnRight />
            </button>
          </Tippy>
        </div>
      </div>
    </>
  );
};
export default ControlPanel;
