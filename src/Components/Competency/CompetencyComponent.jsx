import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ErrorMessage,  Formik,Form } from "formik"
import { Box, Button, TextField, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"
import { retrievecompetencyById, savecompetency, updatecompetency } from "../api/CompetencyApiService"
import * as Yup from "yup";
import { toast } from "react-toastify"

export default function CompetencyComponent () {

    const {id} =  useParams()
    const [score , setScore] = useState('')
    const [competency_id ,setCompetencyId] = useState('')
    const navigate = useNavigate()
    const [isDisabled, setIsDisabled] = useState(false)
    const [btnValue, setBtnValue] = useState('Add Competency')

    useEffect(()=> {
        const getCompetencyById = async() => {
             
            if(id != -1) {
                setBtnValue('Update Competency')         
                retrievecompetencyById(id).then((response) => {
                    setScore(response.data.score)
                    setCompetencyId(response.data.competency_id)
                })
                .catch((error)=> { 
                    sessionStorage.setItem('reserr',error.response.data.errorMessage)
                    navigate(`/competencies`)
                })
        }
        };

        if(id) {
            getCompetencyById()
        }
    }, [id] ) 

    function onSubmit(values) {
        setIsDisabled(true)
            const competency = {
                competency_id : id , score: values.score
            }

            setTimeout(() => {
                setIsDisabled(false)
            }, 1000);

            if(id == -1) {
                savecompetency(competency)
                    .then((response)=> {
                        toast.success(response?.data?.responseMessage)
                        navigate('/competencies')
                        })
                    .catch((error) => {   
                        toast.error(error?.data?.errorMessage)
                        navigate('/competencies')
                    }) 
            }
            else {
                updatecompetency(competency)
                    .then((response)=> {
                        toast.success(response?.data?.responseMessage)
                        navigate('/competencies')
                    })
                    .catch((error) => {
                        toast.error(error?.data?.errorMessage)
                        navigate('/competencies')
                    })
            }
         }

    const validationSchema = Yup.object({
         score: Yup.mixed()
            .required("Competency Score is required")
    })
 
     return (
         
          <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", p: 2 }}>
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
            <Formik initialValues={ { competency_id,score} }
                enableReinitialize={true}
                onSubmit={onSubmit}
                validateOnBlur={false}
                validationSchema={validationSchema}
                validateOnChange={false}
            >
               {
                (props) => (
                    <Form>                       
                       <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField  id="score"
                                            name="score"
                                            label="Score"
                                            variant="standard"
                                            placeholder="Enter Score"
                                            value={props.values.score}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.score && Boolean(props.errors.score)}
                                            helperText={<ErrorMessage name="score" />}
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
            </Box>
         
    ); 
 
}