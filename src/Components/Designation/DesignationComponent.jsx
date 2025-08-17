import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getDesignationById, saveDesignation, updateDesignation } from "../api/DesignationApiService"
import { Button } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"

export default function DesignationComponent() {
    const [btnValue,setBtnValue] = useState('Add Designtion')
    const [desig_name,setDesigName]  = useState('')
    const [desig_id,setDesigId]  = useState('')

    const navigate = useNavigate()
    const {id} = useParams()

    useEffect( 
        () => {
            retrieveDesignationById()
        } , 
    )

    function retrieveDesignationById ()  {
        if(id != -1) {
            setBtnValue('Update Designation')
            getDesignationById(id).then((response) => {
                 setDesigName(response.data.desig_name)
                 setDesigId(response.data.desig_id)
            }).catch((error)=>{
                sessionStorage.setItem('reserr',error.response.data.errorMessage)
                navigate(`/viewdesignations`)
            }) 

        }
    }

    function validate(values) {
        
        let errors  = {} 

        if(values.desig_name.length<2) {
            errors.desig_name="Enter at least 2 characters"
        }
        return errors
    }

    function onSubmit(values) {
        let designation = {
            desig_id : id,
            desig_name : values.desig_name
        }
        if(id != -1) {
           
            updateDesignation(designation).then((response) => {
                showToast(response?.data?.responseMessage,"success")
                navigate(`/viewdesignations`)
            })
            .catch((error) => {
                showToast(error?.data?.errorMessage,"error")
                navigate(`/viewdesignations`)
            })
        }
        else {
            saveDesignation(designation).then((response) => {
                showToast(response?.data?.responseMessage,"success")
                navigate(`/viewdesignations`)
            })
            .catch((error) => {
                showToast(error?.data?.errorMessage,"error")
                navigate(`/viewdesignations`)
            })
        }
    }
    
    return(
        <div className="container">
            <h1>{btnValue}</h1>
            <Formik
                initialValues={ { desig_id  ,desig_name } }
                enableReinitialize={true}
                validate={validate}
                onSubmit={onSubmit}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {
                    (props) => (
                        <Form>
                            <fieldset>
                                <label htmlFor="design_name">Designation</label>
                                <Field type="text" name="desig_name" className="form-control" placeholder="Enter Designation" ></Field>
                                <ErrorMessage  component="div"  name="desig_name"  className="alert alert-warning"/>
                            </fieldset>
                            <div>
                                <Button type="submit" variant="contained" color="primary" className="m-3">{btnValue}</Button>
                            </div>
                        </Form>
                    )
                }
            </Formik>
        </div>
    )
}