import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getDepartmentById, saveDepartment, updateDepartment } from "../api/DepartmentApiService"
import { ErrorMessage, Form, Formik } from "formik"
import { retrieveAllCompanies, retrieveCompanyById } from "../api/CompanyApiService"
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"

import * as Yup from "yup";
import { toast } from "react-toastify"

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
    
    const [selectedCompanyId, setSelectedCompanyId] = useState('');

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
                setSelectedCompanyId(response.data.company.companyId);  // << key  
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

        retrieveCompanyById(values.companies).then((response) => {            
             const compObj = {
                companyId   : response.data.companyId,
                compName : response.data.compName
             }
            const dept = {
                 deptId : values.deptId , deptName : values.deptName , company : compObj
            }
            if(id == -1) {
                saveDepartment(dept).then((response)=> {
                    setIsDisabled(false)
                    toast.success(response?.data?.responseMessage)
                    navigate(`/viewdepartments`)
                }).catch((error) => {
                    toast.success(error?.data?.errorMessage)
                    navigate(`/viewdepartments`)
                })
            }
            else { 
                    if(dept.company.companyId==null || dept.company.companyId=='') {
                        dept.company = company
                    }
                    updateDepartment(dept).then((response)=> {
                        toast.success(response?.data?.responseMessage)
                        setIsDisabled(false)
                        navigate(`/viewdepartments`)
                    }).catch((error) => {
                        toast.error(error?.data?.errorMessage)
                        setIsDisabled(false)
                        navigate(`/viewdepartments`)
                    })
                }            
            })
    }
 
    return(
          <Box>
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
            <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", p: 2 }}></Box>
            <Formik
                initialValues={ {  deptId , deptName , companies: selectedCompanyId } }
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                validateOnBlur={false}
                validateOnChange={false}
            >
                {
                    (props)=> (
                        <Form>
                            
                                
                                 <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

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
                                        disabled={isDisabled}
                                    >
                                    {btnValue}
                                    </Button>
                            </Box>
                        </Form>
                    )
                }                
            </Formik>
      </Box>
    );
}