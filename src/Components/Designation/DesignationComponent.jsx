import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getDesignationById, saveDesignation, updateDesignation } from "../api/DesignationApiService"
import { Box, Button, TextField, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"

export default function DesignationComponent() {
    const [btnValue,setBtnValue] = useState('Add Designtion')
    const [desigName,setDesigName]  = useState('')
    const [desigId,setDesigId]  = useState('')

    const navigate = useNavigate()
    const {id} = useParams()

    useEffect( 
        () => {
            retrieveDesignationById()
        },[] )

    function retrieveDesignationById ()  {
        if(id != -1) {
            setBtnValue('Update Designation')
            getDesignationById(id).then((response) => {
                 setDesigName(response.data.desigName)
                 setDesigId(response.data.desigId)
            }).catch((error)=>{
                sessionStorage.setItem('reserr',error.response.data.errorMessage)
                navigate(`/viewdesignations`)
            }) 

        }
    }

    function validate(values) {
        
        let errors  = {} 

        if(values.desigName.length<2) {
            errors.desigName="Enter at least 3 characters"
        }
        return errors
    }

    function onSubmit(values) {
        let designation = {
            desigId : id,
            desigName : values.desigName
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
                initialValues={ { desigId  , desigName } }
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
                                    <TextField  id="desigName"
                                                name="desigName"
                                                label="Designation Name"
                                                variant="standard"
                                                placeholder="Enter Designation Name"
                                                value={props.values.desigName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                error={props.touched.desigName && Boolean(props.errors.desigName)}
                                                helperText={<ErrorMessage name="desigName" />}
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
    )
}