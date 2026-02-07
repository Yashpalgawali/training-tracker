import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom" 

import $ from 'jquery'; // jQuery is required for DataTables to work
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality

import { Box,   Grid,   Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast"; 
import { retrieveEmployeeHistoryByEmpId } from "../api/EmployeeHistoryApiService";

export default function ViewEmployeehistory() {

    const [empList,setEmpList] = useState([])
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
    const {id} = useParams()
    
    const tableRef = useRef(null)
    const didFetchRef = useRef(false);

    useEffect(
    () => 
        {               
            if (!didFetchRef.current) {
                didFetchRef.current = true;
                getEmployeeHistoryByEmpId()
            }
        },[]) 

    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && empList.length >0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [empList]); // Re-initialize DataTables when activities data changes
   

    function getEmployeeHistoryByEmpId() {
        retrieveEmployeeHistoryByEmpId(id).then((response) => {                
            setEmployee(response.data[0].employee)
            console.log(response.data)

            setEmpList(response.data) 
        })
        .catch((error)=> {
            
            showToast(error.response.data.errorMessage, "error")
            navigate(`/viewemployees`)
        })
    }

    
   return(
        <div className="container">
            <Box >
                <Typography variant="h4" gutterBottom>View History </Typography>
                <Box className="mb-5" sx={{borderBlockStyle: 'outset', p: 2}}>
                    {/* Row 1 */}
                {/* Row 1 */}
                <Grid container sx={{ mb: 2 }}>
                <Grid item xs={6} sx={{ pr: 2 }}>
                    <strong>Name: </strong> {employee.empName}
                </Grid>
                <Grid item xs={6} textAlign="right" sx={{ pl: 2 }}>
                    <strong>Employee Code: </strong> {employee.empCode}
                </Grid>
                </Grid>

                {/* Row 2 */}
                <Grid container sx={{ mb: 2 }}>
                <Grid item xs={6} sx={{ pr: 2 }}>
                    <strong>Designation: </strong> {employee.designation.desigName}
                </Grid>
                <Grid item xs={6} textAlign="right" sx={{ pl: 2 }}>
                    <strong>Category: </strong> {employee.category.category}
                </Grid>
                </Grid>

                {/* Row 3 */}
                <Grid container sx={{ mb: 2 }}>
                <Grid item xs={6} sx={{ pr: 2 }}>
                    <strong>Company: </strong> {employee.department.company.compName}
                </Grid>
                <Grid item xs={6} textAlign="right" sx={{ pl: 2 }}>
                    <strong>Department: </strong> {employee.department.deptName}
                </Grid>
                </Grid>

            </Box>
        </Box>
        
        <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Name</th>
                        <th>Employee Code</th>
                        <th>Designation</th>
                        <th>Category</th>
                        <th>Contractor</th>
                        <th>Department</th>
                        <th>Company</th>
                        <th>Joining Date</th>
                        <th>Leaving Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                  {
                  empList.length === 0 ? (
                        <tr>
                            <td colSpan="10" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        empList.map((emp,index) => (
                            <tr key={emp.empHistId}>
                            <td>{index+1}</td>
                            <td>{emp.empName}</td>
                            <td>{emp.empCode}</td>
                            <td>{emp.desigName}</td>
                            <td>{emp.category}</td>
                            <td>{emp.contractorName}</td>
                            <td>{emp.deptName}</td>
                            <td>{emp.compName}</td>
                            <td>{emp.joiningDate}</td>
                            <td>{emp.leaveDate}</td>
                            <td><span
                                style={{
                                    padding : "4px 10px",
                                    borderRadius: "12px",
                                    color : "white",
                                    backgroundColor : emp.status ===1 ? "green" : "red",
                                    fontSize: "0.85rem"
                                }}
                            > {(emp.status==1 ? 'Active' : 'InActive') }</span></td>                             
                            </tr>
                        ))
                      )
                    }
                </tbody>
            </table>
        </div>
    )
}