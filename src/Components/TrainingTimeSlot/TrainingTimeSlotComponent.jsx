import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ErrorMessage,  Formik,Form } from "formik"
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"
import { retrieveAllTrainingTimeSlots, retrieveTrainingTimeSlotById, saveTrainingTimeSlot, updateTrainingTimeSlot } from "../api/TrainingTimeSlotApiService"
import EditIcon from '@mui/icons-material/Edit';

import $ from 'jquery'; // jQuery is required for DataTables to work
  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { toast } from "react-toastify"

export default function TrainingTimeSlotComponent () {

    const {id} =  useParams()
    const [training_time_slot ,setTrainingTimeSlot] = useState('')
    const [training_time_slot_id ,setTrainingTimeSlotId] = useState('')
    
    const [isDisabled, setIsDisabled] = useState(false)
    const [btnValue, setBtnValue] = useState('Add Training Time Slot')

    useEffect(()=> {
        const getTrainingTimeSlotById = async() => {
             
            if(id != -1) {
                setBtnValue('Update Training Time Slot')         
                retrieveTrainingTimeSlotById(id).then((response) => {
                    setTrainingTimeSlot(response.data?.training_time_slot)
                    setTrainingTimeSlotId(response.data?.training_time_slot_id)
                })
                .catch((error)=> { 
                    sessionStorage.setItem('reserr',error.response.data.errorMessage)
                    navigate(`/trainingtimeslots`)
                })
        }
        };

        if(id){
            getTrainingTimeSlotById()
        }
    }, [id] ) 
       
 const [trainingTimeSlotList,setTrainingTimeSlotList] = useState([])

    const tableRef = useRef(null); // Ref for the table
    const navigate = useNavigate()

    useEffect(()=> refreshTrainingTimeSlots() , [] )
    
    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && trainingTimeSlotList.length > 0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [trainingTimeSlotList]); // Re-initialize DataTables when activities data changes

    function refreshTrainingTimeSlots() {
     
        retrieveAllTrainingTimeSlots().then((response)=> {
            setTrainingTimeSlotList(response.data)
        }).catch((error) => {             
             toast.error(error?.data?.errorMessage)
        })
    }  

    function addNewTrainingTimeSlot() {
        navigate(`/trainingtimeslot/-1`)
    }

    function editTrainingTimeSlot(id) {
        navigate(`/trainingtimeslot/${id}`)
    }

    function onSubmit(values) {
        setIsDisabled(true)
        let new_id = Number(id)
            const trainingTimeSlot = {
                training_time_slot_id : new_id , 
                training_time_slot: values.training_time_slot
            }

            setTimeout(() => {
                setIsDisabled(false)
            }, 1000);

            if(id == -1) {
                 
                saveTrainingTimeSlot(trainingTimeSlot)
                    .then((response)=> {
                        toast.success(response?.data?.responseMessage)
                        refreshTrainingTimeSlots()
                        navigate(`/trainingtimeslot/-1`)
                        })
                    .catch((error) => {   
                        toast.error(error?.data?.errorMessage)
                        refreshTrainingTimeSlots()
                        navigate(`/trainingtimeslot/-1`)
                    }) 
            }
            else {
                updateTrainingTimeSlot(trainingTimeSlot)
                    .then((response)=> {
                        
                        toast.success(response?.data?.responseMessage)
                        refreshTrainingTimeSlots()
                         setTrainingTimeSlot("")
                        setBtnValue("Add Training Time Slot")
                        navigate(`/trainingtimeslot/-1`)
                    })
                    .catch((error) => {
                        toast.error(error?.data?.errorMessage)
                       
                        navigate(`/trainingtimeslot/-1`)
                    })                    
            }
         }
  
    function validate(values) {
        let errors = { }
  
        if(values.training_time_slot.length<2) {
            errors.training_time_slot = 'Please Enter at least 2 Characters'
        }
        return errors
   }

//     return (
//      <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DemoContainer
//         components={['MultiInputTimeRangeField', 'SingleInputTimeRangeField']}
//       >
//         <MultiInputTimeRangeField
//           slotProps={{
//             textField: ({ position }) => ({
//               label: position === 'start' ? 'From' : 'To',
//             }),
//           }}
//         />
//         <SingleInputTimeRangeField label="From - To" />
//       </DemoContainer>
//     </LocalizationProvider>
   
//   );
     return (
         <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", p: 2 }}>
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
            <Formik initialValues={ { training_time_slot_id,training_time_slot} }
                enableReinitialize={true}
                onSubmit={onSubmit}
                validate={validate}
                validateOnBlur={false}
                validateOnChange={false}
            >
               {
                (props) => (
                    <Form>                       
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField  id="training_time_slot"
                                            name="training_time_slot"
                                            label="Time Slot"
                                            variant="standard"
                                            placeholder="Enter Time Slot"
                                            value={props.values.training_time_slot}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.training_time_slot && Boolean(props.errors.training_time_slot)}
                                            helperText={<ErrorMessage name="training_time_slot" />}
                                            fullWidth />
                               
                          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
                                    <Button
                                        type="submit"                                         
                                        variant="contained"
                                        color="primary"                                   
                                    >
                                    {btnValue}
                                    </Button>
                        </Box>
                       </Box>
                    </Form>
                  )
               }
            </Formik>
                          
            <Box
                sx={{marginTop : "30px"}}
            >
                <Typography variant="h4" gutterBottom>View Training Time Slots  </Typography>
            </Box>

            <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Training Time Slot</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {trainingTimeSlotList.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        trainingTimeSlotList.map((training,index) => (
                            <tr key={training.training_time_slot_id}>
                            <td>{index+1}</td>
                            <td>{training.training_time_slot}</td>
                            <td>
                                <Button type="submit" variant="contained" color="success" onClick={() => editTrainingTimeSlot(training.training_time_slot_id)} > <Tooltip title="Update Training Time Slot" placement="left" arrow><EditIcon /> &nbsp;Update</Tooltip></Button>
                            </td>
                            </tr>
                        ))
                      )}
                </tbody>
            </table>
        </Box>         
            
    ); 
 
}