import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { getTrainingsByEmployeeId, getTrainingsHistoryByEmployeeId, updateCompletionDate } from "../api/EmployeeTrainingApiService";

import { showToast } from "../SharedComponent/showToast"
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import $, { data, error } from 'jquery'; // jQuery is required for DataTables to work
import { Button, Typography } from "@mui/material";
import dayjs from "dayjs";

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

export default function ViewEmployeeTrainings() {

    const [traininglist,setTrainingList] = useState([]);
    const [loading, setLoading] = useState(false);

    const {id} = useParams();
    const navigate = useNavigate()
    const didFetchRef = useRef(false)
    const tableRef = useRef(false)
    const dtInstanceRef = useRef(null); // to store DataTable instance
    
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
       
        const completion_date = formJson.completion_date;
        const histid = sessionStorage.getItem('hist_id')
       
        updateCompletionDate(histid,completion_date).then((response)=> {
            getUpdatedTrainingsByEmpId() 
            console.log('success', response)
             showToast(response.data.responseMessage,"success")
            navigate(`/training/employee/${id}`)
        }).catch((error) => {
            console.log('ERROR', error)
             showToast(error.response.data.errorMessage,"error")
        })
        handleClose();
    };

    function downloadTrainingHistory(id) { 
     
            getTrainingsHistoryByEmployeeId(id).then((response)=> {
                // Convert the array buffer to a Blob
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // Create a link element to trigger download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'Training History - '+employee.emp_name+'.xlsx';
                link.click();
        })
    }

    return (
      <div className="container">
        <div>
            <Box>
                <Typography variant="h4" gutterBottom>View Employee Trainings
                    <Button variant="contained" color="success" style={ { float : 'right' } } onClick={()=>downloadTrainingHistory(id)}> <DownloadIcon /> Download</Button>
                </Typography>
            </Box>
            
            <div>
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
        <div>
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
                        {/* <th>Time Slot</th> */}
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
                                            <tr key={training.emp_train_hist_id}>
                                                <td>{index+1}</td>
                                                <td>{training.training.training_name}</td>
                                                <td>{training?.training_date}</td>
                                                <td>{training.completion_date ? (training.completion_date): (<span style={{ color : 'red'}}> Not Completed</span>)} </td>
                                                {/* <td>{training?.training_time_slot}</td> */}
                                                <td> 
                                                    <Button variant="contained" color="primary" onClick={()=>handleClickOpen(training.emp_train_hist_id)}> <EditIcon /> Update</Button>
                                                    
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
          <form onSubmit={handleSubmit}>
                       
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker label="Completion Date" format="DD-MM-YYYY" closeOnSelect={true} name="completion_date" />
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