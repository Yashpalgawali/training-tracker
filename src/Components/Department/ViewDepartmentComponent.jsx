import { useEffect, useRef, useState } from "react"
import { getAllDepartments } from "../api/DepartmentApiService"
import { useNavigate } from "react-router-dom"

import $ from 'jquery'; // jQuery is required for DataTables to work
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { Button, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';


export default function ViewDepartmentComponent() {

    const [deptlist, setDeptList] = useState([])
    const [successMessage,setSuccessMessage] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const tableRef = useRef(null); // Ref for the table

    const navigate = useNavigate()
    
    useEffect(
        () =>  {
            retrieveAllDepartments()
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
        getAllDepartments().then((response) => setDeptList(response.data)).catch((error) => console.log(error))
    }

    function updateDepartmentById(id) {
         navigate(`/department/${id}`)
    }

    function addNewDepartment(){
        navigate(`/department/-1`)
    }

    return(
        <div className="container">
            
            <h2>View Departments 
                <Button variant="contained" color="primary" style={ { float : 'right'} }onClick={addNewDepartment}>Add Department</Button>
            </h2>
            {successMessage && <div className="alert alert-success"><strong>{successMessage}</strong></div>  }
            {errorMessage && <div className="alert alert-warning"><strong> {errorMessage}</strong> </div>  }
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