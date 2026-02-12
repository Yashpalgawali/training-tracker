import { useEffect, useRef, useState } from "react"
import { getEmployeeById,   retrieveAllEmployeesUsingTrainingAndCompetencyId, retrieveEmployeePresentForOtherTraining } from "../api/EmployeeApiService"
import { retrieveAllTraining } from "../api/TrainingApiService"
import { ErrorMessage, Form, Formik, useFormikContext } from "formik"
import Select from 'react-select';

import * as Yup from "yup";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import dayjs   from "dayjs";

import { Box, Button, CircularProgress,  FormHelperText,  TextField,  Typography } from "@mui/material";

import { getTrainingsByEmployeeIdAndTrainingId, saveEmployeeTraining, updateEmployeeTraining } from "../api/EmployeeTrainingApiService";
import { showToast } from "../SharedComponent/showToast";
import { useNavigate, useParams } from "react-router-dom";
import { retrieveAllTrainingTimeSlots } from "../api/TrainingTimeSlotApiService";
import { retrieveAllCompetencies } from "../api/CompetencyApiService";
import { retrieveAllHolidays  } from "../api/HolidayApiService";


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
    
    const [holidayList, setHolidayList] = useState([])
    const [loading, setLoading] = useState(false)

    const isWeekend = (date) => {
        if (!date || !date.isValid()) return false;
        const d = date.day();
        return d === 0  ; // Sun = 0, Sat = 6
    };

    const getHoliday = (date) => {
        if (!date || !date.isValid()) return false;

        let cdate = date.date();
        let month = date.month() + 1; // 1–12
        let year = date.year();
        
        cdate = cdate<10 ? '0'+cdate : '' + cdate
        month = month<10 ? '0'+month : '' + month

        let ndate = `${cdate}-${month}-${year}`
            
        if(cdate == '15' && month=='08') return true;

        if(cdate == '01' && month=='05') return true;

        if(cdate == '26' && month=='01') return true;

        return holidayList.some(h => h.holidayDate === ndate)

    };

