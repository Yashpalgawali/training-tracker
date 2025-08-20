import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { retrieveCompanyById, saveCompany, updateCompany } from "../api/CompanyApiService"
import { ErrorMessage, Field, Formik,Form } from "formik"
import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"
import { retrievecompetencyById, savecompetency, updatecompetency } from "../api/CompetencyApiService"

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
                        showToast(response?.data?.responseMessage,"success")
                        navigate('/competencies')
                        })
                    .catch((error) => {   
                        showToast(error?.data?.errorMessage,"error")
                        navigate('/competencies')
                    }) 
            }
            else {
                updatecompetency(competency)
                    .then((response)=> {
                        showToast(response?.data?.responseMessage,"success")
                        navigate('/competencies')
                    })
                    .catch((error) => {
                        showToast(error?.data?.errorMessage,"error")
                        navigate('/competencies')
                    })
            }
         }
  
   function validate(values) {
        let errors = { }
  
        if(values.score.length<0) {
            errors.comp_name = 'Please Enter some values'
        }
        return errors
   }

     return (
        <div className="container">
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
            <Formik initialValues={ { competency_id,score} }
                enableReinitialize={true}
                onSubmit={onSubmit}
                validate={validate}
                validateOnBlur={false}
                validateOnChange={false}
            >
               {
                (props) => (
                    <Form>                       
                        <Box
                            sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                            noValidate
                            autoComplete="off"
                            >
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
        </div>
    ); 
 
}