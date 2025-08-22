import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { getCompetency, getTrainingsByEmployeeId, getTrainingsHistoryByEmployeeId, updateCompletionDate, updateTrainingDateAndCompetency } from "../api/EmployeeTrainingApiService";

import { showToast } from "../SharedComponent/showToast"
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import $ from 'jquery'; // jQuery is required for DataTables to work
import { Button, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"; 

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CircularProgress, Box } from '@mui/material';

import  EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend
} from "recharts";
import { retrieveAllCompetencies } from "../api/CompetencyApiService";
import { retrieveAllTrainingTimeSlots } from "../api/TrainingTimeSlotApiService";
 

const customStyles = {
            menu  : (provided) => ({
                ...provided,
                backgroundColor : "White",   // solid background
                zIndex : 9999                // keeps it above other elements
            }),
            option :(provided,state) => ({
                ...provided,
                backgroundColor : state.isFocused ? "#f0f0f0" : "White", // hover effect
                color : "black"
            })
    }

export default function ViewEmployeeTrainings() {

    const [traininglist,setTrainingList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scoreList ,setScoreList] = useState([])
    const [score,setScore] = useState('')
    const [trainTimeSlot,setTrainTimeSlot]  = useState([])

    const {id} = useParams();
    const navigate = useNavigate()
    const didFetchRef = useRef(false)
    const tableRef = useRef(false)
    const dtInstanceRef = useRef(null); // to store DataTable instance
    
    const [data, setData] = useState([]); 

    const [employee,setEmployee] = useState({
        emp_name : '',
        emp_code : '',
        department : {
            dept_name : ''
        },
        designation : {
            desig_name : ''
        }
    })

     useEffect(()=> {
        retrieveAllTrainingTimeSlots().then((response) => {
            setTrainTimeSlot(response.data)
        })
        
         retrieveAllCompetencies().then((response) => {
            setScoreList(response.data)
         })

          getCompetency(id).then((response)=>{ 
            setData(response.data)
          }).catch((error) => {
            alert('failed')
            
          })
        } , [id])

    useEffect(() => {
           if (tableRef.current && traininglist.length > 0) {
            // Destroy old instance before reinitializing
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }

            dtInstanceRef.current = $(tableRef.current).DataTable({
                // You can add options here if needed
            });
         }
    }, [traininglist] )
 
    useEffect(
    () => 
        {
            if (!didFetchRef.current) {
                didFetchRef.current = true;                            
                getTrainingsByEmpId()
            }
        },[id])

         const  getUpdatedTrainingsByEmpId = () => {
           
                getTrainingsByEmployeeId(id).then((response) => {
                    
                    setEmployee(response.data[0].employee)                
                    setTrainingList(response.data)
                });
        };

    function getTrainingsByEmpId() {
        setLoading(true);
        getTrainingsByEmployeeId(id).then((response) => {
                setEmployee(response.data[0].employee)                
                setTrainingList(response.data)
       })
       .catch((error) => {
            showToast("No Trainings are given ","error")
            navigate(`/viewemployees`)
       })
       .finally(() => {
            setLoading(false);
        });
    }

    const [open, setOpen] = useState(false);

    const handleClickOpen = (id) => {

          sessionStorage.setItem('hist_id',id)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event) => {

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        const training_date = formJson.training_date;
        const competency_id = formJson.competency_id;
        const training_time_id = formJson.training_time_slot_id;

        const histid = sessionStorage.getItem('hist_id')

        updateTrainingDateAndCompetency(histid,training_date,competency_id,training_time_id).then(
            (response) => {
                        getUpdatedTrainingsByEmpId()
                        showToast(response.data.responseMessage,"success")
                        setSelectedCompetency(null)
                        setSelectedTimeSlot(null)
                        sessionStorage.removeItem('hist_id')
                        navigate(`/training/employee/${id}`)
            }
        ).catch((error) => {
             showToast(error.response.data.errorMessage,"error")
        })
        handleClose();
    };

    function downloadTrainingHistory(id) { 

            getTrainingsHistoryByEmployeeId(id).then((response) => {
                // Convert the array buffer to a Blob
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // Create a link element to trigger download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'Training History - '+employee.emp_name+'.xlsx';
                link.click();
        })
    }

     const handleChange = (event) => {
        
            setScore(event.target.value); // sets competency_id
        };
const [selectedCompetency, setSelectedCompetency] = useState("");
const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

const handleCompetencyChange = (event) => {
  setSelectedCompetency(event.target.value);
};

