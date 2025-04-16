import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../Store/Auth/Selectors";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: "none",
};

const AuthModel = ({ open, handleClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  useEffect(() => {
    // Close modal and redirect to home when user is authenticated
    if (auth.jwt) {
      handleClose();
      navigate("/");
    }
  }, [auth.jwt, handleClose, navigate]);

  const handleNavigate = () => {
    const path = location.pathname === "/signup" ? "/signin" : "/signup";
    navigate(path);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {location.pathname === "/signup" ? <SignupForm /> : <SigninForm />}

          <div className="flex items-center justify-center space-x-1 mt-5">
            <p className="text-center">
              {location.pathname === "/signup"
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>
            <button
              onClick={handleNavigate}
              className="text-blue-500 hover:text-blue-600"
            >
              {location.pathname === "/signup" ? "Sign in" : "Sign up"}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AuthModel;
