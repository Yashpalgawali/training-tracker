import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getDesignationById, saveDesignation, updateDesignation } from "../api/DesignationApiService"
import { Box, Button, TextField, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"

export default function DesignationComponent() {
    const [btnValue,setBtnValue] = useState('Add Designtion')
    const [desig_name,setDesigName]  = useState('')
    const [desig_id,setDesigId]  = useState('')

    const navigate = useNavigate()
    const {id} = useParams()

    useEffect( 
        () => {
            retrieveDesignationById()
        } , 
    )

    function retrieveDesignationById ()  {
        if(id != -1) {
            setBtnValue('Update Designation')
            getDesignationById(id).then((response) => {
                 setDesigName(response.data.desig_name)
                 setDesigId(response.data.desig_id)
            }).catch((error)=>{
                sessionStorage.setItem('reserr',error.response.data.errorMessage)
                navigate(`/viewdesignations`)
            }) 

        }
    }

    function validate(values) {
        
        let errors  = {} 

        if(values.desig_name.length<2) {
            errors.desig_name="Enter at least 3 characters"
        }
        return errors
    }

    function onSubmit(values) {
        let designation = {
            desig_id : id,
            desig_name : values.desig_name
        }
        if(id != -1) {
           
            updateDesignation(designation).then((response) => {
                showToast(response?.data?.responseMessage,"success")
                navigate(`/viewdesignations`)
            })
            .catch((error) => {
                showToast(error?.data?.errorMessage,"error")
                navigate(`/viewdesignations`)
            })
        }
        else {
            saveDesignation(designation).then((response) => {
                showToast(response?.data?.responseMessage,"success")
                navigate(`/viewdesignations`)
            })
            .catch((error) => {
                showToast(error?.data?.errorMessage,"error")
                navigate(`/viewdesignations`)
            })
        }
    }
    
    return(
        <div className="container">
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
            <Formik
                initialValues={ { desig_id  ,desig_name } }
                enableReinitialize={true}
                validate={validate}
                onSubmit={onSubmit}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {
                    (props) => (
                        <Form>
                            <Box
                                    sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                                    noValidate
                                    autoComplete="off"
                                    >
                                    <TextField  id="desig_name"
                                                name="desig_name"
                                                label="Designation Name"
                                                variant="standard"
                                                placeholder="Enter Designation Name"
                                                value={props.values.desig_name}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                error={props.touched.desig_name && Boolean(props.errors.desig_name)}
                                                helperText={<ErrorMessage name="desig_name" />}
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
             <br></br>  <br></br>  <br></br>  <br></br>  <br></br>
        </div>
    )
}