const handleTimeSlotChange = (event) => {
  setSelectedTimeSlot(event.target.value);
};
    return (
      <div className="container">
        <div className="mb-2">
            <Box>
                <Typography variant="h4" gutterBottom>View Employee Trainings
                    
                        <Button variant="contained" color="success" style={ { float : 'right' } } onClick={()=>downloadTrainingHistory(id)}> <DownloadIcon /> Download</Button>
                     
                </Typography>
            </Box>
            
            <div >
                <div style={{ float : 'left' }}  className="mb-3">
                    <label htmlFor="" >Name:</label><strong> {employee.emp_name}</strong>
                </div>
                <div style={{ float : 'right' }}>
                    <label htmlFor="" >Designation:</label><strong> {employee.designation.desig_name}</strong>
                </div>
                <div style={{ float : 'left' , clear : 'both'}} className="mb-3">
                    <label htmlFor="" >Department:</label><strong> {employee.department.dept_name}</strong>
                </div>
            </div>
        </div>
        <div><Divider></Divider>
            </div>
        <div   className="mb-5">
                <Typography variant="h5" gutterBottom>Competency Chart</Typography>
                <RadarChart
                  cx={300}
                  cy={250}
                  outerRadius={150}
                  width={1320}
                  height={500}
                  data={data}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Training"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.7}
                  />
                  <Tooltip />
                  <Legend /> 
                </RadarChart>
              </div>
        <div  >
            {
                loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : (
            <table ref={tableRef} className="table table-hover table-striped">
                <thead>
                    <tr>
                        <th>Sr</th>
                        <th>Training</th>
                        <th>Start Date</th>
                        <th>Complete Date</th>
                        <th>Time Slot</th>
                        <th>Competency Score</th>
                        <th>Action</th>                    
                    </tr>
                </thead>
                <tbody>
                    {

                    traininglist.length===0 ? (
                        <tr>
                            <td colSpan={4}>No Trainings are Given </td>
                        </tr>
                    ) : 
                    (
                        traininglist.map(
                            (training,index) => (
                                            <tr key={training.emp_train_id}>
                                                <td>{index+1}</td>
                                                <td>{training.training.training_name}</td>
                                                <td>{training?.training_date}</td>
                                                <td>{training.completion_date ? (training.completion_date): (<span style={{ color : 'red'}}> Not Completed</span>)} </td>
                                                <td>{training?.trainingTimeSlot.training_time_slot}</td>
                                                <td>{training.competency.score}</td>
                                                <td> 
                                                    <Button variant="contained" color="primary" onClick={()=>handleClickOpen(training.emp_train_id)}>{training.emp_train_hist_id} <EditIcon /> Update</Button>
                                                    
                                                </td>
                                            </tr>
                            )
                        )
                    )
                }
                </tbody>
            </table>
            )}
        </div>

         <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Completion Time</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <DialogContentText>
                Update completion date of the Training 
          </DialogContentText>
          
          <form onSubmit={handleSubmit} >
                       
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker label="Training Date" format="DD-MM-YYYY" closeOnSelect={true} name="training_date" />

            </DemoContainer>
             <DemoContainer components={['Select']}>
                  <InputLabel id="demo-simple-select-competency-label">Competency</InputLabel>
                        <Select
                            fullWidth
                            name="competency_id"
                            labelId="competency-select-label"
                            value={selectedCompetency}
                            onChange={handleCompetencyChange}
                        >
                            {scoreList.map((item) => (
                            <MenuItem key={item.competency_id} value={item.competency_id}>
                                {item.score}
                            </MenuItem>
                            ))}
                        </Select>
            </DemoContainer>
                    {/* Time Slot Select */}
                <DemoContainer components={['Select']}>
                    <InputLabel id="time-slot-select-label">Time Slot</InputLabel>
                        <Select
                            fullWidth
                             name="training_time_slot_id"
                            labelId="time-slot-select-label"
                            value={selectedTimeSlot}
                            onChange={handleTimeSlotChange}
                        >
                            {trainTimeSlot.map((time) => (
                            <MenuItem key={time.training_time_slot_id} value={time.training_time_slot_id}>
                                {time.training_time_slot}
                            </MenuItem>
                            ))}
                    </Select>
                </DemoContainer>
            
            </LocalizationProvider>

                
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Update Completion Date</Button>
            </DialogActions>
          </form>
           
        </DialogContent>
      </Dialog>
      </div>
    )
}