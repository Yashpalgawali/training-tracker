import { useEffect, useState } from "react"
import { useNavigate, useParams} from "react-router-dom";
import { Formik ,Form, ErrorMessage } from "formik";

import { getAllDesignations } from "../api/DesignationApiService";
import { retrieveAllCompanies } from "../api/CompanyApiService";
import { getDepartmentByCompanyId } from "../api/DepartmentApiService";
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

import { getEmployeeByEmpCode, getEmployeeById, saveEmployee, updateEmployee } from "../api/EmployeeApiService";
import { showToast } from "../SharedComponent/showToast"
import { retrieveAllCategories } from "../api/CategoryApiService";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";

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
        { statusId: 0, statusLabel: "Inactive" }
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
                console.log('Employee Object ',response.data)
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
        setLoading(true)
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
                 
                console.log(error)
                showToast(error.response.data?.errorMessage,"error")
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
 
    const validationSchema = Yup.object({
        emp_name : Yup.string()
                    .required('Employee Name can\'t be blank')
                    .min(3, 'Employee name must have at least two characters'),

        emp_code : Yup.string()
                    .required('Employee code can\'t be blank')
                    .test("is-employee-present","Employee already registered with this code", async (code)=> {
                        try{
                            await getEmployeeByEmpCode(code)
                            return true
                        }
                        catch(e) {
                            return false
                        }
                    }),
            
        contractor_name : Yup.string()
                        .required('Contractor name can\'t be blank'),
        company : Yup.string()
                .required('Please Select Company'),
        department : Yup.string()
                .required('Please Select Department'),
        category : Yup.string()
                .required('Please Select Category'),
        designation : Yup.string()
                        .required('Please Select Designation'),
        joiningDate : Yup.string()
                .required('Please Enter Joinining Date'),
        status : Yup.string()
                .required('Please select status of the employee')                
            })

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
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
            {({ setFieldValue, setFieldError, values, handleChange, handleBlur, errors, touched }) => (
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
                {/* COmment added */}
                {/* Designation */}
                <Box mb={2}>
                    <FormControl fullWidth variant="standard" error={touched.designation && Boolean(errors.designation)}>
                    <InputLabel id="designation-label">Please Select Designation</InputLabel>
                    <Select
                        labelId="designation-label"
                        id="designation"
                        name="designation"
                        value={values.designation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Designation"
                    >
                        <MenuItem value="" >Please Select Designation</MenuItem>
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
                    <InputLabel id="category-label">Please Select Category</InputLabel>
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
                    <InputLabel id="company-label">Please Select Company</InputLabel>
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
                    <InputLabel id="department-label">Please Select Department</InputLabel>
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
                <Box>
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
                    <Button type="submit" variant="contained" disabled={loading} color="primary">
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