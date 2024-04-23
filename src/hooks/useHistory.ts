import { useState } from "react";
import { ElementType } from "src/types";

export const useHistory = (initialState: ElementType[]) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action: ElementType[] | ((current: ElementType[]) => ElementType[]), overwrite = false) => {
    const newState = typeof action === "function" ? action(history[index]) : action;

    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };
  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () => index < history.length - 1 && setIndex((prevState) => prevState + 1);

  // const iterator = () => history[index][Symbol.iterator]();

  return {
    elements: history[index],
    setElements: setState,
    undo,
    redo,
    // [Symbol.iterator]: iterator,
  };
};
