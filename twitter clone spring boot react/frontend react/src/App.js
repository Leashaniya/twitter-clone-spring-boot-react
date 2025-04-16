import { Route, Routes } from 'react-router-dom';
import './App.css';
import Authentication from './Components/Authentication/Authentication';
import HomePage from './Components/HomePage';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUserProfile } from './Store/Auth/Action';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';

import darkTheme from './Theme/DarkTheme';
import lightTheme from './Theme/LightTheme';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import VerifiedSuccess from './Components/VerifiedSuccess/VerifiedSuccess';

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const jwt = localStorage.getItem("jwt");
  const [currentThemeState, setCurrentThemeState] = useState("");

  useEffect(() => {
    if (jwt) {
      dispatch(getUserProfile(jwt));
    }
  }, [jwt, dispatch]);

  useEffect(() => {
    setCurrentThemeState(localStorage.getItem("theme"));
  }, [currentTheme]);

  return (
    <ThemeProvider theme={currentTheme === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box>
        <Routes>
          {/* Public Routes */}
          <Route path='/signin' element={<Authentication />} />
          <Route path='/signup' element={<Authentication />} />
          <Route path='/verified' element={<VerifiedSuccess />} />

          {/* Protected Routes */}
          <Route
            path='/*'
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
