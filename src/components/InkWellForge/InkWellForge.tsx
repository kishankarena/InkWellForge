import React, { useEffect, useRef, useState } from "react";

import { Tools, ToolsType, ActionsType, ElementType } from "src/types";
import ActionBar from "../ActionBar/ActionBar";
import Info from "../Info/Info";
import { useHistory } from "src/hooks/useHistory";
import { createElement } from "src/utils/createElement";
import { usePressedKeys } from "src/hooks/usePressedKeys";
import ControlPanel from "../ControlPanel/ControlPanel";
import ToastNotify from "../ToastNotify/ToastNotify";
import useNotification from "src/hooks/useNotification";
import Canvas from "../Canvas/Canvas";
import TextArea from "../TextArea/TextArea";

const InkWellForge = () => {
  const initialTool: ToolsType = Tools.selection;

  const [tool, setTool] = useState<ToolsType>(initialTool);
  const [action, setAction] = useState<ActionsType>("none");
  const [selectedElement, setSelectedElement] = useState<ElementType | null>();
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

  const { elements, setElements, undo, redo } = useHistory([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const pressedKeys = usePressedKeys();
  const { message, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (action === "writing" && textarea && selectedElement) {
      setTimeout(() => {
        textarea.focus();
        textarea.value = selectedElement.text || "";
      }, 0);
    }
  }, [action, selectedElement]);

  useEffect(() => {
    const undoRedoFunction = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === "z") {
          if (event.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (event.key === "y") {
          redo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  useEffect(() => {
    const panOrZoomFunction = (event: WheelEvent) => {
      if (pressedKeys.has("Meta") || pressedKeys.has("Control")) {
        onZoom(event.deltaY * -0.01);
      } else {
        setPanOffset((prevState) => ({
          x: prevState.x - event.deltaX,
          y: prevState.y - event.deltaY,
        }));
      }
    };

    document.addEventListener("wheel", panOrZoomFunction);
    return () => {
      document.removeEventListener("wheel", panOrZoomFunction);
    };
  }, [pressedKeys]);

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: ToolsType,
    options?: { text: string },
  ) => {
    const elementsCopy = [...elements];
    switch (type) {
      case Tools.line:
      case Tools.rectangle: {
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      }
      case Tools.pencil: {
        const existingPoints = elementsCopy[id].points || [];
        elementsCopy[id].points = [...existingPoints, { x: x2, y: y2 }];
        break;
      }
      case Tools.text: {
        const canvas = document.getElementById("canvas");
        if (!(canvas instanceof HTMLCanvasElement)) {
          showNotification("Canvas element not found");
          return;
        }
        const context = canvas.getContext("2d");
        if (!context) {
          showNotification("Could not get 2D context from canvas");
          return;
        }
        if (!options) {
          showNotification("No text options provided for text tool");
          return;
        }
        const textWidth = context.measureText(options?.text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options?.text,
        };
        break;
      }
      default:
        showNotification(`Type not recognised: ${type}`);
    }
    setElements(elementsCopy, true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (selectedElement) {
      const { id, x1, y1, type } = selectedElement;

      const x2 = selectedElement.x2 || x1;
      const y2 = selectedElement.y2 || y1;

      setAction("none");
      setSelectedElement(null);
      updateElement(id, x1, y1, x2, y2, type, { text: event.target.value });
    }
  };
  const onZoom = (delta: number) => {
    setScale((prevState) => Math.min(Math.max(prevState + delta, 0.1), 20));
  };
  return (
    <>
      <Info />
      <ActionBar tool={tool} setTool={setTool} />
      <ControlPanel undo={undo} redo={redo} onZoom={onZoom} scale={scale} setScale={setScale} />
      {action === "writing" ? (
        <TextArea
          action={action}
          scale={scale}
          panOffset={panOffset}
          scaleOffset={scaleOffset}
          selectedElement={selectedElement}
          handleBlur={handleBlur}
        />
      ) : null}
      <Canvas
        tool={tool}
        action={action}
        scale={scale}
        panOffset={panOffset}
        scaleOffset={scaleOffset}
        selectedElement={selectedElement}
        elements={elements}
        setAction={setAction}
        setScaleOffset={setScaleOffset}
        setSelectedElement={setSelectedElement}
        setPanOffset={setPanOffset}
        setElements={setElements}
        updateElement={updateElement}
      />
      <ToastNotify message={message} onClose={hideNotification} />
    </>
  );
};

export default InkWellForge;
