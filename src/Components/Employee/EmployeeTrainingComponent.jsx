import { useEffect, useRef, useState } from "react"
import { getEmployeeById, retrieveAllEmployees } from "../api/EmployeeApiService"
import { retrieveAllTraining } from "../api/TrainingApiService"
import { ErrorMessage, Form, Formik, useFormikContext } from "formik"
import Select from 'react-select';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import dayjs  from "dayjs";

import { Box, Button, FormHelperText,  TextField,  Typography } from "@mui/material";

import { getTrainingsByEmployeeIdAndTrainingId, saveEmployeeTraining, updateEmployeeTraining } from "../api/EmployeeTrainingApiService";
import { showToast } from "../SharedComponent/showToast";
import { useNavigate, useParams } from "react-router-dom";
import { retrieveAllTrainingTimeSlots } from "../api/TrainingTimeSlotApiService";
import { retrieveAllCompetencies } from "../api/CompetencyApiService";

export default function EmployeeTrainingComponent(){

    const [trainingList,setTrainingList] = useState([])
    const [trainingTimeSlotList,setTrainingTimeSlotList] = useState([])
    const [empList,setEmployeeList] = useState([]) 
    const [training_date , setTrainingDate] = useState('')
    const [completion_date , setCompletionDate] = useState('')
    const [employee,setEmployee ] = useState('')
    const [trainingTimeSlot,setTrainingTimeSlot] = useState('')
    const [btnValue,setBtnValue] = useState('Train Employee')
    const [score,setScore] =useState('')
    const [scoreList,setScoreList] =  useState([])

    const [disabled,setDisabled] = useState(false)

    const [empListDisabled,setEmpDisabled] = useState(false)

    const didFetchRun = useRef(false)
    
    const navigate = useNavigate()
    const {id} = useParams()
   
    
    useEffect(() => {        
        
        if(!didFetchRun.current) {
            didFetchRun.current = true
            getAllDetails()
        }        
    },[])

    useEffect( ()=> {
     
        if(id != -1) {           
            setDisabled(true)
            setBtnValue('Update Training')
                getEmployeeById(id).then((response) => {
                        setEmployee(response.data)
                })
        } 
    }, [id] )

    function getAllDetails() {
        
        retrieveAllEmployees().then((response) => {
           setEmpDisabled(false)
            setEmployeeList(response.data)
        }).catch((error)=> {
             
            setEmpDisabled(true)
            showToast(error.response.data.errorMessage, "error")
        })
        retrieveAllTraining().then((response) => {
            setTrainingList(response.data)
        }).catch((error)=> {
             showToast(error.response.data.errorMessage, "error")
        })
        retrieveAllTrainingTimeSlots().then((response) => {
            setTrainingTimeSlotList(response.data)
        }).catch((error)=> {
             showToast(error.response.data.errorMessage, "error")
        })

        retrieveAllCompetencies().then((response) => {
           setScoreList(response.data)
        }).catch((error)=> {
             showToast(error.response.data.errorMessage, "error")
        })
    }

    const customStyles = {
            menu  : (provided) => ({
                ...provided,
                backgroundColor : "White",   // solid background
                zIndex : 9999                // keeps it above other elements
            }),
            option :(provided,state) => ({
                ...provided,
                backgroundColor : state.isFocused ? "#f0f0f0" : "White", // hover effect
                color : "black"
            })
    }

     function TrainingMultiSelect({ options }) {
        const { setFieldValue, values } = useFormikContext();

        return (
            
            <Select          
                styles={customStyles}
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

        let competencyObj = {
            competency_id : parseInt(values.score)
        }
        let timeSlotObj = {
            training_time_slot_id : parseInt(values.trainingTimeSlot)
        }
        const formattedTrainingDate = dayjs(values.training_date).format('DD-MM-YYYY');

        let employeeObject = null

        if(id!= -1) {
            employeeObject = {
                empId : parseInt(id)
            }
        }
        else {
            employeeObject = {
                empId : parseInt(values.employee)
            }
        }

        let employeeTraining = {
                employee : employeeObject,
                trainingTimeSlot : timeSlotObj,
                training_date : formattedTrainingDate,
                training_ids : values.training_ids,
                competency : competencyObj,
                completion_date : formattedTrainingDate 
            }

           await getTrainingsByEmployeeIdAndTrainingId(employeeObject.empId,values.training_ids).then((result) => {

                employeeTraining = {
                        employee : employeeObject,
                        trainingTimeSlot : timeSlotObj,
                        training_date : formattedTrainingDate,
                        training_ids : values.training_ids,
                        competency : competencyObj,
                        completion_date : formattedTrainingDate,
                        emp_train_id : result.data.emp_train_id
                }
                
                sessionStorage.setItem('training_id',values.training_ids)
                }).catch((error)=>{  })

            if(sessionStorage.getItem('training_id')!=null) {
                 
                updateEmployeeTraining(employeeTraining).then((response) => {                   
                    showToast(response?.data?.responseMessage,"success")
                    navigate(`/viewemployees`)
                })
                .catch((error) => {                
                    showToast(error?.data?.errorMessage,"error")
                    navigate(`/viewemployees`)
                }).finally(()=>{
                    sessionStorage.removeItem('training_id')
                })                
            }
            else {             
                    employeeTraining = {
                    employee : employeeObject,
                    trainingTimeSlot : timeSlotObj,
                    training_date : formattedTrainingDate,
                    training_ids : values.training_ids,
                    competency : competencyObj,
                    completion_date : formattedTrainingDate
                }
                    saveEmployeeTraining(employeeTraining).then((response) => {
                        if(id!= -1) {
                            navigate(`/training/employee/${id}`)
                            showToast(response?.data?.responseMessage,"success")
                        }
                        else {
                            navigate(`/viewemployees`)
                            showToast(response?.data?.responseMessage,"success")
                        }
                    })
                    .catch((error) => {
                        showToast(error?.data?.errorMessage,"error")
                        navigate(`/training/employee/${id}`)
                    })
            }
    }
    
    function validate(values) {
        let errors = {}
        if(id == -1)
        {
            if(values.employee=='') {
                errors.employee='No Employee Selected'
            }
        }
        
        if(values.training_ids=='') {
           errors.training_ids='No Training is Selected'
        }
      
        if(values.trainingTimeSlot=='') {
           errors.trainingTimeSlot='No Training Time Slot is Selected'
        }
        if(values.training_date==null) {
           errors.training_date='No Training Date is Selected'
        }

        return errors
    }

    return(
           <div className="container">
                <Typography variant="h4" gutterBottom>
                    {btnValue} {employee.empName}
                </Typography>
                <div>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                   <Formik                       
                        initialValues={{
                            training_date: training_date ? dayjs(training_date) : null,
                            completion_date: completion_date ? dayjs(completion_date) : null,
                            employee: employee ? id : '',
                            competency : score ? score : '',
                            training_ids: [],
                            trainingTimeSlot : trainingTimeSlot? trainingTimeSlot.training_time_slot_id :''
                        }}

                        validate={validate}
                        validateOnBlur={false}
                        validateOnChange={false}
                        onSubmit={onSubmit}
                        >
                        {({ setFieldValue, values, handleChange, handleBlur,  touched, errors }) => (
                            <Form>
                            {/* Employee Dropdown */}
                            <Box mb={2}>                              
                                   
                                     <Typography variant="subtitle1">Employee</Typography>
                                        {
                                            empListDisabled ? (
                                                <>
                                                <TextField 
                                                    fullWidth
                                                    disabled="true"
                                                    placeholder="No Employees Present"
                                                />
                                                </>
                                            ) : (
                                            <>
                                            <Select
                                                styles={customStyles}                                            
                                                hideSelectedOptions={true}
                                                isDisabled={disabled}                                    
                                                name="employee"
                                                options={empList.map(emp => ({
                                                    value: emp.empId,
                                                    label: emp.empName
                                                }))}
                                                value= {
                                                    empList
                                                    .map(emp => ({ value: emp.empId, label: emp.empName }))
                                                    .find(option => option.value === values.employee) || null
                                                }
                                                onChange={(option) => setFieldValue('employee', option ? option.value : '')}
                                                placeholder="Select Employee"
                                               
                                            />                                
                                            <FormHelperText error={touched.employee && Boolean(errors.employee)}>
                                            <ErrorMessage name="employee" />
                                            </FormHelperText>   
                                        </>
                                   )
                                }

                            </Box>

                            {/* Training MultiSelect */}
                            <Box mb={2}>
                                <Typography variant="subtitle1">Select Trainings</Typography>
                                <Select   
                                        styles={customStyles}                                     
                                        name="training_ids"
                                        options={trainingList.map(training => ({
                                            value: training.training_id,
                                            label: training.training_name
                                        }))}
                                        value={
                                            trainingList
                                                .map(training => ({ value: training.training_id, label: training.training_name }))
                                                .find(option => option.value === values.training_ids) || null
                                        }
                                            onChange={(option) => setFieldValue('training_ids', option ? option.value : '')}
                                            placeholder="Select Training"
                                    />
                                <FormHelperText error={touched.training_ids && Boolean(errors.training_ids)}>
                                <ErrorMessage name="training_ids" />
                                </FormHelperText>  
                                
                            </Box>

                            {/* Competency Score */}
                            <Box mb={2}>
                                <Typography variant="subtitle1">Competency Score</Typography>
                                
                                    <Select   
                                        styles={customStyles}                                     
                                        name="score"
                                        options={scoreList.map(scores => ({
                                            value: scores.competency_id,
                                            label: scores.score
                                        }))}
                                        value={
                                            scoreList
                                                .map(scores => ({ value: scores.competency_id, label: scores.score }))
                                                .find(option => option.value === values.score) || null
                                        }
                                            onChange={(option) => {
                                                
                                                setFieldValue('score', option ? option.value : '') }}
                                            placeholder="Select Score"
                                    /> 
                                
                                <FormHelperText error={touched.competency && Boolean(errors.competency)}>
                                <ErrorMessage name="competency" />
                                </FormHelperText>  
                                  
                            </Box>
                             
                              {/* Training Date Picker */}
                                <Box mb={2}  >
                                <DatePicker
                                    
                                    format="DD/MM/YYYY"
                                    label="Training Date"
                                    value={values.training_date}
                                    onChange={(date) => setFieldValue('training_date', date)}
                                    slotProps={{
                                    textField: { 
                                        error: touched.training_date && Boolean(errors.training_date),
                                        helperText: <ErrorMessage name="training_date" />
                                    }
                                    }}
                                />
                            </Box>
                                
                                
                            <Box mb={2}>
                                <Typography variant="subtitle1">Training Time Slot</Typography>
                                <Select  
                                    styles={customStyles}                                                                   
                                    name="trainingTimeSlot"
                                    options={trainingTimeSlotList.map(timeslot => ({
                                        value: timeslot.training_time_slot_id,
                                        label: timeslot.training_time_slot
                                    }))}
                                    value={
                                        trainingTimeSlotList
                                        .map(timeslot => ({ value: timeslot.training_time_slot_id, label: timeslot.training_time_slot }))
                                        .find(option => option.value === values.trainingTimeSlot) || null
                                    }
                                    onChange={(option) => setFieldValue('trainingTimeSlot', option ? option.value : '')}
                                    placeholder="Select Training time Slot"
                                />
                                <FormHelperText error={touched.trainingTimeSlot && Boolean(errors.trainingTimeSlot)}>
                                <ErrorMessage name="trainingTimeSlot" />
                                </FormHelperText>
                            </Box>

                            {/* Submit Button */}
                            <Box mt={2}>
                                <Button type="submit" variant="contained" disabled={!empList || empList.length === 0}  color="primary">
                                {btnValue}
                                </Button>
                            </Box>
                            </Form>
                        )}
                        </Formik>
                </LocalizationProvider>

               </div>
           </div>
       )
}  