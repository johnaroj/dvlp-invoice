import { Box, CssBaseline, Link, Typography } from "@mui/material";
import { FaMoneyBillWave } from "react-icons/fa";

function Copyright() {
  return (
    <Typography variant="body2" align="center" sx={{ color: "#fffff" }}>
      {"Copyright ©"}
      <Link color="inherit" href="https://github.com/johnaroj/dvlp-invoice">
        DVLP Invoice
      </Link>
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

type Props = {};

const Footer = (props: Props) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <CssBaseline />
      <Box
        component="footer"
        sx={{
          py: 1,
          px: 1,
          mt: "auto",
          bgColor: "#000000",
        }}
      >
        <Typography
          variant="subtitle1"
          align="center"
          component="p"
          sx={{ color: "#07f011" }}
        >
          <FaMoneyBillWave /> Because Money is as important as oxygen!{" "}
          <FaMoneyBillWave />
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
