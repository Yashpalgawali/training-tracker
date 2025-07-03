import { useEffect, useRef, useState } from "react"
import { getEmployeeById, retrieveAllEmployees } from "../api/EmployeeApiService"
import { retrieveAllTraining } from "../api/TrainingApiService"
import { Field, Form, Formik, useFormikContext } from "formik"
import Select from 'react-select';

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import dayjs, { Dayjs } from "dayjs";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Button, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { saveEmployeeTraining } from "../api/EmployeeTrainingApiService";
import { showToast } from "../SharedComponent/showToast";
import { useNavigate } from "react-router-dom";

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

    //const [value, setValue] = useState<Dayjs | null>(dayjs('2022-04-17'));

    useEffect(() => {
        
        if(!didFetchRun.current) {
            didFetchRun.current = false
            getAllDetails()
        }        
    },[])

    function getAllDetails() {
        retrieveAllEmployees().then((response) => {
            setEmployeeList(response.data)
        })
        retrieveAllTraining().then((response) => {
            console.log('training List ',response.data)
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
         
        // await getEmployeeById(employee).then((response)=>{
        //     alert('empolyu')
        //     setEmployee(response.data)
        // })
        let employeeTraining = {
            employee : employeeObject,
            training_date : values.training_date,
            training_ids : values.training_ids
        }
        // const formattedDate = dayjs(values.training_date).format('DD-MM-YYYY');
         
        // console.log('Formatted date '+formattedDate)
        
       
        
        saveEmployeeTraining(employeeTraining).then((response) => {
            showToast(response?.data?.responseMessage,"success")
            navigate(`/viewemployees`)
        })
        .catch((error) =>{
            showToast(error?.data?.errorMessage,"error")
            navigate(`/viewemployees`)
        })
    }

   return(
           <div className="container">
               <h2 className="text-center">{btnValue}</h2>
               <div>
                   <Formik
                       enableReinitialize={true}
                       initialValues={ {  training_date, completion_date , employee : '' , training_ids : []} }
                       validateOnBlur={false}
                       validateOnChange={false}
                       onSubmit={onSubmit}
                   >
                   {
                       ({ setFieldValue, values }) =>( 
                           <Form>
                              <fieldset>
                                   <label htmlFor="employee" ></label>
                                   <Field as="select" name="employee" className="form-control"  value={values.employee}>
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
                   </Formik>
               </div>
           </div>
       )
}  