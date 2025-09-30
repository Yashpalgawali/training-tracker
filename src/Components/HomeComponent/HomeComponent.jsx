 
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

import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useEffect } from "react";
import { getAllEmployeeTrainings } from "../api/EmployeeTrainingApiService";
 
// const data = [
//   { competency: "Leadership", percentage: 85, employees: 120 },
//   { competency: "Technical", percentage: 92, employees: 200 },
//   { competency: "Communication", percentage: 78, employees: 150 },
//   { competency: "Problem Solving", percentage: 88, employees: 170 },
//   { competency: "Teamwork", percentage: 95, employees: 220 }
// ];


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];


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
 const [data,setData] = useState([])
    useEffect(()=>{
      getAllEmployeeTrainings().then((response)=> {
        console.log(response.data)
        //setData(response.data)
      })  
    },[])
    
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
        <div className="container"  >
          <Box>
            <Typography gutterBottom variant="h4">Welcome</Typography>
            <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        {/* Pie for Employee Counts */}
        <Pie
          data={data}
          dataKey="employees"
          nameKey="competency"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#82ca9d"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-emp-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        {/* Pie for Competency % (inner ring) */}
        <Pie
          data={data}
          dataKey="percentage"
          nameKey="competency"
          cx="50%"
          cy="50%"
          innerRadius={130}
          outerRadius={160}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-perc-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <RechartsTooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>

                 
            </Box>
        </div>
    )
}