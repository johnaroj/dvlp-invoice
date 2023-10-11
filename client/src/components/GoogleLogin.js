import Box from "@material-ui/core/Box";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = () => {
  const google = () => {
    // TODO: change this in production
    window.open("http://localhost:8080/auth/google", "_self");
  };
  return (
    <Box sx={{ cursor: "pointer" }} onClick={google}>
      <FcGoogle className="google-icon" />
    </Box>
  );
};

export default GoogleLogin;
