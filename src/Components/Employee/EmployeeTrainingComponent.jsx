import { useEffect, useRef, useState } from "react"
import { getEmployeeById, retrieveAllEmployees } from "../api/EmployeeApiService"
import { retrieveAllTraining } from "../api/TrainingApiService"
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik"
import Select from 'react-select';

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import dayjs, { Dayjs } from "dayjs";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, TextField, Typography } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { saveEmployeeTraining } from "../api/EmployeeTrainingApiService";
import { showToast } from "../SharedComponent/showToast";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeeTrainingComponent(){

    const [trainingList,setTrainingList] = useState([])
    const [empList,setEmployeeList] = useState([])
    const [emp_train_hist_id,setEmpTrainHistId] = useState('')
    const [training_date , setTrainingDate] = useState('')
    const [completion_date , setCompletionDate] = useState('')
    const [employee,setEmployee ] = useState('')
    const [btnValue,setBtnValue] = useState('Train Employee')
    const didFetchRun = useRef(false)

    const navigate = useNavigate()

    const {id} = useParams()

    useEffect(() => {
        
        if(!didFetchRun.current) {
            didFetchRun.current = false
            getAllDetails()
        }        
    },[])

    useEffect(()=> {
        if(id != -1) {
            setBtnValue('Update Training')
            getEmployeeById(id).then((response) => {
                console.log(response)
                setEmployee(response.data)
            })
        } 
    }, [] )

    function getAllDetails() {
        retrieveAllEmployees().then((response) => {
            setEmployeeList(response.data)
        })
        retrieveAllTraining().then((response) => {
            setTrainingList(response.data)
        })
    }

     function TrainingMultiSelect({ options }) {
        const { setFieldValue, values } = useFormikContext();

        return (
            <Select
            name="training_ids"
            isMulti
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(selectedOptions) => {
                const ids = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];                
                setFieldValue("training_ids", ids);
            }}
            value={options.filter((opt) => values.training_ids?.includes(opt.value))}
            />
        );
    }

    var options = ''
    options =  trainingList    
        .map((training) =>
            ({
                value: training.training_id,
                label: `${training.training_name}`
            }) );

    async function onSubmit(values) {
        let employeeObject = {
            emp_id : parseInt(values.employee)
        }

        const formattedTrainingDate = dayjs(values.training_date).format('DD-MM-YYYY');

        const formattedCompletionDate =  values.completion_date ? dayjs(values.completion_date).format('DD-MM-YYYY') : '';
       
        let employeeTraining = {
            employee : employeeObject,
            training_date : formattedTrainingDate,
            training_ids : values.training_ids,
            completion_date : formattedCompletionDate
        }

        
        saveEmployeeTraining(employeeTraining).then((response) => {
             
            showToast(response?.data?.responseMessage,"success")
            navigate(`/viewemployees`)
        })
        .catch((error) => {
             
            showToast(error?.data?.errorMessage,"error")
            navigate(`/viewemployees`)
        })
    }

   return(
           <div className="container">
               <Typography variant="h4" gutterBottom>{btnValue}</Typography>
               <div>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Formik
                        enableReinitialize={true}
                        initialValues={{
                            training_date: training_date ? dayjs(training_date) : null,
                            completion_date: completion_date ? dayjs(completion_date) : null,
                            employee: employee ? employee.emp_id : '',
                            training_ids: []
                        }}
                        validateOnBlur={false}
                        validateOnChange={false}
                        onSubmit={onSubmit}
                        >
                        {({ setFieldValue, values, handleChange, handleBlur, touched, errors }) => (
                            <Form>
                            {/* Employee Dropdown */}
                            {/* Employee Select using react-select */}
                            <Box mb={2}>
                                <Typography variant="subtitle1">Employee</Typography>
                                <Select
                                name="employee"
                                options={empList.map(emp => ({
                                    value: emp.emp_id,
                                    label: emp.emp_name
                                }))}
                                value={
                                    empList
                                    .map(emp => ({ value: emp.emp_id, label: emp.emp_name }))
                                    .find(option => option.value === values.employee) || null
                                }
                                onChange={(option) => setFieldValue('employee', option ? option.value : '')}
                                placeholder="Select Employee"
                                />
                                <FormHelperText error={touched.employee && Boolean(errors.employee)}>
                                <ErrorMessage name="employee" />
                                </FormHelperText>
                            </Box>
                            
                           
                              {/* Training Date Picker */}
                                <Box mb={2}>
                                <DatePicker
                                    label="Training Date"
                                    value={values.training_date}
                                    onChange={(date) => setFieldValue('training_date', date)}
                                    slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: touched.training_date && Boolean(errors.training_date),
                                        helperText: <ErrorMessage name="training_date" />
                                    }
                                    }}
                                />
                                </Box>

                                {/* Completion Date Picker */}
                                <Box mb={2}>
                                <DatePicker
                                    label="Completion Date"
                                    value={values.completion_date}
                                    onChange={(date) => setFieldValue('completion_date', date)}
                                    slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: touched.completion_date && Boolean(errors.completion_date),
                                        helperText: <ErrorMessage name="completion_date" />
                                    }
                                    }}
                                />
                                </Box>
                            
                            {/* Training MultiSelect */}
                            <Box mb={2}>
                                <Typography variant="subtitle1">Training</Typography>
                                <TrainingMultiSelect
                                options={options}
                                value={values.training_ids}
                                onChange={(value) => setFieldValue('training_ids', value)}
                                />
                                <FormHelperText><ErrorMessage name="training_ids" /></FormHelperText>
                            </Box>

                            {/* Submit Button */}
                            <Box mt={2}>
                                <Button type="submit" variant="contained" color="primary">
                                {btnValue}
                                </Button>
                            </Box>
                            </Form>
                        )}
                        </Formik>
            </LocalizationProvider>
                   {/* <Formik
                       enableReinitialize={true}
                       initialValues={ {  training_date, completion_date ,  employee: employee ? employee.emp_id : ''  , training_ids : []} }
                       validateOnBlur={false}
                       validateOnChange={false}
                       onSubmit={onSubmit}
                   >
                   {
                       ({ setFieldValue, values }) =>( 
                           <Form>
                              <fieldset>
                                   <label htmlFor="employee" ></label>
                                   <Field as="select" name="employee" className="form-control"  >
                                       <option>Please Select Employees</option>
                                       {
                                           empList.map(
                                               (emp)=> (
                                                   <option key={emp.emp_id} value={emp.emp_id}>{emp.emp_name}</option>
                                               )
                                           )
                                       }
                                   </Field>
                               </fieldset>
                               <fieldset className="form-group">
                                   <label htmlFor="training_date">Training Date</label>
                                   <Field name="training_date" className="form-control" value={values.training_date} placeholder="Enter Joining Date" type="date"></Field>
                               </fieldset>
                               <fieldset className="form-group">
                                   <label htmlFor="completion_date">Training Completion Date</label>
                                   <Field name="completion_date" className="form-control" value={values.completion_date} placeholder="Enter Training Completion Date" type="date"></Field>
                               </fieldset>
                                                               
                               <fieldset>
                                   <label htmlFor="training_ids">Training</label>
                                   <TrainingMultiSelect options={options} />
                               </fieldset>
                               <div>
                                   <Button type="submit" variant="contained" color="primary" className="mt-2" >{btnValue}</Button>
                               </div>
   
                           </Form>
                       )
                   }
                   </Formik> */}
               </div>
           </div>
       )
}  