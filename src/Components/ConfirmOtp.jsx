import { Box, Button, TextField, Typography } from "@mui/material"
import { ErrorMessage, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { validateOtp } from "./api/ChangePasswordApiService"
import { showToast } from "./SharedComponent/showToast"

export default function ConfirmOtp() {

    const [otp,setOtp] = useState('')
    const [cnfOtp,setCnfOtp] = useState('')

    const navigate = useNavigate()
    const [maskedEmail,setMaskedEmail] = useState('')
    
    useEffect(()=> {
        
        if(sessionStorage.getItem('email')==null) {
            navigate(`/login`)
        }else {
            let email = sessionStorage.getItem('email')
            const [name, domain] = email.split("@");
          
            const maskedName = name[0] + "*".repeat(name.length - 2) + name.slice(-1);
            setMaskedEmail(maskedName + "@" + domain)

        }
    },[])

    function handleSubmit(values) {
        let email = sessionStorage.getItem('email') 
        
        let notp = values.otp
        validateOtp(email,notp).then((response)=> {
            navigate('/forgot/password/change')
        }).catch((error)=> {
            showToast(error.response.data?.errorMessage,"error")
        })
    }

    function validate(values) {
        let errors = {}

        if(values.otp=='') {
            errors.otp='OTP can\'t be blank'
        }
        return errors
    }

    return(
        <div className="container">
            <Box>
                <Typography variant="h5" gutterBottom>Otp is sent to your {maskedEmail}  </Typography>
            </Box>
            <div >
                <Formik
                    enableReinitialize={true}
                    initialValues={ { otp } }
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
                                    <TextField  id="otp"
                                            name="otp"
                                            label="Enter Otp"
                                            variant="standard"
                                            placeholder="Enter Otp"
                                            value={props.values.otp}
                                            onChange={(e)=> {
                                                const otp = e.target.value.replace(/[^0-9]/g, "")
                                                props.setFieldValue("otp",otp)
                                              }
                                            }
                                            onBlur={props.handleBlur}
                                            error={props.touched.otp && Boolean(props.errors.otp)}
                                            helperText={<ErrorMessage name="otp" />}
                                            slotProps={{
                                                input : {
                                                    inputMode : "numeric",
                                                    pattern : "[0-9]*"

                                                }
                                            }}
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
                                    Confirm OTP
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