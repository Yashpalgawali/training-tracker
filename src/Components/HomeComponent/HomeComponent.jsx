import { Link } from "react-router-dom";
import "./Homecomponent.css" 
import EmployeeComponent from "../Employee/EmployeeComponent";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import { useState } from "react";

export default function HomeComponent() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    function openFunction(text){
     console.log( text)
     let val = Object.values(text) 
     alert(val)
    //  if(val=="Companies") {
    //   alert('Companuies called')
    //  }

    //   if(text=='Departments') {
    //   alert('Departments called')
    //  }
    //   if(text=='Trainings') {
    //   alert('Trainings called')
    //  }
    }
    
    const DrawerList = (
    <Box sx={{ width: 200 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Companies', 'Departments', 'Trainings', 'Employee'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} onClick={()=>openFunction({text})} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );
    return (
        <div className="container-fluid"  >
             <div className="sidebar">
               
                <Button onClick={toggleDrawer(true)} variant="contained" color="secondary" size="130px">Menu</Button>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
             </div>
            
        </div>
    )
}