import { useEffect, useRef } from "react";
import styles from "./TextArea.module.css";
import { ActionsType, ElementType, PointType } from "src/types";

interface TextAreaProps {
  action: ActionsType;
  scale: number;
  panOffset: PointType;
  scaleOffset: PointType;
  selectedElement: ElementType | null | undefined;
  handleBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({ action, scale, panOffset, scaleOffset, selectedElement, handleBlur }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (action === "writing" && textarea && selectedElement) {
      setTimeout(() => {
        textarea.focus();
        textarea.value = selectedElement.text || "";
      }, 0);
    }
  }, [action, selectedElement]);
  return (
    <textarea
      ref={textAreaRef}
      onBlur={handleBlur}
      className={styles.text_area}
      style={{
        top: selectedElement ? (selectedElement.y1 - 2) * scale + panOffset.y * scale - scaleOffset.y : 0,
        left: selectedElement ? selectedElement.x1 * scale + panOffset.x * scale - scaleOffset.x : 0,
        font: `${24 * scale}px sans-serif`,
      }}
    />
  );
};
export default TextArea;
