import $ from 'jquery'; // jQuery is required for DataTables to work
  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { retrieveAllCategories, retrieveCategoryById, saveCategory, updateCategory } from "../api/CategoryApiService"
import { ErrorMessage, Field, Formik,Form } from "formik"
import { Box, Button, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"
 import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
export default function CategoryComponent () {

    const {id} =  useParams()
    const [category , setCategory] = useState('')
    const [category_id ,setCategoryId] = useState('')

    const [isDisabled, setIsDisabled] = useState(false) 
    const [btnValue, setBtnValue] = useState('Add Category')
   const [categorylist,setCategoryList] = useState([])

    const didFetchRef = useRef(false)
    const tableRef = useRef(false); // Ref for the table
    const navigate = useNavigate()

    useEffect(()=> { 
        if (!didFetchRef.current) {
                didFetchRef.current = true;  
            refreshCategories()
        }
    } , [] )
    
    useEffect(() => {
      if (tableRef.current) {
        // 🔴 Destroy old DataTable if exists
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }

        // ✅ Initialize only when data exists
        if (categorylist.length > 0) {
          $(tableRef.current).DataTable({
            responsive: true,
            destroy: true // <-- Important, allows re-init
          });
        }
      }
    }, [categorylist]);   

    function refreshCategories() {     
        
        retrieveAllCategories().then((response)=> {
            setCategoryList(response.data)
        }).catch((error)=> {             
             showToast(error.response.data.errorMessage, "error")
        })
    }  
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
                        toast.success(response?.data?.responseMessage)
                        refreshCategories()
                        navigate('/category/-1')
                        })
                    .catch((error) => {
                        toast.error(error?.data?.errorMessage)
                        refreshCategories()
                        navigate('/category/-1')
                    }) 
            }
            else {
                updateCategory(category)
                    .then((response)=> {
                        toast.success(response?.data?.responseMessage)
                        refreshCategories()
                        setCategory("")
                        setBtnValue("Add Category")
                        setIsDisabled(false)
                        navigate('/category/-1')
                    })
                    .catch((error) => {
                        toast.error(error?.data?.errorMessage)
                        refreshCategories()
                        setCategory("")
                        setBtnValue("Add Category")
                        setIsDisabled(false)
                        navigate('/category/-1')
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
        <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", p: 2 }}>
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
                         <Box >
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
                                disabled={isDisabled}
                            >
                            {btnValue}
                            </Button>
                         </Box>
                    </Form>
                  )
               }
            </Formik>
            <Box sx={{marginTop: "50px"}}>
                <Typography variant="h4" gutterBottom>View Categories </Typography>
            </Box>
        
            <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {categorylist.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        categorylist.map((category,index) => (
                            <tr key={category.category_id}>
                            <td>{index+1}</td>
                            <td>{category.category}</td>
                            <td>
                                <Button type="submit" variant="contained" color="success" onClick={() => navigate(`/category/${category.category_id}`)} > <Tooltip title={`Update ${category.category}`} placement="left" arrow><EditIcon /> &nbsp;Update</Tooltip></Button>
                            </td>
                            </tr>
                        ))
                      )}
                </tbody>
            </table>
        </Box>
    ); 
 
}