import { useEffect, useRef, useState } from "react"
import { getEmployeeById, retrieveAllActiveEmployees, retrieveAllEmployees, retrieveAllEmployeesUsingTrainingAndCompetencyId } from "../api/EmployeeApiService"
import { retrieveAllTraining } from "../api/TrainingApiService"
import { ErrorMessage, Form, Formik, useFormikContext } from "formik"
import Select from 'react-select';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import dayjs  from "dayjs";

import { Box, Button, FormControl, FormHelperText,  TextField,  Typography } from "@mui/material";

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
    // const [employee,setEmployee ] = useState('')
    const [employee,setEmployee ] = useState([])
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
            empList.length = 2   
            setDisabled(false)          
            setEmpDisabled(true)
            setBtnValue('Update Training')
                getEmployeeById(id).then((response) => {
                        setEmployee(response.data)
                })
        }
    }, [id] )

    function getAllDetails() {
       
        // retrieveAllActiveEmployees().then((response) => {
        //    empListDisabled && setEmpDisabled(false)
        //    setEmployeeList(response.data)
        // }).catch((error)=> {
        //     setEmpDisabled(true)
        //     showToast(error.response.data.errorMessage, "error")
        // })
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

    //  function TrainingMultiSelect({ options }) {
    //     const { setFieldValue, values } = useFormikContext();
    //     return (
    //         <Select          
    //             styles={customStyles}
    //             name="training_ids"
    //             isMulti
    //             options={options}
    //             className="basic-multi-select"
    //             classNamePrefix="select"
    //             onChange={(selectedOptions) => {
    //                 const ids = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];                
    //                 setFieldValue("training_ids", ids);
    //             }}
    //             value={options.filter((opt) => values.training_ids?.includes(opt.value))}
    //         />
    //     );
    // }

    var options = ''
    options =  empList    
        .map((emp) =>
            ({
                value: emp.empId,
                label: `${emp.empName}`
            }) );

    async function onSubmit(values) {
        // console.log('training object is ',values)
        // let competencyObj = {
        //     competency_id : parseInt(values.score)
        // }
        // let timeSlotObj = {
        //     training_time_slot_id : parseInt(values.trainingTimeSlot)
        // }

        let competencyObj =   parseInt(values.score)
        
        let timeSlotObj =  parseInt(values.trainingTimeSlot)
        
        const formattedTrainingDate = dayjs(values.training_date).format('DD-MM-YYYY');

        let employeeObject;
        let employeeTraining;
        let updateEmpTraining;
        if(id!= -1) {
              
            values.employee = [Number(id)]
         
            await getTrainingsByEmployeeIdAndTrainingId(id,values.training_ids).then((result) => {

            updateEmpTraining = {
                    employeeIds : values.employee,
                    trainingTimeSlotId : timeSlotObj,
                    trainingDate : formattedTrainingDate,
                    trainingId : values.training_ids,
                    competencyId : competencyObj,
                    completionDate : formattedTrainingDate,
                    emp_train_id : result.data.emp_train_id
            }
            }).catch((error)=>{  })
 
                updateEmployeeTraining(updateEmpTraining).then((response) => {
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

            employeeObject = values.employee
            employeeTraining = {
                employeeIds : employeeObject,
                trainingTimeSlotId : timeSlotObj,
                trainingDate : formattedTrainingDate,
                trainingId : values.training_ids,
                competencyId : competencyObj,
                completionDate : formattedTrainingDate 
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
                 if(id!= -1) {         
                    showToast(error?.data?.errorMessage,"error")
                    navigate(`/training/employee/${id}`)
                 }
                 else {
                    showToast(error?.data?.errorMessage,"error")
                    navigate(`/viewemployees`)
                 }
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
        // if(values.competency=='') {
        //    errors.competency='No Competency is Selected'
        // }

        if(values.training_date==null) {
           errors.training_date='No Training Date is Selected'
        }

        return errors
    }

    function EmployeeMultiSelect({ options }) {
      const { setFieldValue, values } = useFormikContext();
    
      return (
        <Select
          styles={customStyles}
          name="employee"
          isMulti
        
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(selectedOptions) => {
            const ids = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
            setFieldValue("employee", ids);
          }}
          value={options.filter((opt) => values.employee?.includes(opt.value))}
        />
      );
    }

    function getEmployeesByTrainingAndCompetencyId( ) {
        
       let tid = parseInt(sessionStorage.getItem('training_id'))
       let cid = parseInt(sessionStorage.getItem('competency_id'))

       if(id == -1)
       {
            retrieveAllEmployeesUsingTrainingAndCompetencyId(tid,cid).then((response)=> {                
                empListDisabled && setEmpDisabled(false)
                setEmployeeList(response.data)
        }).catch((error)=>{
                setEmpDisabled(false)
                console.log(error.data )
                //showToast(error.data.errorMessage,'error')
        })
       }
       else {
        
            empListDisabled && setEmpDisabled(true)
       }
       
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
                            //employee: employee ? id : '',
                            employee : [],
                            competency : score ? score : '',
                             training_ids: '',
                            // training_ids: [],
                            trainingTimeSlot : trainingTimeSlot? trainingTimeSlot.training_time_slot_id :''
                        }}

                        validate={validate}
                        validateOnBlur={false}
                        validateOnChange={false}
                        onSubmit={onSubmit}
                        >
                        {({ setFieldValue, values, handleChange, handleBlur,  touched, errors }) => (
                            <Form>
                            {/* Training Select */}
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
                                        onChange={(option) =>
                                            {    
                                                setFieldValue('training_ids', option ? option.value : null);
                                                sessionStorage.setItem('training_id',option.value)
                                            }
                                        }                                             
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
                                            setFieldValue('score', option ? option.value : '');
                                            sessionStorage.setItem('competency_id',option.value)
                                            getEmployeesByTrainingAndCompetencyId()
                                        }}
                                        
                                        placeholder="Select Score"
                                    />
                                <FormHelperText error={touched.competency && Boolean(errors.competency)}>
                                <ErrorMessage name="competency" />
                                </FormHelperText>
                            </Box>

                            {/* Employee Dropdown */}
                            <Box mb={2}>
                                    <Typography variant="subtitle1">Employee</Typography>
                                    {
                                        empListDisabled ? (
                                            <>
                                            <TextField 
                                                fullWidth
                                                disabled="true"
                                                placeholder={id == -1 ? "No Employees Present" : employee.empName }
                                            />
                                            </>
                                        ) : (
                                        <>
                                       
                                        <EmployeeMultiSelect options={options} disabled={empListDisabled}/>
                                        {/* <Select
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
                                        </FormHelperText>    */}
                                    </>
                                   )
                                }
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
                                <FormHelperText error={touched.trainingTimeSlot && Boolean(errors.trainingTimeSlot)}><ErrorMessage name="trainingTimeSlot" /></FormHelperText>
                            </Box>

                            {/* Submit Button */}
                            <Box mt={2}>
                                <Button type="submit" variant="contained" disabled={!empList || empList.length === 0 || disabled }  color="primary">
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