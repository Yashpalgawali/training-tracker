import { Button, useStepContext } from "@mui/material"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { saveTraining, updateTraining } from "../api/TrainingApiService"
import { showToast } from "../SharedComponent/showToast"

export default function TrainingComponent() {
    const [btnValue,setBtnValue] = useState('Add Training')
    const [training_id,setTrainingId] = useState('')
    const [training_name,setTrainingName] = useState('')

    const {id} = useParams()

    const navigate = useNavigate()

    useEffect(()=> {
        if(id != -1)
        {
            setBtnValue('Update Training')
        }
        
    },[id])

    function onSubmit(values) {
        let training = {
            training_id : values.training_id,
            training_name : values.training_name
        }

        if(id == -1) {
            saveTraining(training).then((response) => {
                console.log('Success ',response)
                showToast(response?.data?.responseMessage,"success")
                navigate(`/viewtraining`)
            })
            .catch((error)=>{
                console.log('error in training ',error)
                showToast(error?.data?.errorMessage,"error")
                navigate(`/viewtraining`)
            })
        }
        else {
           updateTraining(training).then((response) => {
                console.log('Success ',response)
                showToast(response?.data?.responseMessage,"success")
                navigate(`/viewtraining`)
            })
            .catch((error)=>{
                console.log('error in training ',error)
                showToast(error?.data?.errorMessage,"error")
                navigate(`/viewtraining`)
            }) 
        }
    }

    return(
        <div className="container">
            <div> 
                <h2 className="text-center">{btnValue}</h2>
                
            </div>
            <div>
               <Formik
                    initialValues={ { training_id, training_name } }
                    enableReinitialize={true}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={onSubmit}
               >
                {
                     (props) => (
                        <Form>
                            <fieldset>
                                    <label htmlFor="training_name"></label>
                                    <Field type="text" name="training_name" className="form-control"   placeholder="Enter Training name" ></Field>
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