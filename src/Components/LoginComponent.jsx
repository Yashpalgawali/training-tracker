import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useAuth } from "./Security/AuthContext";
import "../../src/Components/LogonComponent.css";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "./api/ChangePasswordApiService";
import { showToast } from "./SharedComponent/showToast";


export default function LoginComponent() {
    
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')
    const authContext  = useAuth()
  
    const navigate = useNavigate()
    
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setPos({ x: e.clientX, y: e.clientY });
    };

    useEffect(()=> {
        if(authContext.isAuthenticated==true)
        {
            navigate("/home")
        }
    },[])
    async function handleSubmit(values) {
        const res =  await authContext.login(values.username,values.password)
   
        if(res) {            
            navigate('/home')
        }
        // else {
        //     navigate('/login',{ replace : true})
        // }
    }

    function validate(values) {
        let errors = {} 
        
        if(values.username== '') {
            errors.username = 'Username cannot be blank'
        }
        if(values.password== '') {
            errors.password = 'Password cannot be blank'
        }
        return errors
    }

     
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState('');

  const handleForgotPassword = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEmail('');
  };

  const handleSendResetLink = () => {
    
    sendOtp(email).then((response)=> {
        sessionStorage.setItem('email',email)        
        showToast(response.data.responseMessage,'success')
        navigate('/confirm/otp')
    }).catch((error) => {
        console.log('error ',error)
        alert(error.response.data.errorMessage)
    })
    // You can call your API endpoint here, e.g.:
    // axios.post('/api/forgot-password', { email });
    //handleClose();
  };

    return(
        <div className="container"  >
         
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
            <div >
                <Formik
                    enableReinitialize={true}
                    initialValues={ { username , password } }
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
                                    Login
                                    </Button>  
                                     {/* 👇 Forgot Password link */}
                                    <Typography
                                        variant="body2"
                                        sx={{
                                        color: 'primary.main',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        ml: 1,
                                        mb: 1,
                                        }}
                                        onClick={handleForgotPassword}
                                    >
                                        Forgot Password?
                                    </Typography>
                </Box>
                    {/* ======= DIALOG ======= */}
                    <Dialog open={openDialog} onClose={handleClose}>
                        <DialogTitle>Forgot Password</DialogTitle>
                        <DialogContent>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Enter your registered email address to receive an OTP.
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSendResetLink} variant="contained">
                            Send Otp
                        </Button>
                        </DialogActions>
                    </Dialog>
                    </Form>
                    )
                }
            </Formik>
        </div>
       </div>
      </div>
    )
}