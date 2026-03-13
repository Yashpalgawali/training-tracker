import $ from 'jquery'; // jQuery is required for DataTables to work
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality

import { Box, Button, TextField, Tooltip, Typography } from "@mui/material" 
import { ErrorMessage, Form, Formik } from "formik"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { retrieveAllHolidays, retrieveHolidayById, saveHoliday, updateHoliday } from "../api/HolidayApiService"
import { showToast } from "../SharedComponent/showToast"
import EditIcon from '@mui/icons-material/Edit';
import * as Yup from "yup";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { toast } from 'react-toastify';

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
    
    const [isDisabled, setIsDisabled] = useState(false)

    const navigate = useNavigate()

    const {id} = useParams()
   
    const [holidaylist,setHolidayList] = useState([])
    const tableRef = useRef(null)

    const didFetchRef = useRef(false);

    useEffect(()=> {
       
        if(id != -1) {
            retrieveHolidayById(id).then((response) => {
                setHoliday(response.data.holiday)
                setHolidayDate(response.data.holidayDate)
            })
        }
    },[id])

    useEffect(
    () => 
        {               
            if (!didFetchRef.current) {
                didFetchRef.current = true;                            
                retrieveAllHolidaysFunction()
            }
        },[]) 

    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && holidaylist.length >0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [holidaylist]); // Re-initialize DataTables when activities data changes
   

    function retrieveAllHolidaysFunction() {
        
        retrieveAllHolidays().then(
            (response) => {   
                setHolidayList(response.data) 
            })
            .catch((error)=> {
                toast.error(error.response.data.errorMessage)
            })
    }
    function onSubmit(values) {
        setIsDisabled(true)
        let formattedDate = dayjs(values.holidayDate).format('DD-MM-YYYY')

        let holiday = {
            holiday : values.holiday,
            holidayDate : formattedDate,
            holidayId : -1
        }

        if(id == -1) {

            saveHoliday(holiday).then((response)=> {
                toast.success(response.data.responseMessage)
                setIsDisabled(false)
                  retrieveAllHolidaysFunction()
                navigate(`/holiday/-1`)
            }).catch((error) => {
                setIsDisabled(false)
                toast.error(error.data.errorMessage)
                retrieveAllHolidaysFunction()
                navigate(`/holidays`)
            })
        }
        else {
            holiday.holidayId=id
            updateHoliday(holiday).then((response)=> {
                toast.success(response.data.responseMessage)
                setHoliday("")
                setHolidayDate(null)
                setBtnValue("Add Holiday")
                setIsDisabled(false)
                retrieveAllHolidaysFunction()
                navigate(`/holiday/-1`)
            }).catch((error)=>{
                toast.error(error.response.data.errorMessage)
                setHoliday("")
                setHolidayDate(null)
                setBtnValue("Add Holiday")
                setIsDisabled(false)
                retrieveAllHolidaysFunction()
                navigate("/holidays")
            })
        }
    }

    return(
        <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", p: 2 }}>
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
                                        disabled={isDisabled}
                                    >
                                    {btnValue}
                                    </Button>
                            </Box>
                    </Form>
                )
            }
            </Formik>
          </LocalizationProvider>
            
            <Box sx={{marginTop : "50px"}}>
                <Typography variant="h4" gutterBottom>View Holidays </Typography>
            </Box>

            <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Date</th>
                        <th>Holiday</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {
                holidaylist.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                No Data available
                            </td>
                        </tr>
                        ) : (
                        holidaylist.map((holiday,index) => (
                            <tr key={holiday.holidayId}>
                                <td>{index+1}</td>
                                <td>{holiday.holidayDate}</td>
                                <td>{holiday.holiday}</td>
                                <td><Button className="btn btn-primary" type="submit" variant="contained" color="success" onClick={()=>navigate(`/holiday/${holiday.holidayId}`) }><EditIcon /> Update</Button></td>
                            </tr>
                        ))
                    )
                    }    
                </tbody>
            </table>
        </Box>
    )
}