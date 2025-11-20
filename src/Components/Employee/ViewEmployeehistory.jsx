import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom" 

import $ from 'jquery'; // jQuery is required for DataTables to work
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality

import { Box,   Typography } from "@mui/material"
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
        retrieveEmployeeHistoryByEmpId(id).then(
            (response) => {
                 
                setEmployee(response.data[0].employee)
                setEmpList(response.data) 
            })
            .catch((error)=> {
                showToast(error.response.data.errorMessage, "error")
            })
    }

    
   return(
        <div className="container">
            <Box >
                <Typography variant="h4" gutterBottom>View History </Typography>
                <div  className="mb-5 " style={{ borderBlockStyle : "outset"}} > 
                <div   >
                    <span style={{ float : 'left' }}><strong>Name :</strong> {employee.empName}</span>
                    <span style={{ float : 'right' }}><strong>Employee Code: </strong> {employee.empCode}  </span>
                </div>
                <br />
                 <div className="mt-3 ">
                     <span style={{ float : 'left' }}><strong>Designation :</strong> {employee.designation.desigName}</span>
                    <span style={{ float : 'right' }}><strong>Category :</strong> {employee.category.category}</span>
                </div>
                <br />
               <div className="mb-5 mt-3 ">
                    <span style={{ float : 'left' }}><strong>Company :</strong> {employee.department.company.compName}</span>
                    <span style={{ float : 'right' }}><strong>Department :</strong> {employee.department.deptName}</span>
                </div>
                </div>
            </Box>
        
            <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Name</th>
                        <th>Employee Code</th>
                        <th>Designation</th>
                        <th>Contractor</th>
                        <th>Department</th>
                        <th>Company</th>
                        <th>Joining Date</th>
                        
                    </tr>
                </thead>
                <tbody>
                  {
                  empList.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        empList.map((emp,index) => (
                            <tr key={emp.emp_hist_id}>
                            <td>{index+1}</td>
                            <td>{emp.empName}</td>
                            <td>{emp.empCode}</td>
                            <td>{emp.desigName}</td>
                            <td>{emp.contractorName}</td>
                            <td>{emp.deptName}</td>
                            <td>{emp.compName}</td>
                            <td>{emp.joiningDate}</td>
                             
                            </tr>
                        ))
                      )
                    }    
                </tbody>
            </table>
        </div>
    )
}