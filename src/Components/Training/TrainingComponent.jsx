import $ from 'jquery'; // jQuery is required for DataTables to work
  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality

import { Box, Button, CircularProgress, TextField, Tooltip,Typography } from "@mui/material"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getTrainingById, saveTraining, updateTraining } from "../api/TrainingApiService"
import { showToast } from "../SharedComponent/showToast"
import EditIcon from '@mui/icons-material/Edit';
import { retrieveAllTraining } from "../api/TrainingApiService"

import * as Yup from "yup"
import { toast } from 'react-toastify';

export default function TrainingComponent() {
    const [btnValue,setBtnValue] = useState('Add Training')
    const [training_id,setTrainingId] = useState('')
    const [training_name,setTrainingName] = useState('')
    const [isDisabled,setIsDisabled] = useState(false)

    const {id} = useParams()

    const navigate = useNavigate()

    const [training_list,setTrainingList] = useState([])
         
        const tableRef = useRef(null); // Ref for the table
       
        const didFetchRef = useRef(false);
        
        useEffect(() => {
            if (!didFetchRef.current) {
                didFetchRef.current = true;
                retrieveAllTrainings();
            }
        }, []);
    
        function retrieveAllTrainings() {        
            retrieveAllTraining().then((response)=> {             
                setTrainingList(response.data)
            }).catch((error)=>{           
               toast.error(error?.response?.data?.errorMessage)               
            })
        }
    
         useEffect(() => {
            // Initialize DataTable only after the component has mounted
            if (tableRef.current && training_list.length >0 ) {
              $(tableRef.current).DataTable(); // Initialize DataTables
            }
          }, [training_list]); // Re-initialize DataTables when activities data changes
    
    useEffect(()=> {
        if(id != -1)
        {
            setBtnValue('Update Training')
            getTrainingById(id).then((response) => {
                setTrainingId(response.data.training_id)
                setTrainingName(response.data.training_name)
            })
        }        
    },[id])

    function onSubmit(values) {
        setIsDisabled(true)
        let training = {
            training_id : values.training_id,
            training_name : values.training_name
        }

        if(id == -1) {
            saveTraining(training).then((response) => {
                toast.success(response?.data?.responseMessage)
                setIsDisabled(false)
                retrieveAllTrainings()
                setTrainingName("")
                navigate(`/training/-1`)
            })
            .catch((error)=>{
                toast.error(error?.data?.errorMessage)
                setIsDisabled(false)
                setTrainingName("")
                navigate(`/training/-1`)
            })
        }
        else {
           updateTraining(training).then((response) => {
                toast.success(response?.data?.responseMessage)
                setIsDisabled(false)
                retrieveAllTrainings()
                setBtnValue("Add Training")
                setTrainingName("")
                navigate(`/training/-1`)
            })
            .catch((error)=>{
                setIsDisabled(false)
                toast.error(error?.data?.errorMessage)
                setTrainingName("")
                retrieveAllTrainings()
                setBtnValue("Add Training")
                navigate(`/training/-1`)
            }) 
        }
    }

    const validationSchema = Yup.object({
        training_name : Yup.string()
                        .required('Please Enter Training Name ')
    })

    return(
         <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", p: 2 }}>         
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>               
            
               <Formik
                    initialValues={ { training_id, training_name } }
                    enableReinitialize={true}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
               >
                {
                     (props) => (
                        <Form>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                        id="training_name"
                                        name="training_name"
                                        label="Training Name"
                                        variant="standard"
                                        placeholder="Enter Training Name"
                                        value={props.values.training_name}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        error={props.touched.training_name && Boolean(props.errors.training_name)}
                                        helperText={<ErrorMessage name="training_name" />}
                                        fullWidth />
                            </Box>
                             <Box className="btnvalue">
                                    <Button
                                        type="submit"
                                        style={{ float: 'left' }}
                                        variant="contained"
                                        color="primary"
                                        disabled={isDisabled}
                                         startIcon= {
                                                    isDisabled ? <CircularProgress size={20} color="teal" /> : null
                                                    }  
                                    >
                                    {btnValue}
                                    </Button>
                           </Box>
                        </Form>
                     )
                }
               </Formik>
              
            <Box sx={{ marginTop : "50px"}}>
                    <Typography variant="h4" gutterBottom>View Trainings </Typography>
                <table ref={tableRef} className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Sr</th>
                            <th>Training</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        (training_list.length == 0) ? (
                            <tr>
                                <td colSpan={3}> No Data Available</td>
                            </tr>
                        ) : (
                            training_list.map((train,index)=>(
                                <tr key={train.training_id}>
                                    <td> {index+1} </td>
                                    <td>{train.training_name}</td>
                                    <td>
                                        <Button variant="contained" color="success" className="m-2"  onClick={()=> navigate(`/training/${train.training_id}`)}> <Tooltip title={`Update ${train.training_name}`} placement="left" arrow><EditIcon /> &nbsp;Update</Tooltip></Button>
                                    </td>
                                </tr>
                            ))
                        )
                    }
                    </tbody>
                </table>
            </Box>
        </Box>
    )
}