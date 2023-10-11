import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

type Props = {};

const Layout = (props: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
