enum Tools {
  pan = "pan",
  selection = "selection",
  rectangle = "rectangle",
  line = "line",
  pencil = "pencil",
  text = "text",
}
export { Tools };
export type ToolsType = keyof typeof Tools;

export type ActionsType = "writing" | "drawing" | "moving" | "panning" | "resizing" | "none";

export type ElementType = {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: ToolsType;
  roughElement?: any;
  offsetX?: number;
  offsetY?: number;
  position?: string | null;
  points?: { x: number; y: number }[];
  text?: string;
};

export type PointType = { x: number; y: number };

export type SelectedElementType = ElementType & {
  xOffsets?: number[];
  yOffsets?: number[];
  offsetX?: number;
  offsetY?: number;
};

export interface ExtendedElementType extends ElementType {
  xOffsets?: number[];
  yOffsets?: number[];
}
