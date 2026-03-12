
import {Box, Dialog, Checkbox, DialogActions, DialogContent, DialogTitle,Button, Divider, Grid, IconButton, InputAdornment, TextField, Paper, Typography, FormControlLabel, Container, Stack} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useAuth } from "./Security/AuthContext";
import "../../src/Components/LogonComponent.css";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp } from "./api/ChangePasswordApiService";
import { showToast } from "./SharedComponent/showToast";

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import BusinessIcon from '@mui/icons-material/Business';
import MenuBookIcon from '@mui/icons-material/MenuBook';


import { toast } from "react-toastify";


export default function LoginComponent() {
    
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')
    const authContext  = useAuth()
    
    const [disabled,setDisabled] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

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
    setDisabled(true)
    sendOtp(email).then((response)=> {
        sessionStorage.setItem('email',email)
        toast.success(response.data.responseMessage)
        // showToast(response.data.responseMessage,'success')
        navigate('/confirm/otp')
    }).catch((error) => {
        setDisabled(false)
        toast.error(error.response.data.errorMessage)
    })
    // You can call your API endpoint here, e.g.:
    // axios.post('/api/forgot-password', { email });
    //handleClose();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#667eea 0%,#764ba2 50%,#6dd5ed 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2
      }}
    >

      {/* LOGIN CARD */}

      <Paper
        elevation={10}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.9)"
        }}
      >

        {/* HEADER */}

        <Stack spacing={1} alignItems="center" mb={3}>

          {/* <SchoolIcon sx={{ fontSize: 50, color: "#5e35b1" }} /> */}

          <Typography variant="h5" fontWeight="bold">
            Training Tracker
          </Typography>

          <Typography color="text.secondary" textAlign="center">
            Sign in to manage employee training
          </Typography>

        </Stack>

        <Formik
            enableReinitialize={true}
            initialValues={{username,password}}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
            validate={validate}
        >
            {
            (props) => (
                <Form>

          {/* EMAIL */}

          <TextField
            fullWidth
            label="Username"
            id="username"
            name="username"
            placeholder="Username"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            autoFocus={true}
            margin="normal"
            required
            slotProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {/* <EmailIcon /> */}
                </InputAdornment>
              )
            }}
          />

          {/* PASSWORD */}

          <TextField
            fullWidth
            label="Password"
            margin="normal"
            id="password"
            name="password"
             onChange={props.handleChange}
            onBlur={props.handleBlur}
            required
            type={showPassword ? "text" : "password"}
            slotProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* OPTIONS */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1
            }}
          >
{/* 
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Remember me"
            /> */}

            <Button href="#" underline="hover">
              Forgot password?
            </Button>

          </Box>

          {/* BUTTON */}

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{
              mt: 3,
              py: 1.4,
              borderRadius: 2,
              background:
                "linear-gradient(90deg,#5e35b1,#7c4dff)"
            }}
          >
            Sign In
          </Button>

        </Form>
            )}
            </Formik>

      </Paper>

    </Box>
  )
//       <Grid container sx={{ height: "100vh" }}>
    
//           {/* LEFT SIDE VISUAL */}
    
//           <Grid
//             item
//             xs={false}
//             md={7}
//             sx={{
//               background: "linear-gradient(135deg,#1976d2,#42a5f5)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "white",
//               flexDirection: "column",
//               textAlign: "center",
//               p: 5
//             }}
//           >
    
//             <BusinessIcon  sx={{ fontSize: 80, mb: 2 }} />
    
//             <Typography variant="h3" fontWeight="bold">
//               Training Tracker System
//             </Typography>
    
//             <Typography variant="h6" mt={2}>
//               Manage Employees Trainings Efficiently
//             </Typography>
    
//           </Grid>
    
//           {/* RIGHT SIDE LOGIN FORM */}
    
//           <Grid
//             item
//             xs={12}
//             md={5}
//             component={Paper}
//             elevation={6}
//             square
//           >
//             <Box
//               sx={{
//                 height: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 p: 5
//               }}
//             >
    
