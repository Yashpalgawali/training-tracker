import { useEffect, useState } from "react"
import { useNavigate, useParams} from "react-router-dom";
import { Formik ,Form, ErrorMessage } from "formik";

import { getAllDesignations } from "../api/DesignationApiService";
import { retrieveAllCompanies } from "../api/CompanyApiService";
import { getDepartmentByCompanyId } from "../api/DepartmentApiService";
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

import { getEmployeeById, saveEmployee, updateEmployee } from "../api/EmployeeApiService";
import { showToast } from "../SharedComponent/showToast"
import { retrieveAllCategories } from "../api/CategoryApiService";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function EmployeeComponent() {

    const [btnValue, setBtnValue] = useState('Add Employee')
 
    const [emp_name, setEmpName] = useState('')
    const [emp_code, setEmpCode] = useState('')
    const [contractor_name, setContractorName] = useState('')
    const [joiningDate, setJoiningDate] = useState('')
    const [category , setCategory] = useState('')
    const [designation , setDesignations] = useState('')
    const [company ,setCompany] = useState('')
    const [department, setDepartment] = useState('')

    const [desiglist , setDesigList] = useState([])    
    const [complist , setCompList] = useState([])
    const [deptlist , setDeptList] = useState([])
    const [categorylist , setCategoryList] = useState([])
    const [statusList, setStatusList] = useState([
        { statusId: 1, statusLabel: "Active" },
        { statusId: 2, statusLabel: "Inactive" }
    ])

    const [status,setStatus] = useState('')

    const [loading,setLoading] = useState(false)

    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {

        getAllDesignations().then((response) => {
            setDesigList(response.data)
        })
        retrieveAllCategories().then((response) => {            
            setCategoryList(response.data)
        })
        retrieveAllCompanies().then((response) => {
            setCompList(response.data)
        })

        if(id != -1) {
            setBtnValue('Update Employee') 

            getEmployeeById(id).then((response) => {

                setEmpName(response.data.empName)
                setEmpCode(response.data.empCode)              
                setContractorName(response.data?.contractorName)
                setDesignations(response.data.designation?.desigId)                  
                setCompany(response.data.department.company?.companyId)

                setDepartment(response.data.department?.deptId);
                setStatus(response.data.status)

                let comp_id = response.data.department.company?.companyId

                getDepartmentByCompanyId(comp_id).then((response)=> {                   
                    setDeptList(response.data)                    
                })                
                setCategory(response.data.category?.category_id)                
                setJoiningDate(response.data?.joiningDate)
            })           
        }
    },[id] )

     const handleCompanyChange = async (event, setFieldValue) => {
       
        const compId = event.target.value;
        setFieldValue("company", compId);
      
        setDeptList([]);
          setFieldValue("department", "");

        if (compId) {
          await getDepartmentByCompanyId(compId).then((response)=>{
                 setDeptList(response.data);
                 setFieldValue("department", ""); // Reset department selection on company change
          }).catch((error) => {
            
            let cnf = window.confirm("No Departments in this company. Do you want to add Department")            
            if(cnf) {
                navigate(`/department/-1`)
            }
          })
         
        } else {
          setDeptList([]);
          setFieldValue("department", "");
        }
      };
    
    function  onSubmit(values) {
      
       let designation = {
            desigId : values.designation,
            desigName : ''
       }

       let department = {
            deptId : values.department,
            deptName : ''
       }
     
       let category = {
            category_id : values.category,
            category : ''
       }
   
    const formattedJoiningDate = dayjs(values.joiningDate).format("DD-MM-YYYY") 
    let employee = {
            empName : values.emp_name,
            empCode : values.emp_code,
            designation : designation,
            department : department,
            category : category,
            contractorName : values.contractor_name,
            joiningDate : formattedJoiningDate,
            status : values.status
        }
 
        if(id == -1) {
            saveEmployee(employee).then((response) => {                
                  showToast(response?.data?.responseMessage,"success")
                  navigate(`/viewemployees`)
                })
               .catch((error) => {        
                    showToast(error?.data?.errorMessage,"error")
                    navigate(`/viewemployees`)
                })
        }
        else {
            employee.empId = id
            updateEmployee(employee).then((response)=>{
                showToast(response?.data?.responseMessage,"success")
                navigate(`/viewemployees`)
            }).catch((error) => {
                showToast(error?.data?.errorMessage,"error")
                navigate(`/viewemployees`)
            })
        }
    }
    function validate(values) {
        let errors = {}

        if(values.emp_name=="") {
            errors.emp_name = "Please enter Employee Name "
        }

        if(values.emp_code=="") {
            errors.emp_code = "Please enter Employee Code "
        }

        if(values.contractor_name=="") {
            errors.contractor_name = "Please enter Contractor Name "
        }

        if(values.joiningDate==null) {
            errors.joiningDate = "Please Select Joining Date "
        }

        if(values.designation=="") {
            errors.designation = "Please Select Designation "
        }

        if(values.category=="") {
            errors.category = "Please Select Category "
        }

        if(values.company=="") {
            errors.company = "Please Select Company "
        }

        if(values.department=="") {
            errors.department = "Please Select Department "
        }

        if(values.status=="") {
            errors.status = "Please Select Status of the Employee "
        }

        return errors
    }
    return(
        <div className="container">
           <Typography variant="h4" gutterBottom>{btnValue}</Typography>
             <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Formik
                    enableReinitialize={true}
                    initialValues={{ emp_name, emp_code, designation, department, company, category, contractor_name, status,
                                    joiningDate: joiningDate ? dayjs(joiningDate,"DD-MM-YYYY") : null 
                                }}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validate={validate}
                    onSubmit={onSubmit}
                >
            {({ setFieldValue, values, handleChange, handleBlur, errors, touched }) => (
                <Form>
                {/* Employee Name */}
                <Box mb={2}>
                    <Typography variant="subtitle1">Employee Name</Typography>
                    <TextField
                        fullWidth
                        id="emp_name"
                        name="emp_name"
                        value={values.emp_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Employee Name"
                        variant="standard"
                        error={touched.emp_name && Boolean(errors.emp_name)}
                        helperText={<ErrorMessage name="emp_name" />}
                    />
                </Box>

                {/* Employee Code */}
                <Box mb={2}>
                    <Typography variant="subtitle1">Employee Code</Typography>
                    <TextField
                        fullWidth
                        id="emp_code"
                        name="emp_code"
                        value={values.emp_code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Employee Code"
                        variant="standard"
                        error={touched.emp_code && Boolean(errors.emp_code)}
                        helperText={<ErrorMessage name="emp_code" />}
                    />
                </Box>
                
                {/* Contractor Name */}
                <Box mb={2}>
                    <Typography variant="subtitle1">Contractor Name</Typography>
                    <TextField
                        fullWidth
                        id="contractor_name"
                        name="contractor_name"
                        value={values.contractor_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Contractor Name"
                        variant="standard"
                        error={touched.contractor_name && Boolean(errors.contractor_name)}
                        helperText={<ErrorMessage name="contractor_name" />}
                    />
                </Box>
                {/* Joining Date Picker */}
                <Box mb={2}>
                    <DatePicker
                        format="DD-MM-YYYY"
                        label="Joining Date"
                        //  value={values.joiningDate ? dayjs(values.joiningDate, "DD/MM/YYYY") : ""}
                        value={values.joiningDate}
                        onChange={(date) =>  setFieldValue("joiningDate", date) }
                        slotProps={{
                        textField: {
                                fullWidth: true,
                                error: touched.joiningDate && Boolean(errors.joiningDate),
                                helperText: <ErrorMessage name="joiningDate" />
                            }
                        }}
                    />
                    </Box>
                
                {/* Designation */}
                <Box mb={2}>
                    <FormControl fullWidth variant="standard" error={touched.designation && Boolean(errors.designation)}>
                    <InputLabel id="designation-label">Designation</InputLabel>
                    <Select
                        labelId="designation-label"
                        id="designation"
                        name="designation"
                        value={values.designation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Designation"
                    >
                        <MenuItem value="">Please Select Designation</MenuItem>
                        {desiglist.map((desig) => (
                        <MenuItem key={desig.desigId} value={desig.desigId}>
                            {desig.desigName}
                        </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText><ErrorMessage name="designation" /></FormHelperText>
                    </FormControl>
                </Box>

                {/* Category */}
                <Box mb={2}>
                    <FormControl fullWidth variant="standard" error={touched.category && Boolean(errors.category)}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Category"
                    >
                        <MenuItem value="">Please Select Category</MenuItem>
                        {categorylist.map((cate) => (
                        <MenuItem key={cate.category_id} value={cate.category_id}>
                            {cate.category}
                        </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText><ErrorMessage name="category" /></FormHelperText>
                    </FormControl>
                </Box>
               
                {/* Company */}
                <Box mb={2}>
                    <FormControl fullWidth variant="standard" error={touched.company && Boolean(errors.company)}>
                    <InputLabel id="company-label">Company</InputLabel>
                    <Select
                        labelId="company-label"
                        id="company"
                        name="company"
                        value={values.company}
                        onChange={(e) => handleCompanyChange(e, setFieldValue)}
                        onBlur={handleBlur}
                        label="Company"
                    >
                        <MenuItem value="">Please Select Company</MenuItem>
                        {complist.map((company) => (
                        <MenuItem key={company.companyId} value={company.companyId}>
                            {company.compName}
                        </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText><ErrorMessage name="company" /></FormHelperText>
                    </FormControl>
                </Box>

                {/* Department */}
                <Box mb={2}>
                    <FormControl fullWidth variant="standard" error={touched.department && Boolean(errors.department)}>
                    <InputLabel id="department-label">Department</InputLabel>
                    <Select
                        labelId="department-label"
                        id="department"
                        name="department"
                        value={values.department}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Department"
                    >
                        <MenuItem value="">Please Select Department</MenuItem>
                        {deptlist.map((dept) => (
                        <MenuItem key={dept.deptId} value={dept.deptId}>
                            {dept.deptName}
                        </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText><ErrorMessage name="department" /></FormHelperText>
                   </FormControl>
                </Box>

                {/* Employee Status */}
                <Box mb={2}>
                    <FormControl fullWidth variant="standard" error={touched.status && Boolean(errors.status)}>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Status"
                    >
                        <MenuItem value="">Please Select Status</MenuItem>
                        {statusList.map((status) => (
                        <MenuItem key={status.statusId} value={status.statusId}>
                            {status.statusLabel}
                        </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText><ErrorMessage name="status" /></FormHelperText>
                    </FormControl>
                </Box>
                {/* Submit Button */}
                <Box mt={3}>
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
                    initialValues={ { emp_name, emp_code, designation , department , company } }
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={onSubmit}
                >
                {
                    ({ setFieldValue, values }) =>( 
                        <Form> */}
                            {/* <fieldset className="form-group">
                                <label htmlFor="emp_name">Employee Name</label>
                                <Field name="emp_name" className="form-control" value={values.emp_name} placeholder="Enter Employee Name" type="text"></Field>
                            </fieldset>
                            <fieldset className="form-group">
                                <label htmlFor="emp_code">Employee Code</label>
                                <Field name="emp_code" className="form-control" value={values.emp_code} placeholder="Enter Employee Code" type="text"></Field>
                            </fieldset>

                            <fieldset>
                                <label htmlFor="designation" ></label>
                                <Field as="select" name="designation" className="form-control"  value={values.designation}>
                                    <option>Please Select Designation</option>
                                    {
                                        desiglist.map(
                                            (desig)=> (
                                                <option key={desig.desigId} value={desig.desigId}>{desig.desigName}</option>
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
                                                <option key={company.companyId} value={company.companyId}>{company.comp_name}</option>
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
                                                <option key={dept.deptId} value={dept.deptId}>{dept.deptName}</option>
                                            )
                                        )
                                    }
                                </Field>
                            </fieldset>

                            <div>
                                <Button type="submit" variant="contained" color="primary" className="mt-2" >{btnValue}</Button>
                            </div> */}
                            {/* <Box
                                    sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                                    noValidate
                                    autoComplete="off"
                                    > */}
                               {/* Dropdown Select */}
                                {/* <FormControl
                                    variant="filled"
                                    fullWidth
                                    error={props.touched.companies && Boolean(props.errors.companies)}
                                >
                                    <InputLabel id="companies">Company</InputLabel>
                                    <Select
                                    labelId="companies"
                                    id="companies"
                                    name="companies"
                                    value={props.values.companies}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    >
                                        {
                                            companies.map(
                                                        (company) =>(
                                                            <MenuItem key={company.companyId} value={company.companyId}>{company.comp_name}</MenuItem>
                                                        )
                                                        )   
                                        }
                                    
                                    </Select>
                                    <FormHelperText>
                                    <ErrorMessage name="companies" />
                                    </FormHelperText>
                                </FormControl>
                                    <TextField  id="deptName"
                                                name="deptName"
                                                label="Department Name"
                                                variant="filled"
                                                placeholder="Enter Department Name"
                                                value={props.values.deptName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                error={props.touched.deptName && Boolean(props.errors.deptName)}
                                                helperText={<ErrorMessage name="deptName" />}
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
                </Formik> */}
            </div>
        </div>
    )
}