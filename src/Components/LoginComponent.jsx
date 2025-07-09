import { Box, Button, TextField, Typography } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useAuth } from "./Security/AuthContext";

export default function LoginComponent() {
    
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')
    const authContext  = useAuth()

    function handleSubmit(values) {
        authContext.login(values.username,values.password)
    }

    return(
        <div className="container">
            <Box>
                <Typography variant="h4" gutterBottom>Login Here </Typography>
            </Box>

            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={ { username , password } }
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={handleSubmit}
                >
                    {
                        (props) => (
                            <Form>
                               <Box                                
                                    sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                                    noValidate
                                    autoComplete="off"
                                    >
                                    <TextField  id="username"
                                            name="username"
                                            label="User Name"
                                            variant="standard"
                                            placeholder="Enter User Name"
                                            value={props.values.username}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.username && Boolean(props.errors.username)}
                                            helperText={<ErrorMessage name="username" />}
                                            fullWidth />
                                                              
                                </Box>
                                <Box                                
                                    sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                                    noValidate
                                    autoComplete="off"
                                    >
                                    <TextField  
                                            type="password"
                                            id="password"
                                            name="password"
                                            label="Password"
                                            variant="standard"
                                            placeholder="Enter Password"
                                            value={props.values.password}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.password && Boolean(props.errors.password)}
                                            helperText={<ErrorMessage name="password" />}
                                            fullWidth />
                                                              
                                </Box>

                                <Box  className="btnvalue">
                                    <Button
                                        type="submit"
                                        style={{ float: 'left' }}
                                        variant="contained"
                                        color="primary"                                   
                                    >
                                    Login
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