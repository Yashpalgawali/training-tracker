import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { retrieveCompanyById, saveCompany, updateCompany } from "../api/CompanyApiService"
import { ErrorMessage,  Formik,Form } from "formik"
import { Box, Button, TextField, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"

export default function CompanyComponent () {

    const {id} =  useParams()
    const [compName , setCompName] = useState('')
    const [companyId ,setCompId] = useState('')
    const navigate = useNavigate()
    const [isDisabled, setIsDisabled] = useState(false)
    const [btnValue, setBtnValue] = useState('Add Company')

    useEffect(()=> {
        const getCompanyById = async() => {
             
            if(id != -1) {
                setBtnValue('Update Company')         
                retrieveCompanyById(id).then((response) => {
                    setCompName(response.data.compName)
                    setCompId(response.data.companyId)
                })
                .catch((error)=> { 
                    sessionStorage.setItem('reserr',error.response.data.errorMessage)
                    navigate(`/companies`)
                })
            }
        };

        if(id){
            getCompanyById()
        }
    }, [id] ) 
       

    function onSubmit(values) {
        setIsDisabled(true)
            const company = {
                companyId : id , compName: values.compName
            }

            setTimeout(() => {
                setIsDisabled(false)
            }, 1000);

            if(id == -1) {
                saveCompany(company)
                    .then((response)=> {
                        showToast(response?.data?.responseMessage,"success")
                        navigate('/companies')
                        })
                    .catch((error) => {   
                        showToast(error?.data?.errorMessage,"error")
                        navigate('/companies')
                    }) 
            }
            else {
                updateCompany(company)
                    .then((response)=> {
                        showToast(response?.data?.responseMessage,"success")
                        navigate('/companies')
                    })
                    .catch((error) => {
                        showToast(error?.data?.errorMessage,"error")
                        navigate('/companies')
                    })
            }
         }
  
   function validate(values) {
        let errors = { }
  
        if(values.compName.length<2) {
            errors.compName = 'Please Enter at least 2 Characters'
        }
        return errors
   }

     return (
        <div className="container">
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
            <Formik initialValues={ { companyId,compName} }
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
                                <TextField  id="compName"
                                            name="compName"
                                            label="Company Name"
                                            variant="standard"
                                            placeholder="Enter Company Name"
                                            value={props.values.compName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.compName && Boolean(props.errors.compName)}
                                            helperText={<ErrorMessage name="compName" />}
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