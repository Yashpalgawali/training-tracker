 
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
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
        response.data.map((res) => (
          console.log(res)
        ))
        
        setData(response.data)
      })  
    },[])
// const data = [
//   { training: "SAP", employees: 120, trainings: 10, trained: 90, untrained: 30 },
//   { training: "Fire Training", employees: 200, trainings: 15, trained: 160, untrained: 40 },
//   { training: "SAP (PP Module)", employees: 150, trainings: 12, trained: 110, untrained: 40 }
  
// ];
    
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
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="training.training_name" />
                <YAxis />
                {/* <YAxis domain={[0, 100]} ticks={[0,25,50,75,100]} /> */}
                <RechartsTooltip />
                <Legend />

 <Bar dataKey="trainings" fill="#82ca9d" />
                {/* <Bar dataKey="employees" fill="#8884d8" />
                <Bar dataKey="trainings" fill="#82ca9d" />
                <Bar dataKey="trained" fill="#ffc658" />
                <Bar dataKey="untrained" fill="#ff7f50" /> */}
              </BarChart>
            </ResponsiveContainer>

            </Box>
        </div>
    )
}