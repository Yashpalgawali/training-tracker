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
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend
} from "recharts";
import { useEffect, useState } from "react"; 
import { getCompetency } from "../api/EmployeeApiService";
import { Typography } from "@mui/material";
 

export default function HomeComponent() {
    const [open, setOpen] = useState(false);

    const [data, setData] = useState([]); 
    
    useEffect(()=> {
      getCompetency().then((response)=>{ 
        setData(response.data)
      })
    } , [])

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
          <Box>
            <Typography gutterBottom variant="h4">Welcome</Typography>
          </Box>
             {/* <div className="sidebar">
               
                <Button onClick={toggleDrawer(true)} variant="contained" color="secondary" size="130px">Menu</Button>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
             </div> */}
              <div style={{ textAlign: "center"  }}>
                <h2>Competency Chart</h2>
                <RadarChart
                  cx={300}
                  cy={250}
                  outerRadius={150}
                  width={600}
                  height={500}
                  data={data}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Company"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </div>
            
        </div>
    )
}