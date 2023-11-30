import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Box, Toolbar, List } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EventIcon from "@mui/icons-material/Event";
import NotificationIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import MapIcon from "@mui/icons-material/Map";
import ChatIcon from "@mui/icons-material/Chat";
import Badge from '@mui/material/Badge';
import { useUser } from "../../services/providers/LoggedUserProvider";


export const DashboardComponent = () => {
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const isLg = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const drawerWidth = isMd ? 300 : isLg ? 350 : 240;
  const minFontSize = 16;
  const maxFontSizeMd = 30;
  const maxFontSizeLg = 30;
  const fontSizeScale = isMd
    ? maxFontSizeMd
    : isLg
    ? maxFontSizeLg
    : minFontSize;

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();


  const itemList = [
    { text: "Event management", icon: <EventIcon />, path: "/event-management/event", requiredRole: 'EVENT-MANAGEMENT' },
    { text: "My events", icon: <NotificationIcon />, path: "/my-events/event", requiredRole: 'MY-EVENTS' },
    { text: "Employee management", icon: <PersonIcon />, path: "/staff-management", requiredRole: 'EMPLOYEE-MANAGEMENT' },
    { text: "Map configuration", icon: <MapIcon />, path: "/map-config/map", requiredRole: 'MAP-CONFIGURATION' },
    { text: "Chat", icon: <ChatIcon />, path: "/chat" }
  ];

  const filteredItems = itemList.filter((item) =>
    !item.requiredRole || user.roles.map((role) => role.name).includes(item.requiredRole)
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          ["& .MuiDrawer-paper"]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
        <List>
            {filteredItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>
                    {item.unreadMessages && item.unreadMessages > 0 ? (
                      <Badge badgeContent={item.unreadMessages} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ fontSize: fontSizeScale }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={() => navigate("/logout")}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};