//               <Box sx={{ width: "100%", maxWidth: 400 }}>
    
//                 <Typography variant="h4" fontWeight="bold" mb={1}>
//                   Sign In
//                 </Typography>
    
//                 <Typography color="text.secondary" mb={3}>
//                   Enter your credentials to continue
//                 </Typography>
    
//                 <Divider sx={{ mb: 3 }} />
    
//                 {/* <form onSubmit={handleSubmit}> */}
//                 <Formik
//                     enableReinitialize={true}
//                     initialValues={{username,password}}
//                     validateOnBlur={false}
//                     validateOnChange={false}
//                     onSubmit={handleSubmit}
//                     validate={validate}
//                 >
//                  {
//                     (props) => (
//                         <Form>
//                   {/* USERNAME */}
//                     <ErrorMessage name="username" component="div" className="alert alert-danger"/>
//                   <TextField
//                     fullWidth
//                     label="Username"
//                     id="username"
//                     placeholder="Username"
//                     onChange={props.handleChange}
//                     onBlur={props.handleBlur}
//                     autoFocus={true}
//                     margin="normal"
//                     required
//                     slotProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           {/* <EmailIcon /> */}
//                         </InputAdornment>
//                       )
//                     }}
//                   />
    
//                   {/* PASSWORD */}
//                     <ErrorMessage name="password" component="div" className="alert alert-danger"/>
//                   <TextField
//                     fullWidth
//                     label="Password"
//                     name="password"
//                     id="password"
//                     placeholder="Password"
//                     onChange={props.handleChange}
//                     onBlur={props.handleBlur}
//                     type={showPassword ? "text" : "password"}
//                     margin="normal"
//                     required
//                     autoComplete="new-password"
//                     slotProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <LockIcon />
//                         </InputAdornment>
//                       ),
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             edge="end"
//                             onClick={() => setShowPassword(!showPassword)}
//                           >
//                             {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                           </IconButton>
//                         </InputAdornment>
//                       )
//                     }}
//                   />
//     {/* Forgot Password */}
    
//     <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
//       <Button
//         onClick={handleForgotPassword}
//         underline="hover"
//         sx={{ fontSize: 14 }}

//       >
//         Forgot password?
//       </Button>
//       {/* ======= DIALOG ======= */}
//                      <Dialog open={openDialog} onClose={handleClose}>
//                          <DialogTitle>Forgot Password</DialogTitle>
//                          <DialogContent>
//                          <Typography variant="body2" sx={{ mb: 2 }}>
//                              Enter your registered email address to receive an OTP.
//                          </Typography>
//                          <TextField
//                             autoFocus
//                             margin="dense"
//                             id="email"
//                             label="Email Address"
//                             type="email"
//                             fullWidth
//                             variant="outlined"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                         </DialogContent>
//                         <DialogActions>
//                         <Button onClick={handleClose}>Cancel</Button>
//                         <Button onClick={handleSendResetLink} disabled={disabled} variant="contained">
//                             Send Otp
//                         </Button>
//                         </DialogActions>
//                     </Dialog>
//         </Box>
//                   {/* LOGIN BUTTON */}
    
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     size="large"
//                     type="submit"
//                     sx={{ mt: 3, py: 1.5 }}
                    
//                   >
//                     Login
//                   </Button>
    
//                    </Form>
//                     )
//                  }    
//                    </Formik>
//                 {/* </form> */}
    
//               </Box>
    
//             </Box>
    
//           </Grid>
    
