import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getDepartmentById, saveDepartment, updateDepartment } from "../api/DepartmentApiService"
import { ErrorMessage, Form, Formik, useFormikContext } from "formik"
import { retrieveAllCompanies, retrieveCompanyById } from "../api/CompanyApiService"
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"

import * as Yup from "yup";

export default function DepartmentComponent() {
    
    const {id} = useParams()

    const [btnValue,setBtnValue] = useState('Add Department')    
    const [companies,setCompanies] = useState([])
    const [ deptId,setDeptId] = useState('')
    const [deptName,setDeptName] = useState('')
    const [isDisabled, setIsDisabled] =  useState(false)
    const [company,setCompany] = useState({
        companyId : '',
        compName : ''
    })
    const navigate = useNavigate()
    
    
    useEffect(() => {
     const retrieveDepartmentById = async() =>{
        retrieveAllCompanies().then((response)=> {
            setCompanies(response.data)            
        })
        if(id != -1)
        {
           setBtnValue('Update Department')
           getDepartmentById(id).then((response) => {
              
                setCompany(response.data.company)
                setDeptId(response.data.deptId)
                setDeptName(response.data.deptName)    
           })
        }
     } 
        if(id) {
            retrieveDepartmentById()
        }
    }, [id])
   
    const validationSchema =  Yup.object({
        deptName : Yup.string()
                    .required('Department name can\'t be blank')
                    .min(3,'Department Name must have at least 2 characters'),
        companies : Yup.string()
                    .required('Please Select Company')
    })

    function onSubmit(values) {
        setIsDisabled(true)
        setTimeout(() => {
            setIsDisabled(false)
        }, 2000);

        retrieveCompanyById(values.companies).then((response) => {            
             const compObj = {
                companyId   : response.data.companyId,
                compName : response.data.compName
             }
            const dept = {
                 deptId : values. deptId , deptName : values.deptName , company : compObj
            }
            if(id == -1) {
                saveDepartment(dept).then((response)=> {
                    showToast(response?.data?.responseMessage,"success")
                    navigate(`/viewdepartments`)
                }).catch((error) => {
                    showToast(error?.data?.errorMessage,"error")
                    navigate(`/viewdepartments`)
                })
            }
            else { 
                    if(dept.company.companyId==null || dept.company.companyId=='') {
                        dept.company = company
                    }
                    updateDepartment(dept).then((response)=> {
                        showToast(response?.data?.responseMessage,"success")
                        navigate(`/viewdepartments`)
                    }).catch((error) => {
                        showToast(error?.data?.errorMessage,"error")
                        navigate(`/viewdepartments`)
                    })
                }            
            })
    }
 
    return(
          <div className="container">
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
       
            <Formik
                initialValues={ {  deptId , deptName , companies:'' } }
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                validateOnBlur={false}
                validateOnChange={false}
            >
                {
                    (props)=> (
                        <Form>
                            <Box
                                    sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                                    noValidate
                                    autoComplete="off"
                                    >
                                {/* Dropdown Select */}
                                <FormControl
                                    variant="standard"
                                    fullWidth
                                    error={props.touched.companies && Boolean(props.errors.companies)}
                                >
                                    <InputLabel id="company-label">Select Company</InputLabel>
                                    <Select
                                    labelId="company-label"
                                    id="companies"
                                    name="companies"
                                    value={props.values.companies}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    >
                                        {
                                            companies.map(
                                                (company) =>(
                                                    <MenuItem key={company.companyId} value={company.companyId}>{company.compName}</MenuItem>
                                                ) )   
                                        }
                                    
                                    </Select>
                                    <FormHelperText>
                                    <ErrorMessage name="companies" />
                                    </FormHelperText>
                                </FormControl>
                                    <TextField  id="deptName"
                                                name="deptName"
                                                label="Department Name"
                                                variant="standard"
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
            </Formik>      
      </div>
    );
}