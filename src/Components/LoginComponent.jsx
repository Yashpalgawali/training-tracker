import { Box, Button, TextField, Typography } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useAuth } from "./Security/AuthContext";
import "../../src/Components/LogonComponent.css";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
    
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')
    const authContext  = useAuth()
  
    const navigate = useNavigate()
    
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setPos({ x: e.clientX, y: e.clientY });
    };

    async function handleSubmit(values) {
        const res =  await authContext.login(values.username,values.password)
   
        if(res) {            
            navigate('/viewemployees')
        }
        // else {
        //     navigate('/login',{ replace : true})
        // }
    }

    return(
        <div className="container">

            <div  style={{
                position: "relative",
                height: "100vh",
                overflow: "hidden"
            }}
            onMouseMove={handleMouseMove}
            >
            {/* Floating circle */}
            <div
                style={{
                    position: "fixed", // 👈 fixed keeps it out of layout flow
                    top: pos.y - 10,
                    left: pos.x - 10,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    pointerEvents: "none", // 👈 lets you interact with underlying form
                    zIndex: 9999
                }}
            />
            <Box>
                <Typography variant="h4" gutterBottom>Time To Login!! </Typography>
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
      </div>
    )
}