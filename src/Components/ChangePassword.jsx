import { Box, Button, TextField, Typography } from "@mui/material"
import { ErrorMessage, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { updatePassword } from "./api/ChangePasswordApiService"
import { showToast } from "./SharedComponent/showToast"
import { error } from "jquery"

export default function ChangePassword() {

    const [username,setUserName] = useState('')
    const [password,setPassword] = useState('')
    const [cnfpassword,setCnfPassword] = useState('')

    const navigate = useNavigate()

    useEffect(()=> {

    },[])

    function handleSubmit(values) {
       if(values.password!= values.cnfpassword) {
        alert('Not matched')
       }
       else {

        const user = {
            user_id : parseInt(sessionStorage.getItem('userid')),
            password : values.password
        }

        updatePassword(user).then((response)=> {
            
            showToast(response.data.responseMessage,'success')
            navigate(`/home`)
        }).catch((error) => {
            showToast(error.data.errorMessage,'error')
            navigate(`/change/password`)
        })
       }
    }

    function validate(values) {

        let errors = {}

        if(values.password=='')
        {
            errors.password = 'Password Can\'t be blank'
        }

        if(values.cnfpassword=='')
        {
            errors.cnfpassword = 'Confirm Password Can\'t be blank'
        }
        return errors;
    }
    return(
        <div className="container">
            <Box>
                <Typography variant="h4" gutterBottom>Change Password </Typography>
            </Box>
            <div >
                <Formik
                    enableReinitialize={true}
                    initialValues={ { password , cnfpassword } }
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                    validate={validate}
                >
                    {
                        (props) => (
                            <Form>
                                <Box
                                    // sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                                    sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start', // 👈 aligns everything to the left
                                            '& > :not(style)': { m: 1, width: '100%' },
                                            maxWidth: 400,
                                            mx: 'auto', // centers the form container itself horizontally
                                        }}
                                    noValidate
                                    autoComplete="off"
                                    >
                                    <TextField  id="password"
                                            type="password"
                                            name="password"
                                            label="Enter Password"
                                            variant="standard"
                                            placeholder="Enter Password"
                                            value={props.values.password}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.password && Boolean(props.errors.password)}
                                            helperText={<ErrorMessage name="password" />}
                                            fullWidth />  
                                
                                    <TextField  
                                            type="password"
                                            id="cnfpassword"
                                            name="cnfpassword"
                                            label="Confirm Password"
                                            variant="standard"
                                            placeholder="Re-enter Password"
                                            value={props.values.cnfpassword}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.cnfpassword && Boolean(props.errors.cnfpassword)}
                                            helperText={<ErrorMessage name="cnfpassword" />}
                                            fullWidth />
                                    <Button 
                                        sx={{ mt: 1,
                                            alignSelf: 'flex-start', // 👈 ensures button aligns to left
                                        }}
                                        className="btnvalue"
                                        type="submit"
                                        // style={{ float: 'left' }}
                                        variant="contained"
                                        color="primary"                                       
                                    >
                                    Change Password
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