 
import "./Homecomponent.css"  
import Box from '@mui/material/Box'; 
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
 
import { useState } from "react"; 

import { Typography } from "@mui/material";
 

export default function HomeComponent() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    function openFunction(text){
     console.log( text)
     let val = Object.values(text) 
     alert(val)
  
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
       
    </Box>
  );
    return (
        <div className="container-fluid"  >
          <Box>
            <Typography gutterBottom variant="h4">Welcome</Typography>
          </Box>
              
            
        </div>
    )
}