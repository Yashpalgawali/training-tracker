import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { retrieveCategoryById, saveCategory, updateCategory } from "../api/CategoryApiService"
import { ErrorMessage, Field, Formik,Form } from "formik"
import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"
 
export default function CategoryComponent () {

    const {id} =  useParams()
    const [category , setCategory] = useState('')
    const [category_id ,setCategoryId] = useState('')

    const navigate = useNavigate()
    
    const [isDisabled, setIsDisabled] = useState(false)
    const [btnValue, setBtnValue] = useState('Add Category')

    useEffect(()=> {
        const getCategoryById = async() => {
             
            if(id != -1) {
                setBtnValue('Update category')         
                retrieveCategoryById(id).then((response) => {
                    setCategory(response.data.category)
                    setCategoryId(response.data.category_id)
                })
                .catch((error)=> { 
                    sessionStorage.setItem('reserr',error.response.data.errorMessage)
                    navigate(`/viewcategories`)
                })
        }
        };

        if(id){
            getCategoryById()
        }
    }, [id] ) 
       

    function onSubmit(values) {
        setIsDisabled(true)
            const category = {
                category_id : id , category: values.category
            }

            setTimeout(() => {
                setIsDisabled(false)
            }, 1000);

            if(id == -1) {
                saveCategory(category)
                    .then((response)=> {
                        showToast(response?.data?.responseMessage,"success")
                        navigate('/viewcategories')
                        })
                    .catch((error) => {   
                        showToast(error?.data?.errorMessage,"error")
                        navigate('/viewcategories')
                    }) 
            }
            else {
                updateCategory(category)
                    .then((response)=> {
                        showToast(response?.data?.responseMessage,"success")
                        navigate('/viewcategories')
                    })
                    .catch((error) => {
                        showToast(error?.data?.errorMessage,"error")
                        navigate('/viewcategories')
                    })
            }
         }
  
   function validate(values) {
        let errors = { }
  
        if(values.category.length<2) {
            errors.category = 'Please Enter at least 2 Characters'
        }
        return errors
   }

     return (
        <div className="container">
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
            <Formik initialValues={ { category_id,category} }
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
                                <TextField  id="category"
                                            name="category"
                                            label="Category"
                                            variant="standard"
                                            placeholder="Enter Category"
                                            value={props.values.category}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            error={props.touched.category && Boolean(props.errors.category)}
                                            helperText={<ErrorMessage name="category" />}
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