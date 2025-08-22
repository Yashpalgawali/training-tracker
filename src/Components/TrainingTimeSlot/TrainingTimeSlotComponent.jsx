import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ErrorMessage,  Formik,Form } from "formik"
import { Box, Button, TextField, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"
import { retrieveTrainingTimeSlotById, saveTrainingTimeSlot, updateTrainingTimeSlot } from "../api/TrainingTimeSlotApiService"

export default function TrainingTimeSlotComponent () {

    const {id} =  useParams()
    const [training_time_slot ,setTrainingTimeSlot] = useState('')
    const [training_time_slot_id ,setTrainingTimeSlotId] = useState('')
    const navigate = useNavigate()
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
       

    function onSubmit(values) {
        setIsDisabled(true)
            const trainingTimeSlot = {
                training_time_slot_id : id , training_time_slot: values.training_time_slot
            }

            setTimeout(() => {
                setIsDisabled(false)
            }, 1000);

            if(id == -1) {
                saveTrainingTimeSlot(trainingTimeSlot)
                    .then((response)=> {
                        showToast(response?.data?.responseMessage,"success")
                        navigate('/trainingtimeslots')
                        })
                    .catch((error) => {   
                        showToast(error?.data?.errorMessage,"error")
                        navigate('/trainingtimeslots')
                    }) 
            }
            else {
                updateTrainingTimeSlot(trainingTimeSlot)
                    .then((response)=> {
                        showToast(response?.data?.responseMessage,"success")
                        navigate('/trainingtimeslots')
                    })
                    .catch((error) => {
                        showToast(error?.data?.errorMessage,"error")
                        navigate('/trainingtimeslots')
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
        <div className="container">
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
                        <Box
                                sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                                noValidate
                                autoComplete="off"
                                >
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
                               
                        </Box>

                         <Box className="btnvalue">
                                    <Button
                                        type="submit"
                                        style={{ float: 'left' }}
                                        variant="contained"
                                        color="primary"                                   
                                    >
                                    {btnValue}
                                    </Button>                                    
                         </Box>
                    </Form>
                  )
               }
            </Formik>
        </div>
    ); 
 
}