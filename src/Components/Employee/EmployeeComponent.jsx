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

    const [btnValue,setBtnValue] = useState('Add Employee')
 
    const [emp_name, setEmpName] = useState('')
    const [emp_code,setEmpCode] = useState('')
    const [contractor_name,setContractorName] = useState('')

    const [joining_date, setJoiningDate] = useState('')
    const [category , setCategory] = useState('')
    const [designation , setDesignations] = useState('')
    const [company ,setCompany] = useState('')
    const [department, setDepartment] = useState('')

    const [desiglist , setDesigList] = useState([])    
    const [complist , setCompList] = useState([])
    const [deptlist , setDeptList] = useState([])
    const [categorylist , setCategoryList] = useState([])

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

                setEmpName(response.data.emp_name)
                setEmpCode(response.data.emp_code)              
                setContractorName(response.data?.contractor_name)
                setDesignations(response.data.designation?.desig_id)
                setCompany(response.data.department.company?.company_id)
                setCategory(response.data.category?.category_id)
                
                    // ✅ format joining_date for Formik initialValues
                if (response.data?.joining_date) {
                    const formattedDate = dayjs(response.data.joining_date).format("DD/MM/YYYY");
                    // setJoiningDate(formattedDate); // this will flow into Formik's initialValues
                    setJoiningDate(dayjs(formattedDate));
                }           
   
                let comp_id = response.data.department.company?.company_id

                getDepartmentByCompanyId(comp_id).then((response)=> {
                    setDepartment(response.data.department?.dept_id);
                    setDeptList(response.data)                    
                })                
            })
        }
    },[id] )

     const handleCompanyChange = async (event, setFieldValue) => {
        const compId = event.target.value;
        setFieldValue("company", compId);
      
        if (compId) {
          await getDepartmentByCompanyId(compId).then((response)=>{
                 setDeptList(response.data);
                 setFieldValue("department", ""); // Reset department selection on company change
          }).catch((error) => {
            
            let cnf = window.confirm("No Departments in this company. Do you want to add Department(s)")
            
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
            desig_id : values.designation,
            desig_name : ''
       }

       let department = {
            dept_id : values.department,
            dept_name : ''
       }
     
       let category = {
            category_id : values.category,
            category : ''
       }
    
       const formattedJoiningDate = dayjs(values.joining_date).format("DD/MM/YYYY")

       let employee = {
            emp_name : values.emp_name,
            emp_code : values.emp_code,
            designation : designation,
            department : department,
            category : category,
            contractor_name : values.contractor_name,
            joining_date : formattedJoiningDate           
        }
    
        console.log("Employee Object ",employee)

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
            employee.emp_id = id

            updateEmployee(employee).then((response)=>{
                showToast(response?.data?.responseMessage,"success")
                navigate(`/viewemployees`)
            }).catch((error) => {
                showToast(error?.data?.errorMessage,"error")
                navigate(`/viewemployees`)
            })
        }

    }

    return(
        <div className="container">
           <Typography variant="h4" gutterBottom>{btnValue}</Typography>
             <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Formik
            enableReinitialize={true}
            initialValues={{ emp_name, emp_code, designation, department, company, category, contractor_name, joining_date: joining_date ? dayjs(joining_date) : null }}
            validateOnBlur={false}
            validateOnChange={false}
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
                        format="DD/MM/YYYY"
                        label="Joining Date"
                        // value={values.joining_date ? dayjs(values.joining_date, "DD/MM/YYYY") : null}
                        value={values.joining_date}
                       onChange={(date) => setFieldValue("joining_date", date)}
                        slotProps={{
                        textField: {
                            fullWidth: true,
                            error: touched.joining_date && Boolean(errors.joining_date),
                            helperText: <ErrorMessage name="joining_date" />
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
                        <MenuItem key={desig.desig_id} value={desig.desig_id}>
                            {desig.desig_name}
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

                 {/* Category
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
                        {categorylist.map((cat) => (
                        <MenuItem key={cat.category_id} value={cat.category_id}>
                            {cat.category}
                        </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText><ErrorMessage name="category" /></FormHelperText>
                    </FormControl>
                </Box> */}
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
                        <MenuItem key={company.company_id} value={company.company_id}>
                            {company.comp_name}
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
                        <MenuItem key={dept.dept_id} value={dept.dept_id}>
                            {dept.dept_name}
                        </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText><ErrorMessage name="department" /></FormHelperText>
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
                                                            <MenuItem key={company.company_id} value={company.company_id}>{company.comp_name}</MenuItem>
                                                        )
                                                        )   
                                        }
                                    
                                    </Select>
                                    <FormHelperText>
                                    <ErrorMessage name="companies" />
                                    </FormHelperText>
                                </FormControl>
                                    <TextField  id="dept_name"
                                                name="dept_name"
                                                label="Department Name"
                                                variant="filled"
                                                placeholder="Enter Department Name"
                                                value={props.values.dept_name}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                error={props.touched.dept_name && Boolean(props.errors.dept_name)}
                                                helperText={<ErrorMessage name="dept_name" />}
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