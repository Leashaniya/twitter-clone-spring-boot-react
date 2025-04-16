import React, { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Backdrop, Box, Button, CircularProgress } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { BusinessCenterSharp } from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { getUserPosts, findPostsByLikesContainUser } from "../../Store/Post/Action";
import SkillPost from "../Home/MiddlePart/SkillPost";
import ProfileModel from "./ProfileModel";
import { FollowUserAction, findUserById } from "../../Store/Auth/Action";
import SnackbarComponent from "../Snackbar/SnackbarComponent";

const Profile = () => {
  const [tabValue, setTabValue] = React.useState("1");
  const { auth, post, theme } = useSelector((store) => store);
  const [openProfileModel, setOpenProfileModel] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const param = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === "4") {
      dispatch(findPostsByLikesContainUser(param.id));
    } else if (newValue === "1") {
      dispatch(getUserPosts(param.id));
    }
  };

  useEffect(() => {
    dispatch(getUserPosts(param.id));
    dispatch(findPostsByLikesContainUser(param.id));
  }, [param.id, dispatch]);

  useEffect(() => {
    dispatch(findUserById(param.id));
  }, [param.id, auth.user, dispatch]);

  useEffect(() => {
    setOpenSnackBar(auth.updateUser);
  }, [auth.updateUser]);

  const handleCloseProfileModel = () => setOpenProfileModel(false);
  const handleOpenProfileModel = () => setOpenProfileModel(true);
  const handleCloseSnackBar = () => setOpenSnackBar(false);
  const handleFollowUser = () => dispatch(FollowUserAction(param.id));

  return (
    <React.Fragment>
      <section
        className={`z-50 flex items-center sticky top-0 ${
          theme.currentTheme === "light" ? "bg-white" : "bg-[#0D0D0D]"
        } bg-opacity-95`}
      >
        <KeyboardBackspaceIcon
          className="cursor-pointer"
          onClick={handleBack}
        />
        <h1 className="py-5 text-xl font-bold opacity-90 ml-5">
          {auth.findUser?.fullName}
        </h1>
      </section>
      <section>
        <img
          className="w-[100%] h-[15rem] object-cover"
          src={
            auth.findUser?.backgroundImage ||
            "https://cdn.pixabay.com/photo/2018/10/16/15/01/background-image-3751623_1280.jpg"
          }
          alt="Profile background"
        />
      </section>

      <section className="pl-6">
        <div className=" flex justify-between items-start mt-5 h-[5rem]">
          <Avatar
            alt={auth.findUser?.fullName}
            src={auth.findUser?.image}
            className="transform -translate-y-24 "
            sx={{ width: "10rem", height: "10rem", border: "4px solid white" }}
          />
          {auth.findUser?.req_user ? (
            <Button
              onClick={handleOpenProfileModel}
              sx={{ borderRadius: "20px" }}
              variant="outlined"
              className="rounded-full"
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              onClick={handleFollowUser}
              sx={{ borderRadius: "20px" }}
              variant="outlined"
              className="rounded-full"
            >
              {auth.findUser?.followed ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
        <div>
          <div>
            <div className="flex items-center">
              <h1 className="font-bold text-lg">{auth.findUser?.fullName}</h1>
            {auth.findUser?.verified && <img
              className="ml-2 w-5 h-5"
              src="https://abs.twimg.com/responsive-web/client-web/verification-card-v2@3x.8ebee01a.png"
              alt="Verified badge"
            />}
            </div>
            <h1 className="text-gray-500">
              @{auth.findUser?.fullName?.split(" ").join("_").toLowerCase()}
            </h1>
          </div>
          <div className="mt-2 space-y-3">
            {auth.findUser?.bio && <p>{auth.findUser?.bio}</p>}
            <div className="py-1 flex space-x-5">
              <div className="flex items-center text-gray-500">
                <BusinessCenterSharp />
                <p className="ml-2">Education</p>
              </div>
              <div className="flex items-center text-gray-500">
                <LocationOnIcon />
                <p className="ml-2">{auth.findUser?.location}</p>
              </div>
              <div className="flex items-center text-gray-500">
                <CalendarMonthIcon />
                <p className="ml-2">Joined June 2022</p>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <div className="flex items-center space-x-1 font-semibold">
                <span>{auth.findUser?.followings.length}</span>
                <span className="text-gray-500">Following</span>
              </div>
              <div className="flex items-center space-x-1 font-semibold">
                <span>{auth.findUser?.followers.length}</span>
                <span className="text-gray-500">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Box sx={{ width: "100%", typography: "body1", marginTop: "20px" }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleTabChange}
                aria-label="profile tabs"
              >
                <Tab label="Posts" value="1" />
                <Tab label="Replies" value="2" />
                <Tab label="Media" value="3" />
                <Tab label="Likes" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {!post.userPosts || post.userPosts.length === 0 ? (
                <div className="text-center text-gray-500 py-5">
                  No posts yet
                </div>
              ) : (
                <div className="space-y-4">
                  {post.userPosts.map((item) => (
                    <SkillPost key={item.id} post={item} />
                  ))}
                </div>
              )}
            </TabPanel>
            <TabPanel value="2">
              <div className="text-center text-gray-500 py-5">No replies yet</div>
            </TabPanel>
            <TabPanel value="3">
              <div className="text-center text-gray-500 py-5">No media posts yet</div>
            </TabPanel>
            <TabPanel value="4">
              {!post.likedPosts || post.likedPosts.length === 0 ? (
                <div className="text-center text-gray-500 py-5">
                  No liked posts yet
                </div>
              ) : (
                <div className="space-y-4">
                  {post.likedPosts.map((item) => (
                    <SkillPost key={item.id} post={item} />
                  ))}
                </div>
              )}
            </TabPanel>
          </TabContext>
        </Box>
      </section>
      <section>
        <ProfileModel
          open={openProfileModel}
          handleClose={handleCloseProfileModel}
        />
      </section>
      <section>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={post.loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </section>
      <section>
        <SnackbarComponent
          handleClose={handleCloseSnackBar}
          open={openSnackBar}
          message="Profile updated successfully!"
        />
      </section>
    </React.Fragment>
  );
};

export default Profile;
