import HomeIcon from '@mui/icons-material/Home'
import ExploreIcon from '@mui/icons-material/Explore'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MessageIcon from '@mui/icons-material/Message'
import GroupIcon from '@mui/icons-material/Group'
import SchoolIcon from '@mui/icons-material/School'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

export const navigationMenu = [
    {
        title: "Home",
        icon: <HomeIcon />,
        path: "/"
    },
    {
        title: "Explore",
        icon: <ExploreIcon />,
        path: "/explore"
    },
    {
        title: "Notifications",
        icon: <NotificationsIcon />,
        path: "/notifications"
    },
    {
        title: "Messages",
        icon: <MessageIcon />,
        path: "/messages"
    },
    {
        title: "Communities",
        icon: <GroupIcon />,
        path: "/communities"
    },
    {
        title: "Skill Sharing",
        icon: <SchoolIcon />,
        path: "/skill-sharing"
    },
    {
        title: "Profile",
        icon: <AccountCircleIcon />,
        path: "/profile/:id"
    }
] 