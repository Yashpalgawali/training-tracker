import { Box, Button, TextField, Typography } from "@mui/material" 
import { ErrorMessage, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { retrieveHolidayById, saveHoliday, updateHoliday } from "../api/HolidayApiService"
import { showToast } from "../SharedComponent/showToast"

import * as Yup from "yup";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { error } from "jquery"


const validationSchema = Yup.object({
        holiday : Yup.mixed()
                    .required("Holiday can't be blank"),

        holidayDate : Yup.mixed()
                        .required('Holiday Date can\'t be blank')                        
    });

export default function HolidayComponent() {

    const [holiday,setHoliday] = useState('')
    const [holidayDate,setHolidayDate] = useState('')

    const [btnValue , setBtnValue] = useState('Add Holiday')
    
    const navigate = useNavigate()

    const {id} = useParams()

    useEffect(()=> {
       
        if(id != -1) {
            retrieveHolidayById(id).then((response) => {
                setHoliday(response.data.holiday)
                setHolidayDate(response.data.holidayDate)
            })
        }
    })
    
    function onSubmit(values) {
        
        let formattedDate = dayjs(values.holidayDate).format('DD-MM-YYYY')

        let holiday = {
            holiday : values.holiday,
            holidayDate : formattedDate,
            holidayId : -1
        }

        if(id == -1) {

            saveHoliday(holiday).then((response)=> {
                showToast(response.data.responseMessage, "success")
                navigate(`/holidays`)
            }).catch((error) => {
                showToast(error.data.errorMessage, "warning")
                navigate(`/holidays`)
            })
        }
        else {
            holiday.holidayId=id
            updateHoliday(holiday).then((response)=> {
                showToast(response.data.responseMessage, "success")
                navigate(`/holidays`)
            }).catch((error)=>{
                showToast(error.response.data.errorMessage,"error")
                navigate("/holidays")
            })
        }
    }

    return(
        <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 2 }}>
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
             <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Formik
                enableReinitialize={true}
                initialValues={{ holiday : holiday || "" , holidayDate : holidayDate ? dayjs(holidayDate, "DD/MM/YYYY") : null}}
                validationSchema={validationSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={onSubmit}
            >
             {({ setFieldValue, values, handleChange, handleBlur,  touched, errors }) => (
                    <Form>
                         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField  id="holiday"
                                        name="holiday"
                                        label="Holiday"
                                        variant="standard"
                                        placeholder="Enter Holiday Name"
                                        value={values.holiday}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.holiday && Boolean(errors.holiday)}
                                        helperText={<ErrorMessage name="holiday" />}
                                        fullWidth />    

                                {/* Holiday Date Picker */}
                               
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        label="Holiday Date"
                                        value={values.holidayDate}
                                        onChange={(date) => {
                                            setFieldValue('holidayDate', date)
                                        }}
                                        slotProps={{
                                        textField: { 
                                            error: touched.holidayDate && Boolean(errors.holidayDate),
                                            helperText: <ErrorMessage name="holidayDate" />
                                        }
                                        }}
                                    />
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
          </LocalizationProvider>
        </Box>
    )
}