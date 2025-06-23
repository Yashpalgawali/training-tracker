import { useEffect, useState } from "react"
import { useNavigate, useParams} from "react-router-dom";
import { Formik ,Form, Field, useFormikContext } from "formik";
import { retrieveAllTraining } from "../api/TrainingApiService";
import { getAllDesignations } from "../api/DesignationApiService";
import { retrieveAllCompanies } from "../api/CompanyApiService";
import { getDepartmentByCompanyId } from "../api/DepartmentApiService";
import { Button } from "@mui/material";
import Select from 'react-select';
import { getEmployeeById, saveEmployee } from "../api/EmployeeApiService";

export default function EmployeeComponent() {

    const [btnValue,setBtnValue] = useState('Add Employee')

    const [emp_name, setEmpName] = useState('')
    const [emp_code,setEmpCode] = useState('')
    const [joining_date,setEmpJoiningDate] = useState('')
    const [designations , setDesignations] = useState('')
    const [department, setDepartment] = useState('')
    const [desiglist , setDesigList] = useState([])
    const [complist , setCompList] = useState([])
    const [deptlist , setDeptList] = useState([])
    const [traininglist , setTrainingList] = useState([])

    const {id} = useParams()
    const navigate = useNavigate()
   
    useEffect(() => {
      
        getAllDesignations().then((response) => {
            setDesigList(response.data)
        })
        retrieveAllTraining().then((response) => {
            setTrainingList(response.data)
        })
        retrieveAllCompanies().then((response) => {
            setCompList(response.data)
        })
 
        if(id != -1) {
            setBtnValue('Update Employee')
            getEmployeeById(id).then((response) => {
                console.log(response)
                setEmpName(response.data.emp_name)
                setEmpCode(response.data.emp_code)
                setEmpJoiningDate(response.data.joining_date)
                setDesignations(response.data.designation)
            })
        }
    },[] )
    

     const handleCompanyChange = async (event, setFieldValue) => {
        const compId = event.target.value;
        setFieldValue("company", compId);
      
        if (compId) {
          const response = await getDepartmentByCompanyId(compId);
          setDeptList(response.data);
          setFieldValue("department", ""); // Reset department selection on company change
        } else {
          setDeptList([]);
          setFieldValue("department", "");
        }
      };
    function onDepartmentChange(event) {
        alert(event.target.value)
    }
    
    function  onSubmit(values) {
       
        let employee = {
            emp_name : values.emp_name,
            emp_code : values.emp_code,
            joining_date : values.joining_date,
            designationId : values.designations,
            departmentId : values.department,
            training_ids : values.training_ids
        }
        console.log(employee)
        saveEmployee(employee).then((response) => {
            alert('saved')
        }).catch((error) => {
            alert('error')
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
    options =  traininglist    
        .map((training) =>
            ({
                value: training.training_id,
                label: `${training.training_name}`
            }) );

    return(
        <div className="container">
            <h2 className="text-center">{btnValue}</h2>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={ { emp_name, emp_code, joining_date, designations : '', department : '', company : '' ,training_ids : []} }
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={onSubmit}
                >
                {
                    ({ setFieldValue, values }) =>(
                        <Form>
                            <fieldset className="form-group">
                                <label htmlFor="emp_name">Employee Name</label>
                                <Field name="emp_name" className="form-control" value={values.emp_name} placeholder="Enter Employee Name" type="text"></Field>
                            </fieldset>
                            <fieldset className="form-group">
                                <label htmlFor="emp_code">Employee Code</label>
                                <Field name="emp_code" className="form-control" value={values.emp_code} placeholder="Enter Employee Code" type="text"></Field>
                            </fieldset>
                              <fieldset className="form-group">
                                <label htmlFor="joining_date">Employee Code</label>
                                <Field name="joining_date" className="form-control" value={values.joining_date} placeholder="Enter Employee Code" type="text"></Field>
                            </fieldset>
                            <fieldset>
                                <label htmlFor="designations" ></label>
                                <Field as="select" name="designations" className="form-control"  value={values.designations}>
                                    <option>Please Select Designation</option>
                                    {
                                        desiglist.map(
                                            (desig)=>(
                                                <option key={desig.desig_id} value={desig.desig_id}>{desig.desig_name}</option>
                                            )
                                        )
                                    }
                                </Field>
                            </fieldset>
                            <fieldset>
                                <label htmlFor="company" ></label>
                                <Field as="select" name="company" className="form-control" value={values.company}  onChange={(e) => handleCompanyChange(e, setFieldValue)} >
                                    <option>Please Select Company</option>
                                    {
                                        complist.map(
                                            (company)=>(
                                                <option key={company.company_id} value={company.company_id}>{company.comp_name}</option>
                                            )
                                        )
                                    }
                                </Field>
                            </fieldset>
                             <fieldset>
                                <label htmlFor="department" ></label>
                                <Field as="select" name="department" className="form-control" value={values.department}   >
                                    <option>Please Select Department</option>
                                    {
                                        deptlist.map(
                                            (dept)=>(
                                                <option key={dept.dept_id} value={dept.dept_id}>{dept.dept_name}</option>
                                            )
                                        )
                                    }
                                </Field>
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