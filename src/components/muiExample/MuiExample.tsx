import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import { useState } from "react";

function MuiExample() {
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const isDisabled = ratingValue === null || comment === "";
  return (
    <Box
      sx={{
        width: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h2" color="primary.main">
        How would you rate this experience ?
      </Typography>
      <Rating value={ratingValue} onChange={(_, val) => setRatingValue(val)} sx={{ m: 2 }} />
      <Typography>Tell us how it went</Typography>
      <TextField multiline maxRows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button disabled={isDisabled} sx={{ mt: 1 }} variant="contained">
        Submit
      </Button>
    </Box>
  );
}
export default MuiExample;
