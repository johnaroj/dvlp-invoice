import { Box, Container, Typography } from "@mui/material";
import { FaHeartBroken, FaSadTear } from "react-icons/fa";
type Props = {};

const NotFound = (props: Props) => {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Typography
          variant="h1"
          align="center"
          sx={{ fontSize: "10rem", marginTop: "14rem" }}
        >
          404 Not Found
        </Typography>
        <Box>
          <FaHeartBroken className="broken-heart" />
          <FaSadTear className="sad-tear" />
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
