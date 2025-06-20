import { useEffect, useRef, useState  } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Formik , Form, Field, useFormikContext } from "formik";
import { retrieveAllTraining } from "../api/TrainingApiService";
import { showToast } from "../SharedComponent/showToast";
import { getEmployeeById, saveEmployee } from "../api/EmployeeApiService";
import { getAllDepartments, getDepartmentByCompanyId } from "../api/DepartmentApiService";
import { getAllDesignations } from "../api/DesignationApiService";
import { retrieveAllCompanies } from "../api/CompanyApiService";

export default function EmployeeComponent() {

    const [emp_name,setEmpName] = useState('')
    const [emp_code,setEmpCode] = useState('')
    const [emp_id,setEmpId] = useState('')
    const [desig_name,setDesigName] = useState('')
    const [desig_id,setDesigID] = useState('')
    const [dept_id,setDeptID] = useState('')
    const [dept_name,setDeptName] = useState('')
    const [desiglist,setDesigList] = useState([])
    const [deptlist,setDeptList] = useState([])
    const [complist,setCompList] = useState([])
    const [traininglist,setTrainingList] = useState([])

    const [btnValue,setBtnValue] = useState('Add Employee')

    const {id} = useParams()
    const navigate = useNavigate()

    const { setFieldValue, values } = useFormikContext();

    const didRun = useRef(false)

    useEffect(() => {
        if(didRun.current) {
            return
        }
        didRun.current = true
        retrieveAllTraining().then((response)=> {
            setTrainingList(response.data)
        })
        getAllDepartments().then((response) => {
            setDeptList(response.data)
        })
        
        getAllDesignations().then((response)=> {
           setDesigList(response.data)
        })
        
        retrieveAllCompanies().then((response)=> {
            setCompList(response.data)
        })

        if(id != -1 ) {
            setBtnValue('Update Employee')
        }

    }, [] )

    function onSubmit(values) {
        let designation = {
            desig_id : values.designation.desig_id,
            desig_name : values.designation.desig_name
        }
        let department = {
            dept_id : values.department.dept_id,
            dept_name : values.department.dept_name
        }

        let employee = {
            emp_id : '',
            emp_name : values.emp_name,
            emp_code : values.emp_code,
            designation : designation,
            department : department
        }

        if(id== -1) {
            saveEmployee(employee).then((response)=> {
                showToast(response?.data?.responseMessage, "success")
                navigate('/viewemployees')
            }).catch((error)=> {
                showToast(error?.data?.errorResponseMessage, "error")
                navigate('/viewemployees')
            })
        }
    }

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
    return(
        <div className="container">
            <h2 className="text-center">{btnValue}</h2>
        <div>
            <Formik
                initialValues={ { emp_code, emp_name, } }
                enableReinitialize={true}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={onSubmit}
            >
            {
                ({ setFieldValue, values }) => (
                    <Form>
                        <fieldset>
                            <label htmlFor="emp_name">Employee Name</label>
                            <Field name="emp_name" className="form-control" placeholder="Enter Employee Name"></Field>
                        </fieldset>
                        <fieldset>
                            <label htmlFor="emp_code">Employee Code</label>
                            <Field name="emp_code" className="form-control" placeholder="Enter Employee Code"></Field>
                        </fieldset>
                        <fieldset>
                            <label htmlFor="joining_date">Joining Date</label>
                            <Field name="joining_date" className="form-control" placeholder="Enter Joining Date"></Field>
                        </fieldset>
                        <fieldset>
                            <label htmlFor="designation">Designation</label>
                            <Field as="select" name="designation" className="form-control">
                                <option>Select Designation</option>
                                {
                                    desiglist.map((desig)=>(
                                        <option value={desig.desig_id} key={desig.desig_id} >{desig.desig_name}</option>
                                    ))
                                }
                            </Field>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="company">Company</label>
                            <Field
                            as="select"
                            className="form-control"
                            name="company"
                            value={values.company}
                            onChange={(e) => handleCompanyChange(e, setFieldValue)}
                            >
                            <option value="">Please Select Company</option>
                            {complist.map((company) => (
                                <option
                                value={company.company_id}
                                key={company.company_id}
                                >
                                {company.comp_name}
                                </option>
                            ))}
                            </Field>
                        </fieldset>
                        <fieldset>
                            <label htmlFor="department">Department</label>
                            <Field
                                as="select"
                                className="form-control"
                                name="department"
                                value={values.department}
                                onChange={(e) => setFieldValue("department", e.target.value)}
                            >
                                <option value="">Please Select Department</option>
                                {deptlist.map((dept) => (
                                <option value={dept.dept_id} key={dept.dept_id}>
                                    {dept.dept_name}
                                </option>
                                ))}
                            </Field>
                            </fieldset>
                    </Form>
                )
            }
            </Formik>
        </div>
        </div>

    )
}