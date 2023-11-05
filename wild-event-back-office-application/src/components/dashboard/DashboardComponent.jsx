import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Box, Toolbar, List } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import itemList from "./DashboardElements";
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
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      fontSize: fontSizeScale,
                    }}
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
