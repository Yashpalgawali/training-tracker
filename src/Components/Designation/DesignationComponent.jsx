import $ from 'jquery'; // jQuery is required for DataTables to work
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality

import { ErrorMessage, Field, Form, Formik } from "formik"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getAllDesignations, getDesignationById, saveDesignation, updateDesignation } from "../api/DesignationApiService"
import { Box, Button, CircularProgress, TextField,Tooltip, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"
import EditIcon from '@mui/icons-material/Edit';

import * as Yup from "yup";
import { toast } from 'react-toastify';

export default function DesignationComponent() {
    const [btnValue,setBtnValue] = useState('Add Designtion')
    const [desigName,setDesigName]  = useState('')
    const [desigId,setDesigId]  = useState('')
    const [desiglist,setDesigList] = useState([])

    const [isDisabled,setIsDisabled] = useState(false)

    const navigate = useNavigate()
    const {id} = useParams()
        
    const tableRef = useRef(null)
    const didFetchRef = useRef(false);

    useEffect(
    () => 
        {               
            if (!didFetchRef.current) {
                didFetchRef.current = true;                            
                retrieveAllDesignations()
            }
        },[]) 

    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && desiglist.length >0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [desiglist]); // Re-initialize DataTables when activities data changes
   

    function retrieveAllDesignations() {
        getAllDesignations().then(
            (response) => {   setDesigList(response.data) })
            .catch((error)=> {
                showToast(error.response.data.errorMessage, "error")
            })
    }

    useEffect( 
        () => {
            retrieveDesignationById()
        },[id] )

    function retrieveDesignationById ()  {
        if(id != -1) {
            setBtnValue('Update Designation')
            getDesignationById(id).then((response) => {
                 setDesigName(response.data.desigName)
                 setDesigId(response.data.desigId)
            }).catch((error)=>{
                toast.error(error.response.data.errorMessage)
                setDesigName("")
                setBtnValue("Add Designtion")
                navigate(`/designation/-1`)
            }) 

        }
    }

    const validationSchema = Yup.object({
        desigName : Yup.string()
                    .required('Designation can\'t be blank')
                    .min(2,'Designation should have at least 2 characters')
    })

    function onSubmit(values) {
        setIsDisabled(true)
        let designation = {
            desigId : id,
            desigName : values.desigName
        }
        if(id != -1) {
           
            updateDesignation(designation).then((response) => {
                toast.success(response?.data?.responseMessage)
                retrieveAllDesignations()
                setDesigName("")
                setBtnValue("Add Designation")
                setIsDisabled(false)
                navigate(`/designation/-1`)
            })
            .catch((error) => {
                toast.error(error?.data?.errorMessage)
                setBtnValue("Add Designation")
                setIsDisabled(false)
                navigate(`/designation/-1`)                
            })
        }
        else {
            saveDesignation(designation).then((response) => {
                toast.success(response?.data?.responseMessage)
                setIsDisabled(false)
                navigate(`/designation/-1`)
            })
            .catch((error) => {
                toast.error(error?.data?.errorMessage)
                setIsDisabled(false)
                navigate(`/designation/-1`)
            })
        }
    }
   
    return(
         <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", p: 2 }}>
            <Typography variant="h4" gutterBottom>{btnValue}</Typography>
            <Formik
                initialValues={ { desigId  , desigName } }
                enableReinitialize={true}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {
                    (props) => (
                        <Form>
                             <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <TextField  id="desigName"
                                                name="desigName"
                                                label="Designation Name"
                                                variant="standard"
                                                placeholder="Enter Designation Name"
                                                value={props.values.desigName}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                error={props.touched.desigName && Boolean(props.errors.desigName)}
                                                helperText={<ErrorMessage name="desigName" />}
                                                fullWidth />
                                       
                            </Box>
                            
                                <Box className="btnvalue">
                                        <Button
                                            type="submit"
                                            style={{ float: 'left' }}
                                            variant="contained"
                                            color="primary"
                                            disabled={isDisabled}
                                             startIcon= {
                                                    isDisabled ? <CircularProgress size={20} color="teal" /> : null
                                                }  
                                        >
                                        {btnValue}
                                        </Button>
                                </Box>
                        </Form>
                    )
                }
            </Formik>
            <Box sx={{marginTop : "50px"}}>
                <Typography variant="h4" gutterBottom>View Designations </Typography>
            </Box>
        
            <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Designation</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    desiglist.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        desiglist.map((desig,index) => (
                            <tr key={desig.desigId}>
                            <td>{index+1}</td>
                            <td>{desig.desigName}</td>
                            <td>
                                <Button type="submit" variant="contained" color="success" onClick={() => navigate(`/designation/${desig.desigId}`)} > <Tooltip arrow placement="left" title={`Update ${desig.desigName}`}> <EditIcon /> &nbsp;Update</Tooltip></Button>
                            </td>
                            </tr>
                        ))
                        )
                    }    
                </tbody>
            </table>  
        </Box>
    )
}