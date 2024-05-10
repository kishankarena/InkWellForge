import { useLayoutEffect, useState } from "react";
import rough from "roughjs";

import useNotification from "src/hooks/useNotification";
import { usePressedKeys } from "src/hooks/usePressedKeys";
import {
  ActionsType,
  ElementType,
  ExtendedElementType,
  PointType,
  SelectedElementType,
  Tools,
  ToolsType,
} from "src/types";
import { adjustElementCoordinates } from "src/utils/adjustElementCoordinates";
import { adjustmentRequired } from "src/utils/adjustmentRequired";
import { createElement } from "src/utils/createElement";
import { cursorForPosition } from "src/utils/cursorForPosition";
import { drawElement } from "src/utils/drawElement";
import { getElementAtPosition } from "src/utils/getElementAtPosition";
import { resizedCoordinates } from "src/utils/resizedCoordinates";

interface CanvasProps {
  tool: ToolsType;
  action: ActionsType;
  scale: number;
  panOffset: PointType;
  scaleOffset: PointType;
  selectedElement: ElementType | null | undefined;
  elements: ElementType[];
  setAction: React.Dispatch<React.SetStateAction<ActionsType>>;
  setScaleOffset: React.Dispatch<React.SetStateAction<PointType>>;
  setSelectedElement: React.Dispatch<React.SetStateAction<ElementType | null | undefined>>;
  setPanOffset: React.Dispatch<React.SetStateAction<PointType>>;
  setElements: (action: ElementType[] | ((current: ElementType[]) => ElementType[]), overwrite?: boolean) => void;
  updateElement: (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: ToolsType,
    options?: {
      text: string;
    },
  ) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  tool,
  action,
  scale,
  panOffset,
  scaleOffset,
  selectedElement,
  elements,
  setAction,
  setScaleOffset,
  setSelectedElement,
  setPanOffset,
  setElements,
  updateElement,
}) => {
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const { showNotification } = useNotification();
  const pressedKeys = usePressedKeys();

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;
    const scaleOffsetX = (scaledWidth - canvas.width) / 2;
    const scaleOffsetY = (scaledHeight - canvas.height) / 2;
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    context.save();
    context.translate(panOffset.x * scale - scaleOffsetX, panOffset.y * scale - scaleOffsetY);
    context.scale(scale, scale);

    elements.forEach((element: ElementType) => {
      if (action === "writing" && selectedElement && selectedElement.id === element.id) return;
      drawElement(roughCanvas, context, element, showNotification);
    });
    context.restore();
  }, [elements, action, selectedElement, panOffset, scale]);
  const getMouseCoordinates = (event: React.MouseEvent) => {
    const clientX = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
    const clientY = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;

    return { clientX, clientY };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (action === "writing") return;

    const { clientX, clientY } = getMouseCoordinates(event);

    if (tool === Tools.pan || event.button === 1 || pressedKeys.has("")) {
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      document.body.style.cursor = "grabbing";
      return;
    }
    if (event.button === 1 || pressedKeys.has(" ")) {
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      document.body.style.cursor = "grabbing";
      return;
    }

    if (tool === Tools.selection) {
      const element = getElementAtPosition(clientX, clientY, elements, showNotification);

      if (element) {
        let selectedElement: SelectedElementType = { ...element };

        if (element.type === "pencil" && element.points) {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          selectedElement = { ...selectedElement, xOffsets, yOffsets };
        } else {
          const offsetX = clientX - selectedElement.x1;
          const offsetY = clientY - selectedElement.y1;
          selectedElement = { ...selectedElement, offsetX, offsetY };
        }

        setSelectedElement(selectedElement);
        setElements((prevState: ElementType[]) => prevState);

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const id = elements.length;
      const newElement = createElement(id, clientX, clientY, clientX, clientY, tool);
      setElements((prevState: ElementType[]) => [...prevState, newElement]);
      setSelectedElement(newElement);
      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (action === "panning") {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      });
      return;
    }

    if (tool === Tools.selection) {
      const element = getElementAtPosition(clientX, clientY, elements, showNotification);

      if (element && element.position) {
        (event.target as HTMLElement).style.cursor = cursorForPosition(element.position);
      } else {
        (event.target as HTMLElement).style.cursor = "default";
      }
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === "moving" && selectedElement) {
      if (
        selectedElement.type === "pencil" &&
        "points" in selectedElement &&
        "xOffsets" in selectedElement &&
        "yOffsets" in selectedElement
      ) {
        const extendedElement = selectedElement as ExtendedElementType;
        const newPoints = extendedElement.points!.map((_, index) => ({
          x: clientX - extendedElement.xOffsets![index],
          y: clientY - extendedElement.yOffsets![index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[extendedElement.id] = {
          ...elementsCopy[extendedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement as ExtendedElementType;
        const safeOffsetX = offsetX ?? 0;
        const safeOffsetY = offsetY ?? 0;
        const newX1 = clientX - safeOffsetX;
        const newY1 = clientY - safeOffsetY;
        // 🫐 Calculate the new position for x2 and y2 based on the original size
        const newX2 = newX1 + (x2 - x1);
        const newY2 = newY1 + (y2 - y1);
        const options = type === "text" && selectedElement.text ? { text: selectedElement.text } : undefined;
        updateElement(id, newX1, newY1, newX2, newY2, type, options);
      }
    } else if (action === "resizing" && selectedElement && selectedElement.position) {
      const { id, type, position, ...coordinates } = selectedElement as ExtendedElementType;

      if (typeof position === "string") {
        const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type } = elements[index];
      if ((action === "drawing" || action === "resizing") && adjustmentRequired(type)) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type);
      }

      const offsetX = selectedElement.offsetX || 0;
      const offsetY = selectedElement.offsetY || 0;

      if (
        selectedElement.type === "text" &&
        clientX - offsetX === selectedElement.x1 &&
        clientY - offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }
    }

    if (action === "writing") {
      return;
    }

    if (action === "panning") {
      document.body.style.cursor = "default";
    }

    setAction("none");
    setSelectedElement(null);
  };

  return (
    <div>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={`${window.innerHeight - 79}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: "absolute", zIndex: 1 }}
      />
    </div>
  );
};
export default Canvas;
