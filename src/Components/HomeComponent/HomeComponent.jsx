 
import "./Homecomponent.css"  
import Box from '@mui/material/Box'; 
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home'; 
import { useContext, useState } from "react"; 

import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { useEffect } from "react";
import { getAllEmployeeTrainingsForChart } from "../api/EmployeeTrainingApiService";
 

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

export default function HomeComponent() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    function openFunction(text) {
      console.log( text)
      let val = Object.values(text) 
      alert(val)      
    }

    const [data,setData] = useState([])

    useEffect(()=> {

      getAllEmployeeTrainingsForChart().then((response)=> {
        console.log(response.data)
        
        setData(response.data)
      })
    },[])
    
  //   const DrawerList = (
  //   <Box sx={{ width: 200 }} role="presentation" onClick={toggleDrawer(false)}>
  //     <List>
  //       {['Companies', 'Departments', 'Trainings', 'Employee'].map((text, index) => (
  //         <ListItem key={text} disablePadding>
  //           <ListItemButton>
  //             <ListItemIcon>
  //               {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //             </ListItemIcon>
  //             <ListItemText primary={text} onClick={()=>openFunction({text})} />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
       
  //   </Box>
  // );
    return (
        <div className="container"  >
          <Box>
            <Typography gutterBottom variant="h4">Welcome</Typography>
             
              {/* <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="training_name" />
                <YAxis />
                <Tooltip />
                <Legend />

                {/* Each competency as its own bar */}
                {/* <Bar dataKey="comp25" fill="#ff9999" name="25% Competency" />
                <Bar dataKey="comp50" fill="#ffcc66" name="50% Competency" />
                <Bar dataKey="comp75" fill="#99ccff" name="75% Competency" />
                <Bar dataKey="comp100" fill="#66cc99" name="100% Competency" />
              </BarChart>
            </ResponsiveContainer> } */}
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={data}   // [{ trainingName:"Fire Fighting", competency:25, employees:3 }, ...]
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* Y-axis → competency values */}
                  <YAxis dataKey="competency" type="category" />
                  {/* X-axis → employee counts */}
                  <XAxis type="number" />
                  <RechartsTooltip />
                  <Legend />

                  {/* Each training has its own color */}
                  <Bar dataKey="emp" name="Employees" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
        </div>
    )
}