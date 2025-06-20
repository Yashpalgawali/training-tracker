import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getDepartmentById, saveDepartment, updateDepartment } from "../api/DepartmentApiService"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { retrieveAllCompanies, retrieveCompanyById } from "../api/CompanyApiService"
import { Button } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"

export default function DepartmentComponent() {
    
    const {id} = useParams()

    
    const [btnValue,setBtnValue] = useState('Add Department')    
    const [companies,setCompanies] = useState([])
    const [dept_id,setDeptId] = useState('')
    const [dept_name,setDeptName] = useState('')
    const [isDisabled, setIsDisabled] =  useState(false)
    const [company,setCompany] = useState({
        company_id : '',
        comp_name : ''
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
            console.log('Dept Obj ',response.data)
                setCompany(response.data.company)
                setDeptId(response.data.dept_id)
                setDeptName(response.data.dept_name)    
           })
        }

     } 
        if(id) {
            retrieveDepartmentById()
        }
    }, [id])
    
     
    function validate(values) {
        let errors ={}
        if(values.dept_name.length <=1 ) {
            errors.dept_name='Department Name should be at least 2 characters'
        }
        return errors
    }
 
    function onSubmit(values) {
        setIsDisabled(true)
        setTimeout(() => {
            setIsDisabled(false)
        }, 2000);

        retrieveCompanyById(values.companies).then((response) => {
            
             const compObj = {
                company_id   : response.data.company_id,
                comp_name : response.data.comp_name
             }
            const dept = {
                dept_id : values.dept_id , dept_name : values.dept_name , company : compObj
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
                    if(dept.company.company_id==null || dept.company.company_id=='') {
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
            <h1>{btnValue}</h1>        
        <div>
            <Formik
                initialValues={ { dept_id , dept_name , companies:'' } }
                enableReinitialize={true}
                validate={validate}
                onSubmit={onSubmit}
                validateOnBlur={false}
                validateOnChange={false}
            >
                {
                    (props)=> (
                        <Form>
                            <fieldset className="form-group">
                            <label htmlFor="companies">Select Company </label>
                            <Field className="form-control" name="companies" as="select" >
                                <option>Please Select Company</option>
                                {
                                 companies.map(
                                    (company) =>(
                                        <option key={company.company_id} value={company.company_id}>{company.comp_name}</option>
                                    )
                                 )   
                                }
                            </Field>
                            <ErrorMessage  component="div" className="alert alert-warning" name="companies"/>
                        </fieldset>
                            <fieldset>
                            <label htmlFor="dept_name">Department</label>
                            <Field className="form-control" name="dept_name"  type="text"></Field>
                            <ErrorMessage  component="div" className="alert alert-warning" name="dept_name"/>
                        </fieldset>
                            <div>
                                <Button type="submit" disabled={isDisabled} id="submit" variant="contained" color="primary" className="m-3">{btnValue}</Button>    
                            </div>
                        </Form>
                    )
                }
            </Formik>
        </div>
        </div>
    )
    
}