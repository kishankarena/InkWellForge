import { useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Info.module.css";

const Info = () => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div>
      <button className={styles.info_button} aria-label="Open information dialog" onClick={() => setOpenDialog(true)}>
        <BsQuestionCircle />
      </button>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="customized-dialog-title"
        PaperProps={{
          style: {
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="dialog-title" className={styles.dialog_title}>
          How to use InkWellForge ?
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpenDialog(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          className={styles.icon_button}
        >
          <CloseIcon className={styles.close_icon} />
        </IconButton>
        <div className={styles.info_content}>
          <p>Get Start with these simple steps !</p>
          <ul>
            <li>
              <strong>Choose a Tool:</strong> Select from pencil, line, rectangle, or text tools to start drawing.
            </li>
            <li>
              <strong>Draw & Move:</strong> Click and drag on the canvas to draw. Select an element and drag to move.
            </li>
            <li>
              <strong>Edit Text:</strong> Select the text tool and click on the canvas to start typing.
            </li>
            <li>
              <strong>Zoom:</strong> Use Ctrl + Scroll to zoom in and out of the canvas.
            </li>
            <li>
              <strong>Pan:</strong> Hold Space and drag to move around the canvas, or hold the middle mouse button.
            </li>
          </ul>
          <p>Keyboard Shortcuts:</p>
          <ul>
            <li>
              <strong>Undo:</strong> Ctrl + Z
            </li>
            <li>
              <strong>Redo:</strong> Ctrl + Y or Ctrl + Shift + Z
            </li>
            <li>
              <strong>Zoom In:</strong> Ctrl + Plus
            </li>
            <li>
              <strong>Zoom Out:</strong> Ctrl + Minus
            </li>
          </ul>
          <p>Enjoy creating your masterpiece!</p>
        </div>
      </Dialog>
    </div>
  );
};

export default Info;
