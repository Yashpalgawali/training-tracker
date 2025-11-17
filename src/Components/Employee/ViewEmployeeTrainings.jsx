import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCompetency, getTrainingsByEmployeeId, getTrainingsCountByEmployeeTrainingId, getTrainingsHistoryByEmployeeId, updateCompletionDate, updateTrainingDateAndCompetency } from "../api/EmployeeTrainingApiService";

import { showToast } from "../SharedComponent/showToast"
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import $ from 'jquery'; // jQuery is required for DataTables to work
import { Button, Divider, InputLabel, MenuItem, Select, Typography } from "@mui/material"; 

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
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer
} from "recharts";
import { retrieveAllCompetencies } from "../api/CompetencyApiService";
import { retrieveAllTrainingTimeSlots } from "../api/TrainingTimeSlotApiService";

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

 const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
        ))(({ theme }) => ({
            [`& .${tooltipClasses.arrow}`]: {
                color: theme.palette.common.black,
            },
            [`& .${tooltipClasses.tooltip}`]: {
                backgroundColor: theme.palette.common.black,
            },
    }));
// const customStyles = {
//             menu  : (provided) => ({
//                 ...provided,
//                 backgroundColor : "White",   // solid background
//                 zIndex : 9999                // keeps it above other elements
//             }),
//             option :(provided,state) => ({
//                 ...provided,
//                 backgroundColor : state.isFocused ? "#f0f0f0" : "White", // hover effect
//                 color : "black"
//             })
//     }  

 
export default function ViewEmployeeTrainings() {

    const [traininglist,setTrainingList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scoreList ,setScoreList] = useState([])
    const [score,setScore] = useState('')
    const [trainTimeSlot,setTrainTimeSlot]  = useState([])
    const [trainingCount,setTrainingCount] = useState(0)
    const [addTrainingDisabled , setAddTrainingDisabled ] = useState(false)

    const {id} = useParams();
    const navigate = useNavigate()
    const didFetchRef = useRef(false)
    const tableRef = useRef(false)
    const dtInstanceRef = useRef(null); // to store DataTable instance
    
    const [data, setData] = useState([]); 

    const location = useLocation();
    
    const [employee,setEmployee] = useState({
        empName : '',
        empCode : '',
        department : {
            deptName : ''
        },
        designation : {
            desigName : ''
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
        } , [id,location.key])

    useEffect(() => {
           if (tableRef.current && traininglist.length > 0) {
            // Destroy old instance before reinitializing
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }

            dtInstanceRef.current = $(tableRef.current).DataTable({
                // You can add options here if needed
                responsive: true,
                scrollX: true // ensures horizontal scroll
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
                    if(response.data[0].employee.status!=1) {
                        setAddTrainingDisabled(true)
                    }
                    console.log(response.data)
                    setTrainingList(response.data)
                });
        };

    function getTrainingsByEmpId() {
        
        setLoading(true);
        getTrainingsByEmployeeId(id).then((response) => {
            if(response.data[0].employee.status!=1) {
                setAddTrainingDisabled(true)
            }
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
                link.download = 'Training History - '+employee.empName+'.xlsx';
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

    function addTrainingToEmployee(id) {
        navigate(`/train/employee/${id}`)
    }

function getTrainingCountByTrainingHistId(id) {
    
    getTrainingsCountByEmployeeTrainingId(id).then((response) => {
        console.log(response.data)
        setTrainingCount(response.data)
    })
   
}

    return (
      <div className="container">
        <div className="mb-2">
            <Box>
                <Typography variant="h4" gutterBottom>
                    <BootstrapTooltip title={`Give Training to ${employee.empName} `}>
                        <Button variant="contained" color="info" disabled={addTrainingDisabled} style={ { float : 'left' } } onClick={()=>addTrainingToEmployee(id)}> Give Training</Button>
                    </BootstrapTooltip>
                    View Employee Trainings
                    <BootstrapTooltip title= {`Download trainings given to ${employee.empName}`}>
                     <Button variant="contained" color="info" style={ { float : 'right' } } onClick={()=>downloadTrainingHistory(id)}> <CloudDownloadIcon style={{marginRight : '5px'}} /> Download</Button>
                          {/* <Button style={ { float : 'left' ,marginLeft : '5px'} }   variant="contained" color="info"  onClick={downloadSampleToUploadEmployee}><CloudDownloadIcon style={ { paddingRight : '5px'} } /> Sample  </Button> */}
                    </BootstrapTooltip>
                </Typography>
            </Box>
            
            <div>
                <div style={{ float : 'left' ,marginLeft: '5px'}}  className="mb-3 ">
                    <label htmlFor="" >Name:</label><strong> {employee.empName}</strong>
                </div>
                <div style={{ float : 'right' ,marginLeft: '5px'}}>
                    <label htmlFor="" >Designation:</label><strong> {employee.designation.desigName}</strong>
                </div>
                <div style={{ float : 'left' , clear : 'both'}} className="mb-3">
                    <label htmlFor="" >Department:</label><strong> {employee.department.deptName}</strong>
                </div>
            </div>
        </div>
        <div><Divider></Divider> </div>
        {/* <div className="mb-5"> */}
        <div style={{ width: "100%", height: 400 ,marginBottom: "100px"}}  >
                <Typography variant="h5" gutterBottom>Competency Chart</Typography>
                <ResponsiveContainer>
                <RadarChart key={data.length + JSON.stringify(data)}
                //   cx={300}
                //   cy={250}
                // outerRadius={150}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
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
                  <RechartsTooltip />
                  <Legend /> 
                </RadarChart>
                </ResponsiveContainer>
              </div>
        <div className="table-responsive mt-5 " >
            {
                loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : (
            <table ref={tableRef} className="table table-hover table-striped nowrap">
                <thead>
                    <tr>
                        <th>Sr</th>
                        <th>Training</th>
                        <th>Start Date</th>
                        <th>Complete Date</th>
                        <th>Time Slot</th>
                        <th>Competency Score</th>
                        <th>Total Trainings Given</th>
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
                                            <tr key={training.emp_train_id ?? index}>
                                                <td>{index+1}</td>
                                                <td>{training.training.training_name}</td>
                                                <td>{training?.training_date}</td>
                                                <td>{training.completion_date ? (training.completion_date): (<span style={{ color : 'red'}}> Not Completed</span>)} </td>
                                                <td>{training?.trainingTimeSlot.training_time_slot}</td>
                                                <td>{training.competency.score}</td>
                                                <td>{training.trainingCount}</td>
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

    <Dialog open={open} onClose={handleClose}     >
        <DialogTitle>Update Completion Time</DialogTitle>
        <DialogContent sx={{ paddingBottom: 2 }}>
          <DialogContentText>
                Update completion date of the Training 
          </DialogContentText>
          
          <form onSubmit={handleSubmit} >
                       
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker label="Training Date"  format="DD-MM-YYYY" closeOnSelect={true} name="training_date" />

            </DemoContainer>
             <DialogContentText> Competency  </DialogContentText>
             <DemoContainer components={['Select']}>
                
                  {/* <InputLabel id="demo-simple-select-competency-label">Competency</InputLabel> */}
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
                    <DialogContentText> Time Slot </DialogContentText>
                <DemoContainer components={['Select']}>
                    {/* <InputLabel id="time-slot-select-label">Time Slot</InputLabel> */}
                         
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