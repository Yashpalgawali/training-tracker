 
import "./Homecomponent.css"  
import Box from '@mui/material/Box';
import {  useState , useEffect} from "react";

import {  Typography } from "@mui/material";

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

import { getAllEmployeeTrainingsForChart } from "../api/EmployeeTrainingApiService";
 

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

export default function HomeComponent() {
    
    const [data,setData] = useState([])
    const [username,setUsername] = useState('')

    useEffect(()=> {
      let name = localStorage.getItem('username')    
      setUsername(name)
      
      getAllEmployeeTrainingsForChart().then((response)=> {       
          setData(response.data)
        })
      },[])
     
    return (
        <div className="container"  >
          <Box>
            <Typography gutterBottom variant="h4">Welcome {username}</Typography>
            
            <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="training_name" />
                    <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="comp25" fill="#f57c00" name="25%" />
                    <Bar dataKey="comp50" fill="#fbc02d" name="50%" />
                    <Bar dataKey="comp75" fill="#1976d2" name="75%" />
                    <Bar dataKey="comp100" fill="#388e3c" name="100%" />                   
                    
                  </BarChart>
            </ResponsiveContainer>
            </Box>
        </div>
    )
}