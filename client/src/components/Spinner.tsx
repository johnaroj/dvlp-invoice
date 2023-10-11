import { Box, CircularProgress } from "@mui/material";
import "../styles/spinner.css";

type Props = {};

const Spinner = (props: Props) => {
  return (
    <Box className="spinnerContainer">
      <Box className="spinner"></Box>
    </Box>
  );
};

export default Spinner;
