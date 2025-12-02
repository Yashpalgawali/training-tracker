import { Box, Button, TextField, Typography } from "@mui/material" 
import { ErrorMessage, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function HolidayComponent() {

    const [holiday,setHoliday] = useState('')
    const [holidayDate,setHolidayDate] = useState('')

    const [btnValue , setBtnValue] = useState('Add Holiday')
    
    const {id} = useParams()

    function validate(values) {

        let errors = {}

        if(values.holiday=='') {
            return  errors.holiday = "Holiday can't be blank"
        }
        
        if(values.holidayDate=='') {
            return  errors.holidayDate = "Please enter holiday date"
        }

        return errors
    }

    function onSubmit(values) {
         
        let holiday = {
            holiday : values.holiday,
            holidayDate : values.holidayDate            
        }

        console.log('object is ',holiday)
    }

    
    return(
        <div className="container">
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
            <Formik
                initialValues={{ holiday , holidayDate }}
                validate={validate}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={onSubmit}
            >
            {
                (props)=> (
                    <Form>
                        <Box
                            sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                            noValidate
                            autoComplete="off"
                            >
                            <TextField  id="holiday"
                                        name="holiday"
                                        label="Holiday"
                                        variant="standard"
                                        placeholder="Enter Holiday Name"
                                        value={props.values.holiday}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        error={props.touched.holiday && Boolean(props.errors.holiday)}
                                        helperText={<ErrorMessage name="holiday" />}
                                        fullWidth />    

                                <TextField  id="holidayDate"
                                        name="holidayDate"
                                        label="holidayDate"
                                        variant="standard"
                                        placeholder="Enter Holiday Date"
                                        value={props.values.holidayDate}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        error={props.touched.holidayDate && Boolean(props.errors.holidayDate)}
                                        helperText={<ErrorMessage name="holidayDate" />}
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