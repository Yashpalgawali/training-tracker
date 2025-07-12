import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { retrieveCompanyById, saveCompany, updateCompany } from "../api/CompanyApiService"
import { ErrorMessage, Field, Formik,Form } from "formik"
import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"

export default function CompanyComponent () {

    const {id} =  useParams()
    const [comp_name , setCompName] = useState('')
    const [company_id ,setCompId] = useState('')
    const navigate = useNavigate()
    const [isDisabled, setIsDisabled] = useState(false)
    const [btnValue, setBtnValue] = useState('Add Company')

    useEffect(()=> {
        const getCompanyById = async() => {
             
            if(id != -1) {
                setBtnValue('Update Company')         
                retrieveCompanyById(id).then((response) => {
                    setCompName(response.data.comp_name)
                    setCompId(response.data.company_id)
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
                company_id : id , comp_name: values.comp_name
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
  
        if(values.comp_name.length<2) {
            errors.comp_name = 'Please Enter at least 2 Characters'
        }
        return errors
   }

     return (
        <div className="container">
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
            <Formik initialValues={ { company_id,comp_name} }
                enableReinitialize={true}
                onSubmit={onSubmit}
                validate={validate}
                validateOnBlur={false}
                validateOnChange={false}
            >
               {
                (props) => (
                    <Form>                       
                        {/* <fieldset>
                            <label htmlFor="comp_name" >Company</label>
                            <Field type="text" name="comp_name" className="form-control" placeholder="Enter Company name" ></Field>
                            <ErrorMessage  name='comp_name' component="div" className="alert alert-warning" />
                        </fieldset>
 
                        <div>
                            <Button type="submit"   variant="contained" color="primary" className="m-3">{btnValue}</Button>
                        </div> */}

                        <Box
                                sx={{ '& > :not(style)': { m: 1, width: '100ch' } }}
                                noValidate
                                autoComplete="off"
                                >
                                <TextField  id="comp_name"
                                            name="comp_name"
                                            label="Company Name"
                                            variant="filled"
                                            placeholder="Enter Company Name"
                                            value={props.values.comp_name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.comp_name && Boolean(props.errors.comp_name)}
                                            helperText={<ErrorMessage name="comp_name" />}
                                            fullWidth />
                                 {/* <ErrorMessage  name='comp_name' component="div" className="alert alert-warning" />                                  */}
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
//     <Box className="container" sx={{ p: 2 }}>
//     <Typography variant="h4"   gutterBottom>{btnValue}</Typography>

//     <Formik
//       initialValues={{ company_id, comp_name }}
//       enableReinitialize={true}
//       onSubmit={onSubmit}
//       validate={validate}
//       validateOnBlur={false}
//       validateOnChange={false}
//     >
//       {(formikProps) => (
//         <Form>
//           <Stack spacing={3} maxWidth="600px">
//             <TextField
//               id="comp_name"
//               name="comp_name"
//               label="Company Name" 
//               variant="standard"
//               placeholder="Enter Company Name"
//               value={formikProps.values.comp_name}
//               onChange={formikProps.handleChange}
//               onBlur={formikProps.handleBlur}
//               error={formikProps.touched.comp_name && Boolean(formikProps.errors.comp_name)}
//               helperText={<ErrorMessage name="comp_name" />}
//               fullWidth
//             />

//             <Box>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//               >
//                 {btnValue}
//               </Button>
//             </Box>
//           </Stack>
//         </Form>
//       )}
//     </Formik>
//   </Box>
// );
}