const validationSchema = Yup.object({
  training_date: Yup.mixed()
    .nullable()
    .required("Training date is required")
    .test("valid-format", "Invalid date", (value) => value && value.isValid && value.isValid())
    .test("not-weekend", "Weekends not allowed", (value) => value && !isWeekend(value))
    .test("not-holiday", "This date is a holiday", (value) => value && !isHoliday(value))
    .test(
      "is-not-holiday",
      "Selected date is a holiday",
      function (value) {
        if (!value) return false;

        let d = value.date();
        let m = value.month() + 1;
        let y = value.year();

        d = d < 10 ? '0' + d : '' + d;
        m = m < 10 ? '0' + m : '' + m;

        const formatted = `${d}-${m}-${y}`;        
        return !holidayList.some(h => h.holidayDate === formatted);
      }
    ),
    trainingTimeSlot : Yup.mixed()
            .required('No Training Time Slot is Selected'),

    employee: Yup.mixed().test(
            'employee-required',
            'No Employee(s) selected',
            function (value) {
                const { id } = this.options.context;

                // If updating, skip validation
                if (id !== -1) return true;

                return Array.isArray(value) && value.length > 0;
            }
        )
});

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
                        if(response.data.status!=0)
                        {
                            setEmployee(response.data)
                        }
                        else {
                            showToast("Employee is not active","error")
                            navigate(`/viewemployees`)
                        }
                })
        }
    }, [id] )

    function getAllDetails() {

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
        retrieveAllHolidays().then((response) =>{
            setHolidayList(response.data)
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
       
        setDisabled(true)
        setLoading(true)
        let competencyObj = parseInt(values.score)

        let timeSlotObj =  parseInt(values.trainingTimeSlot)

        const formattedTrainingDate = dayjs(values.training_date).format('DD-MM-YYYY');

        let employeeObject;
        let employeeTraining;
        let updateEmpTraining;
     
        if(id!= -1) {

            values.employee = [Number(id)]

            await getTrainingsByEmployeeIdAndTrainingId(id,values.training_ids).then((response) => {
                
                updateEmpTraining = {
                    employeeIds : values.employee,
                    trainingTimeSlotId : timeSlotObj,
                    trainingDate : formattedTrainingDate,
                    trainingId : values.training_ids,
                    competencyId : competencyObj,
                    completionDate : formattedTrainingDate,
                    emp_train_id : response.data.emp_train_id
                }

                updateEmployeeTraining(updateEmpTraining).then((response) => {
                    showToast(response?.data?.responseMessage,"success")
                    navigate(`/viewemployees`)
                }).catch((error) => {
                   
                    showToast(error?.data?.errorMessage,"error")
                    navigate(`/viewemployees`)
                })

            }).catch((error) => {
 
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
                    showToast(`Training started of ${employee.empName}`,"success")
                    navigate(`/training/employee/${id}`)
                
                }).catch((error) => {
                    showToast(`Training is not started of ${employee.empName}`,"error")
                    navigate(`/training/employee/${id}`)
                })
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
                    showToast(response?.data?.responseMessage,"success")                   
                    navigate(`/viewemployees`)
                    
                }).catch((error) => {
                    showToast(error?.data?.errorMessage,"error")
                    navigate(`/viewemployees`)
                } )
        }        
    }

    const isHoliday = (date) => {
        return !!getHoliday(date);  
    };

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

    function getEmployeesByTrainingAndCompetencyId() {

        let tid = parseInt(sessionStorage.getItem('training_id'))
        let cid = parseInt(sessionStorage.getItem('competency_id'))
        let tdate = sessionStorage.getItem('training_date')
        const formattedTrainingDate = dayjs(tdate).format('DD-MM-YYYY');
        let timeslot = parseInt(sessionStorage.getItem('timeslot'))

        if(id == -1)
        { 
            retrieveAllEmployeesUsingTrainingAndCompetencyId(tid,cid,formattedTrainingDate,timeslot).then((response)=> {                
                empListDisabled && setEmpDisabled(false)
                setEmployeeList(response.data)
            }).catch((error)=> {
                sessionStorage.removeItem('training_id')
                sessionStorage.removeItem('competency_id')
                sessionStorage.removeItem('training_date')
                sessionStorage.removeItem('timeslot')
                setEmpDisabled(false)                
            })
       }
       else {
            empListDisabled && setEmpDisabled(true)
       }
    }

    function getEmployeePresentForOtherTraining(setFieldValue) {
         
        let tdate = sessionStorage.getItem('training_date')
        
        const formattedTrainingDate = dayjs(tdate).format('DD-MM-YYYY');

        let timeslot = parseInt(sessionStorage.getItem('timeslot'))

        retrieveEmployeePresentForOtherTraining(id,formattedTrainingDate,timeslot).then((response) => {
            if(response.data > 0)
            {
                showToast("Employee attended other Training","error")
                showToast("Please Select different Date or Time Slot","error")
                setFieldValue("training_date", null);
                setFieldValue("trainingTimeSlot","")
            }            
        })
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
                        validationSchema={validationSchema}
                        // validate={validate}
                        validateOnBlur={false}
                        validateOnChange={false}
                        onSubmit={onSubmit}
                        >
                        {({ setFieldValue, values, handleChange, handleBlur,  touched, errors }) => (
                            <Form>

                                 {/* Training Date Picker */}
                                <Box mb={2}  >
                                <DatePicker                                    
                                    shouldDisableDate={(date)=> isWeekend(date) || isHoliday(date) }
                                    format="DD-MM-YYYY"
                                    label="Training Date"
                                    value={values.training_date}
                                    onChange={(date) => {
                                        setFieldValue('training_date', date)
                                        sessionStorage.setItem('training_date',date)
                                    }}
                                    slotProps={{
                                    textField: { 
                                        error:  Boolean(errors.training_date),
                                        helperText:( () => {
                                            const h = getHoliday(values.training_date)
                                            if(h) return `${h.holiday} (${h.holidayDate})`
                                            return <ErrorMessage name="training_date" /> 
                                          }
                                        )
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
                                    onChange={(option) => {
                                        setFieldValue('trainingTimeSlot', option ? option.value : '')
                                        sessionStorage.setItem('timeslot',option.value)
                                        if(id!= -1) {
                                            getEmployeePresentForOtherTraining(setFieldValue)
                                        }
                                         
                                     }
                                    }
                                    placeholder="Select Training Time Slot"
                                />
                                <FormHelperText error={touched.trainingTimeSlot && Boolean(errors.trainingTimeSlot)}><ErrorMessage name="trainingTimeSlot" /></FormHelperText>
                            </Box>

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
                                        value= {
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
                                                disabled={true}
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

                            {/* Submit Button */}
                            <Box mt={2}>
                                <Button type="submit" variant="contained" disabled={!empList || empList.length === 0 || disabled }                                    
                                    startIcon= {
                                          disabled ? <CircularProgress size={20} color="teal" /> : null
                                        } color="primary">
                                {loading ? "Giving Training..." : btnValue }
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