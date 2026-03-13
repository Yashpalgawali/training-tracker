import $ from 'jquery'; // jQuery is required for DataTables to work  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ErrorMessage,  Formik,Form } from "formik"
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"
import { retrieveAllCompetencies, retrievecompetencyById, savecompetency, updatecompetency } from "../api/CompetencyApiService"
import * as Yup from "yup";
import { toast } from "react-toastify"

import EditIcon from '@mui/icons-material/Edit';

export default function CompetencyComponent () {

    const {id} =  useParams()
    const [score , setScore] = useState('')
    const [competency_id ,setCompetencyId] = useState('')
    const navigate = useNavigate()
    const [isDisabled, setIsDisabled] = useState(false)
    const [btnValue, setBtnValue] = useState('Add Competency')

    const [competencylist,setCompetencyList] = useState([])
    const tableRef = useRef(null); // Ref for the table
    

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

        
        useEffect(()=> refreshCompetencies() , [] )
        
        useEffect(() => {
            // Initialize DataTable only after the component has mounted
            if (tableRef.current && competencylist.length > 0 ) {
              $(tableRef.current).DataTable(); // Initialize DataTables
            }
          }, [competencylist]); // Re-initialize DataTables when activities data changes       
    
        function refreshCompetencies() {
         
            retrieveAllCompetencies().then((response)=> {
                setCompetencyList(response.data)
            }).catch((error) => {
                 showToast(error.response.data.errorMessage, "error")
            })
        }  

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
                        setScore("")
                        setIsDisabled(false) 
                        refreshCompetencies()                      
                        navigate(`/competency/-1`)
                        })
                    .catch((error) => {   
                        toast.error(error?.data?.errorMessage)
                        setScore("")
                        setBtnValue(false)
                        setIsDisabled(false)
                        refreshCompetencies()
                        navigate(`/competency/-1`)
                    }) 
            }
            else {
                updatecompetency(competency)
                    .then((response)=> {
                        toast.success(response?.data?.responseMessage)
                        setScore("")
                        setBtnValue("Add Competency")
                        setIsDisabled(false)
                        refreshCompetencies()
                        navigate(`/competency/-1`)
                    })
                    .catch((error) => {
                        toast.error(error?.data?.errorMessage)
                        setScore("")
                        setBtnValue("Add Competency")
                        setIsDisabled(false)
                        refreshCompetencies()
                        navigate(`/competency/-1`)
                    })
            }
         }

    const validationSchema = Yup.object({
         score: Yup.mixed()
            .required("Competency Score is required")
    })
 
     return (
         
          <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", p: 2 }}>
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
                <Box sx={{marginTop : "50px"}}>
                    <Typography variant="h4" gutterBottom>View Competencies </Typography>
                
                    <table ref={tableRef} className="table table-striped table-hover display">
                            <thead>
                                <tr >
                                    <th>Sr No.</th>
                                    <th>Competecny</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                              {competencylist.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>
                                            No data available
                                        </td>
                                    </tr>
                                    ) : (
                                    competencylist.map((comp,index) => (
                                        <tr key={comp.competency_id}>
                                        <td>{index+1}</td>
                                        <td>{comp.score}</td>
                                        <td>
                                            <Button type="submit" variant="contained" color="success" onClick={() => navigate(`/competency/${comp.competency_id}`)} > <Tooltip title="Update Competecny" placement="left" arrow><EditIcon /> &nbsp;Update</Tooltip></Button>
                                        </td>
                                        </tr>
                                    ))
                                  )}
                            </tbody>
                        </table>
                    </Box>
            </Box>         
    );
}