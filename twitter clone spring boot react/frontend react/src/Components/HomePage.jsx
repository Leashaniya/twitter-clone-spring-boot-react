import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import Navigation from "./Navigation/Navigation";
import HomeSection from "./Home/MiddlePart/HomeSection";
import RightPart from "./RightPart/RightPart";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../Store/Auth/Selectors";
import { selectTheme } from "../Store/Theme/Selectors";
import { Route, Routes } from 'react-router-dom'
import Profile from './Profile/Profile'
import TwitDetail from './Home/MiddlePart/TwitDetail'

const HomePage = () => {
  const auth = useSelector(selectAuth);
  const theme = useSelector(selectTheme);

  return (
    <Grid container xs={12} className="px-5 lg:px-36 justify-between">
      <Grid item xs={0} lg={2.5} className="hidden lg:block w-full relative">
        <Navigation />
      </Grid>
      <Grid
        item
        xs={12}
        lg={6}
        className={`px-5 lg:px-9 relative ${
          theme.currentTheme === "dark" ? "border-x border-gray-700" : "border-x"
        }`}
      >
        <Routes>
          <Route path="/" element={<HomeSection />} />
          <Route path="/home" element={<HomeSection />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/twit/:id" element={<TwitDetail />} />
        </Routes>
      </Grid>
      <Grid item xs={0} lg={3} className="hidden lg:block w-full relative">
        <RightPart />
      </Grid>
    </Grid>
  );
};

export default HomePage;