//         </Grid>
//   )


    // return(
    //     <div className="container"  >
         
    //         <div  style={{
    //             position: "relative",
    //             height: "100vh",
    //             overflow: "hidden"
    //         }}
    //         onMouseMove={handleMouseMove}
    //         >
    //         {/* Floating circle */}
    //         <div
    //             style={{
    //                 position: "fixed", // 👈 fixed keeps it out of layout flow
    //                 top: pos.y - 10,
    //                 left: pos.x - 10,
    //                 width: 10,
    //                 height: 10,
    //                 borderRadius: "50%",
    //                 backgroundColor: "red",
    //                 pointerEvents: "none", // 👈 lets you interact with underlying form
    //                 zIndex: 9999
    //             }}
    //         />
    //         <Box>
    //             <Typography variant="h4" gutterBottom>Time To Login!! </Typography>
    //         </Box>
    //         <div >
    //             <Formik
    //                 enableReinitialize={true}
    //                 initialValues={ { username , password } }
    //                 validateOnBlur={false}
    //                 validateOnChange={false}
    //                 onSubmit={handleSubmit}
    //                 validate={validate}
    //             >
    //                 {
    //                     (props) => (
    //                         <Form>
    //                            <Box
    //                                 // sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
    //                                 sx={{
    //                                         display: 'flex',
    //                                         flexDirection: 'column',
    //                                         alignItems: 'flex-start', // 👈 aligns everything to the left
    //                                         '& > :not(style)': { m: 1, width: '100%' },
    //                                         maxWidth: 400,
    //                                         mx: 'auto', // centers the form container itself horizontally
    //                                     }}
    //                                 noValidate
    //                                 autoComplete="off"
    //                                 >
    //                                 <TextField  id="username"
    //                                         name="username"
    //                                         label="User Name"
    //                                         variant="standard"
    //                                         placeholder="Enter User Name"
    //                                         value={props.values.username}
    //                                         onChange={props.handleChange}
    //                                         onBlur={props.handleBlur}
    //                                         error={props.touched.username && Boolean(props.errors.username)}
    //                                         helperText={<ErrorMessage name="username" />}
    //                                         fullWidth />  
                                
    //                                 <TextField  
    //                                         type="password"
    //                                         id="password"
    //                                         name="password"
    //                                         label="Password"
    //                                         variant="standard"
    //                                         placeholder="Enter Password"
    //                                         value={props.values.password}
    //                                         onChange={props.handleChange}
    //                                         onBlur={props.handleBlur}
    //                                         error={props.touched.password && Boolean(props.errors.password)}
    //                                         helperText={<ErrorMessage name="password" />}
    //                                         fullWidth />
    //                                 <Button 
    //                                     sx={{ mt: 1,
    //                                         alignSelf: 'flex-start', // 👈 ensures button aligns to left
    //                                     }}
    //                                     className="btnvalue"
    //                                     type="submit"
    //                                     // style={{ float: 'left' }}
    //                                     variant="contained"
    //                                     color="primary"                                       
    //                                 >
    //                                 Login
    //                                 </Button>  
    //                                  {/* 👇 Forgot Password link */}
    //                                 <Typography
    //                                     variant="body2"
    //                                     sx={{
    //                                     color: 'primary.main',
    //                                     cursor: 'pointer',
    //                                     textDecoration: 'underline',
    //                                     ml: 1,
    //                                     mb: 1,
    //                                     }}
    //                                     onClick={handleForgotPassword}
    //                                 >
    //                                     Forgot Password?
    //                                 </Typography>
    //             </Box>
    //                 {/* ======= DIALOG ======= */}
    //                 <Dialog open={openDialog} onClose={handleClose}>
    //                     <DialogTitle>Forgot Password</DialogTitle>
    //                     <DialogContent>
    //                     <Typography variant="body2" sx={{ mb: 2 }}>
    //                         Enter your registered email address to receive an OTP.
    //                     </Typography>
    //                     <TextField
    //                         autoFocus
    //                         margin="dense"
    //                         id="email"
    //                         label="Email Address"
    //                         type="email"
    //                         fullWidth
    //                         variant="outlined"
    //                         value={email}
    //                         onChange={(e) => setEmail(e.target.value)}
    //                     />
    //                     </DialogContent>
    //                     <DialogActions>
    //                     <Button onClick={handleClose}>Cancel</Button>
    //                     <Button onClick={handleSendResetLink} disabled={disabled} variant="contained">
    //                         Send Otp
    //                     </Button>
    //                     </DialogActions>
    //                 </Dialog>
    //                 </Form>
    //                 )
    //             }
    //         </Formik>
    //     </div>
    //    </div>
    //   </div>
    // )
}