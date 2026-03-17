 
import "./Homecomponent.css"  
import Box from '@mui/material/Box';
import {  useState , useEffect} from "react";

import {  Button, Grid, Paper, Typography } from "@mui/material";

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

import AOS from "aos";
import "aos/dist/aos.css";
import { gsap } from "gsap";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

export default function HomeComponent() {

    const [data,setData] = useState([])
    const [username,setUsername] = useState('')

    useEffect(()=> {
      
      let name = localStorage.getItem('username')    
      setUsername(name)
        
      getAllEmployeeTrainingsForChart().then((response)=> {       
          setData(response.data)
           // 🔥 IMPORTANT: trigger resize after data load
          // setTimeout(() => {
          //   window.dispatchEvent(new Event('resize'));
          // }, 300);
        })
      
       AOS.init({ duration: 1000 });

        gsap.from(".chart-card", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.3
        });

        Fancybox.bind("[data-fancybox]", {});  
      },[] )

      useEffect(() => {
              gsap.from(".kpi-cards > div", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2
              });
        }, [data]);

        function exportToExcel(){}
        function exportToPDF(){}
    return (
          
          // <Box className="chart-cards" data-aos="fade-up">
          //   <Typography gutterBottom variant="h4" data-aos="fade-right">Welcome {username}</Typography>

          //   <ResponsiveContainer width="100%" height={400} >
          //         <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          //           <CartesianGrid strokeDasharray="3 3" />
          //           <XAxis dataKey="training_name" />
          //           <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
          //           <Tooltip />
          //           <Legend />
          //           <Bar dataKey="comp25" fill="#f57c00" name="25%" />
          //           <Bar dataKey="comp50" fill="#fbc02d" name="50%" />
          //           <Bar dataKey="comp75" fill="#1976d2" name="75%" />
          //           <Bar dataKey="comp100" fill="#388e3c" name="100%" />                   

          //         </BarChart>
          //   </ResponsiveContainer>
          // </Box>
          <Box p={2}>
              {/* Header */}
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h4" data-aos="fade-right">Welcome {username}</Typography>
                {/* <Box>
                  <IconButton onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                </Box> */}
              </Box>

              {/* Export Buttons */}
              {/* <Box mt={2} gap={2} display="flex" >
                <Button variant="contained" sx={{boxShadow: 10 }}  onClick={exportToExcel}>Export Excel</Button>
                <Button variant="contained" color="inherit"  onClick={exportToPDF}>Export PDF</Button>
              </Box> */}

              {/* Chart */}
              <Box mt={3}   >
                <ResponsiveContainer width="100%" height={400} >
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

              <Grid container spacing={2} mt={2}  data-aos="fade-up">
                    {[
                      { label: "Total Trainings", value: data.length },
                      { label: "Completed", value: data.filter(d => d.comp100 > 0).length },
                      { label: "In Progress", value: data.filter(d => d.comp25 || d.comp50 || d.comp75).length }
                    ].map((item, i) => (
                      <Grid item xs={12} md={4} key={i}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h6">{item.label}</Typography>
                          <Typography variant="h4">{item.value}</Typography>
                        </Paper>
                      </Grid>
                    ))}
              </Grid>

              {/* Dialog */}
              {/* (same as above) */}
            </Box>
    )
}