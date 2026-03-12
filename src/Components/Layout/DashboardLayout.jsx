import React, { useState } from "react";

import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  ListItemButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import LogoutIcon from '@mui/icons-material/Logout';
import DevicesIcon from "@mui/icons-material/Devices";
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import Groups3Icon from '@mui/icons-material/Groups3';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useAuth } from "../Security/AuthContext";

const drawerWidth = 200;

function DashboardLayout({ children }) {

  const [mobileOpen, setMobileOpen] = useState(false);
  const authContext = useAuth()
  
      const isAuthenticated = authContext.isAuthenticated
      
      function logout()
      {
          authContext.logout()        
      }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
    const navigate = useNavigate()


  const drawer = (
    <div>
      <Toolbar />
      <List>

        <ListItemButton button onClick={()=>navigate(`/home`)}>
          <ListItemIcon>
           <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard"  ></ListItemText>
        </ListItemButton>

         <ListItemButton button onClick={()=>navigate(`/companies`)}>
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText primary="Company" />
        </ListItemButton>

        <ListItemButton button onClick={()=>navigate(`/viewdepartments`)}>
          <ListItemIcon>
          <CorporateFareIcon />
          </ListItemIcon>
          <ListItemText primary="Department" />
        </ListItemButton>

        <ListItemButton button onClick={()=>navigate(`/train/employee/-1`)}>
          <ListItemIcon>
            {/* <DevicesIcon /> */}
          </ListItemIcon>
          <ListItemText primary="Train Employees" />
        </ListItemButton>

        <ListItemButton button onClick={()=>navigate(`/viewtraining`)}>
          <ListItemIcon>
             <DevicesIcon />
          </ListItemIcon>
          <ListItemText primary="Trainings" />
        </ListItemButton>

        <ListItemButton button onClick={()=>navigate(`/viewdesignations`)}>
          <ListItemIcon>
            {/* <DevicesIcon /> */}
          </ListItemIcon>
          <ListItemText primary="Designation" />
        </ListItemButton>

         <ListItemButton button onClick={()=>navigate(`/viewemployees`)}>
          <ListItemIcon>
            <Groups3Icon />
          </ListItemIcon>
          <ListItemText primary="Employees" />
        </ListItemButton>

        <ListItemButton button onClick={()=>navigate(`/viewcategories`)}>
          <ListItemIcon>
            <Groups3Icon />
          </ListItemIcon>
          <ListItemText primary="Category" />
        </ListItemButton>

        <ListItemButton button onClick={()=>navigate(`/trainingtimeslots`)}>
          <ListItemIcon>
            <Groups3Icon />
          </ListItemIcon>
          <ListItemText primary="Training Slots" />
        </ListItemButton>

        <ListItemButton button onClick={()=>navigate(`/competencies`)}>
          <ListItemIcon>
            <Groups3Icon />
          </ListItemIcon>
          <ListItemText primary="Competency" />
        </ListItemButton>
         <ListItemButton button onClick={()=>navigate(`/holidays`)}>
          <ListItemIcon>
            <Groups3Icon />
          </ListItemIcon>
          <ListItemText primary="Holiday" />
        </ListItemButton>

        <ListItemButton button onClick={logout}>
          <ListItemIcon>            
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>

      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>

      <CssBaseline />

      {/* Top Navbar */}

        <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
         
        }}
      >
        <Toolbar>

          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
             
          </IconButton>

          <Typography variant="h6" noWrap>
            Training Tracker System
          </Typography>

        </Toolbar>
      </AppBar> 

      {/* Sidebar */}

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >

        {/* Mobile Drawer */}

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
          open
        >
          {drawer}
        </Drawer>

      </Box>

      {/* Main Content */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >

        <Toolbar />

        {children}

      </Box>

    </Box>
  );
}

export default DashboardLayout;