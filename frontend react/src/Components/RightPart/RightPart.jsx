import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../../Store/Theme/Action";
import { searchUser } from "../../Store/Auth/Action";
import { useNavigate } from "react-router-dom";

const RightPart = () => {
  const { theme, auth } = useSelector((store) => store);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeTheme = () => {
    dispatch(changeTheme(theme.currentTheme === "dark" ? "light" : "dark"));
  };

  const handleSearchUser = (event) => {
    setSearch(event.target.value);
    dispatch(searchUser(event.target.value));
  };

  const navigateToProfile = (id) => {
    navigate(`/profile/${id}`);
    setSearch("");
  };

  return (
    <div className="py-5 sticky top-0 h-screen">
      <div className="relative flex items-center bg-transparent">
        <div className="flex items-center w-full">
          <div className="relative flex-grow">
            <input
              value={search}
              onChange={handleSearchUser}
              type="text"
              placeholder="Search"
              className={`py-3 rounded-full outline-none text-gray-500 w-full pl-12 ${
                theme.currentTheme === "light" ? "bg-slate-300" : "bg-[#151515]"
              }`}
            />
            <span className="absolute left-0 top-0 pl-3 pt-3">
              <SearchIcon className="text-gray-500" />
            </span>
          </div>
          <Brightness4Icon
            onClick={handleChangeTheme}
            className="ml-3 cursor-pointer"
          />
        </div>

        {search && (
          <div
            className={`overflow-y-scroll hideScrollbar absolute z-50 top-14 border-gray-700 max-h-[70vh] w-full rounded-md ${
              theme.currentTheme === "light"
                ? "bg-white"
                : "bg-[#151515] border"
            }`}
          >
            {auth.searchResult.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateToProfile(item.id)}
                className="flex items-center hover:bg-slate-800 p-3 cursor-pointer"
              >
                <Avatar alt={item.fullName} src={item.image} />
                <div className="ml-2">
                  <p>{item.fullName}</p>
                  <p className="text-sm text-gray-400">
                    @{item.fullName.split(" ").join("_").toLowerCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPart; 