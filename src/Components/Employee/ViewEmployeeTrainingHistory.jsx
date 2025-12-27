import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom" 

import $ from 'jquery'; // jQuery is required for DataTables to work
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality

import { Box,   Grid,   Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"; 
import { retrieveEmployeeHistoryByEmpId } from "../api/EmployeeHistoryApiService";
import { getTrainingHistoryByEmpAndTrainingId } from "../api/EmployeeTrainingHistoryApiService";

export default function ViewEmployeeTrainingHistory() {

    const [empHistList,setEmpHistList] = useState([])
    const navigate = useNavigate()
    const [employee,setEmployee] = useState( 
        {
            empName : '',
            empCode : '',            
            designation : {
                desigId : '',
                desigName : '' }
            ,
            category : {
                categoryId: '',
                category : ''
            },
            department : {
                deptId : '',
                deptName: '',
                company : {
                    compId: '',
                    compName : ''
                }
            }
        }
     )
    const {empid,trainingid} = useParams()
    
    const tableRef = useRef(null)
    const didFetchRef = useRef(false);

    useEffect(
    () => 
        {               
            if (!didFetchRef.current) {
                didFetchRef.current = true;
                getEmployeeTrainingHistoryByEmpIdAndTrainingId()
            }
        },[]) 

    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && empHistList.length >0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [empHistList]); // Re-initialize DataTables when activities data changes
   

    function getEmployeeTrainingHistoryByEmpIdAndTrainingId() {

        getTrainingHistoryByEmpAndTrainingId(empid,trainingid).then(
            (response) => {
                setEmployee(response.data[0].employee)
                setEmpHistList(response.data) 
            })
            .catch((error)=> {
                showToast(error.response.data.errorMessage, "error")
            })
    }

   return(
        <div className="container">
            <Box >
                <Typography variant="h4" gutterBottom>View Training History </Typography>
                <Box className="mb-5" sx={{borderBlockStyle: 'outset', p: 2}}>
                {/* Row 1 */}
                {/* Row 1 */}
                <Grid container sx={{ mb: 2 }}>
                <Grid  xs={6} sx={{ pr: 2 }}>
                    <strong>Name: </strong> {employee.empName}
                </Grid>
                <Grid  xs={6} textAlign="right" sx={{ pl: 2 }}>
                    <strong>Employee Code: </strong> {employee.empCode}
                </Grid>
                </Grid>

                {/* Row 2 */}
                <Grid container sx={{ mb: 2 }}>
                <Grid  xs={6} sx={{ pr: 2 }}>
                    <strong>Designation: </strong> {employee.designation.desigName}
                </Grid>
                <Grid  xs={6} textAlign="right" sx={{ pl: 2 }}>
                    <strong>Category: </strong> {employee.category.category}
                </Grid>
                </Grid>

                {/* Row 3 */}
                <Grid container sx={{ mb: 2 }}>
                <Grid  xs={6} sx={{ pr: 2 }}>
                    <strong>Company: </strong> {employee.department.company.compName}
                </Grid>
                <Grid  xs={6} textAlign="right" sx={{ pl: 2 }}>
                    <strong>Department: </strong> {employee.department.deptName}
                </Grid>
                </Grid>
            </Box>
        </Box>
        
        <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Training</th>
                        <th>Competency</th>
                        <th>Training Date</th>
                        <th>Completion Date</th>
                    </tr>
                </thead>
                <tbody>
                  {
                  empHistList.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        empHistList.map((emp,index) => (
                            <tr key={emp.emp_train_hist_id}>
                                <td>{index+1}</td>
                                <td>{emp.training.training_name}</td>
                                <td>{emp.competency.score}</td>
                                <td>{emp.training_date}</td>
                                <td>{emp.training_date}</td>                                
                            </tr>
                        ))
                      )
                    }    
                </tbody>
            </table>
        </div>
    )
}