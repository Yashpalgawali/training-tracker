import { useEffect, useRef, useState } from "react"
import { downAllDepartmentList, getAllDepartments } from "../api/DepartmentApiService"
import { useNavigate } from "react-router-dom"

import $ from 'jquery'; // jQuery is required for DataTables to work
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { showToast } from "../SharedComponent/showToast";

import { Box, Button, Tooltip, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';


export default function ViewDepartmentComponent() {

    const [deptlist, setDeptList] = useState([])
    const [successMessage,setSuccessMessage] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const tableRef = useRef(null); // Ref for the table

    const navigate = useNavigate()
    const didFetchRef = useRef(false)
    useEffect(
        () =>  {
            if (!didFetchRef.current) {
                didFetchRef.current = true; 
                retrieveAllDepartments()
            }
            if(sessionStorage.getItem('response')!= null) {
                setSuccessMessage(sessionStorage.getItem('response'))
                setErrorMessage('')
                setTimeout(() => {
                    setSuccessMessage('')
                    sessionStorage.removeItem('response')
                }, 2000);
            }
    
            if(sessionStorage.getItem('reserr')!= null) {
                setErrorMessage(sessionStorage.getItem('reserr'))
                setSuccessMessage('')
                setTimeout(() => {
                    setErrorMessage('')
                    sessionStorage.removeItem('reserr')
                }, 2000);
            }
        } , []
    )

    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && deptlist.length >0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [deptlist]); // Re-initialize DataTables when activities data changes
    
    function retrieveAllDepartments() {
        getAllDepartments()
            .then((response) => setDeptList(response.data))
            .catch((error) => {
                                showToast(error.response.data.errorMessage, "error")
                                
                              })
    }

    function updateDepartmentById(id) {
         navigate(`/department/${id}`)
    }

    function addNewDepartment(){
        navigate(`/department/-1`)
    }

    function downloadAllDepartmentsList() {
        downAllDepartmentList().then((response)=> {
                    
                // Convert the array buffer to a Blob
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // Create a link element to trigger download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'All Departments And Company List.xlsx';
                link.click();
            })
        }


    return(
        <div className="container">
            
            <Box>
                <Typography variant="h4" gutterBottom>View Departments 
                     <Button type="submit" variant="contained" color="info" style={ { float: 'left' } } className="m-2" onClick={downloadAllDepartmentsList} > <Tooltip title="Download Department List" arrow> <CloudDownloadIcon /> Download </Tooltip></Button> 
                    <Button type="submit" variant="contained" color="primary" style={ { float: 'right' } } className="m-2" onClick={addNewDepartment} > <Tooltip title="Add Department" arrow> Add Department</Tooltip></Button>    </Typography>
            </Box>
            
            <table className="table table-striped table-hover" ref={tableRef}>
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Department</th>
                        <th>Company</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        deptlist.length == 0 ? (
                            <tr>
                                <td colSpan="4">No Data Available</td>
                            </tr>
                        ): (
                        deptlist.map(
                            (dept,index)=> (
                                <tr key={dept.dept_id}>
                                    <td>{index+1}</td>
                                    <td>{dept.dept_name}</td>
                                    <td>{dept.company?.comp_name}</td>
                                    <td>
                                        <Button variant="contained" color="success" onClick={()=>updateDepartmentById(dept.dept_id)}> <Tooltip title={`Update Department ${dept.dept_name}`} arrow placement="left"><EditIcon /> &nbsp;UPDATE</Tooltip></Button>                                       
                                    </td>
                                </tr>
                            )
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}