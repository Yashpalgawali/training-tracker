import { Box, Button, TextField, Typography } from "@mui/material"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getTrainingById, saveTraining, updateTraining } from "../api/TrainingApiService"
import { showToast } from "../SharedComponent/showToast"

import * as Yup from "yup"

export default function TrainingComponent() {
    const [btnValue,setBtnValue] = useState('Add Training')
    const [training_id,setTrainingId] = useState('')
    const [training_name,setTrainingName] = useState('')

    const {id} = useParams()

    const navigate = useNavigate()

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
        let training = {
            training_id : values.training_id,
            training_name : values.training_name
        }

        if(id == -1) {
            saveTraining(training).then((response) => {
                showToast(response?.data?.responseMessage,"success")
                navigate(`/viewtraining`)
            })
            .catch((error)=>{
                showToast(error?.data?.errorMessage,"error")
                navigate(`/viewtraining`)
            })
        }
        else {
           updateTraining(training).then((response) => {
                showToast(response?.data?.responseMessage,"success")
                navigate(`/viewtraining`)
            })
            .catch((error)=>{
                showToast(error?.data?.errorMessage,"error")
                navigate(`/viewtraining`)
            }) 
        }
    }

    function validate(values) {

        let errors = {} 
        if(values.training_name == '') {
            errors.training_name = 'Please Enter Training name'
        }
        return errors
    }

    const validationSchema = Yup.object({
        training_name : Yup.string()
                        .required('Please Enter Training Name ')
    })

    return(
        <div className="container">            
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>               
            <div>
               <Formik
                    initialValues={ { training_id, training_name } }
                    enableReinitialize={true}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={onSubmit}
                    // validate={validate}
                    validationSchema={validationSchema}
               >
                {
                     (props) => (
                        <Form>
                            <Box
                                 sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                                noValidate
                                autoComplete="off"
                            >
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
                                    >
                                    {btnValue}
                                    </Button>
                         </Box>
                        </Form> 

                     )
                }
               </Formik>
              
            </div>
        </div>
    )
}