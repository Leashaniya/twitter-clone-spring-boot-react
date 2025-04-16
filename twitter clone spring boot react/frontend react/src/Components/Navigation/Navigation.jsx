import React from "react";
import { navigationMenu } from "./NavigationMenu";
import { Avatar, Button } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Store/Auth/Action";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const { auth } = useSelector(store => store);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
  };

  const handleNavigation = (item) => {
    if (item.title === "Profile" && auth.user?.id) {
      navigate(`/profile/${auth.user.id}`);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="h-screen sticky top-0">
      <div>
        <div className="py-5">
          <img src="/skillsphere-logo.png" alt="" className="w-8" />
        </div>
        <div className="space-y-6">
          {navigationMenu.map((item) => (
            <div 
              key={item.title}
              className="cursor-pointer flex space-x-3 items-center" 
              onClick={() => handleNavigation(item)}
            >
              {item.icon}
              <p className="text-xl">{item.title}</p>
            </div>
          ))}
        </div>
        <div className="py-10">
          <Button
            sx={{
              width: "100%",
              borderRadius: "29px",
              py: "15px",
              bgcolor: "#1d9bf0",
            }}
            variant="contained"
          >
            POST
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => auth.user?.id && navigate(`/profile/${auth.user.id}`)}
          >
            <Avatar alt={auth.user?.fullName} src={auth.user?.image} />
            <div>
              <p>{auth.user?.fullName}</p>
              <span className="opacity-70">@{auth.user?.fullName.split(" ").join("_").toLowerCase()}</span>
            </div>
          </div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreHorizIcon />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
