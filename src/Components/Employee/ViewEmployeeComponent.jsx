import { useEffect, useRef, useState } from "react"
import { retrieveAllEmployees } from "../api/EmployeeApiService"
import { showToast } from "../SharedComponent/showToast"
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import $ from 'jquery'; // jQuery is required for DataTables to work
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function ViewEmployeeComponent() {

    const [empList,setEmpList] = useState([])

    const navigate = useNavigate()
    const didRunRef = useRef(false)
    const tableRef = useRef(false)

    useEffect(()=> {
        if(!didRunRef.current)
            didRunRef.current = true
        retriveAllEmployeeList()        
    },[])

    useEffect(() => {
        if(tableRef.current && empList.length>0) {
            $(tableRef.current).DataTable()
        }
    }, [empList] )

    function retriveAllEmployeeList() {
        retrieveAllEmployees().then((response) =>{
            console.log(response)
            setEmpList(response.data)
        }).catch((error)=>{            
             showToast(error.response.data.errorMessage, "error")
        })
    }

    function updateEmployee(id) {
        navigate(`/employee/${id}`)
    }
    function addNewEmployee() {
        navigate(`/employee/-1`)
    }
    return (
        <div className="container">
            <h2 className="text-center">View Employees <Button variant="contained" color="primary" onClick={addNewEmployee} >Add Employee</Button> </h2>
            <div>
                <table ref={tableRef} className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Sr</th>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Joining Date</th>
                            <th>Department</th>
                            <th>Company</th>
                            <th>Training</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        empList.length === 0 ? (
                            <tr>
                                <td colSpan="6">No Employees Data Found</td>
                            </tr>
                        )
                        :
                        (
                            empList.map(
                                (emp,index) => (
                                    <tr key={emp.emp_id}>
                                        <td>{index+1}</td>
                                        <td>{emp.emp_name}</td>
                                        <td>{emp.emp_code}</td>
                                        <td>{emp.joining_date}</td>
                                        <td>{emp.department}</td>
                                        <td>{emp.company}</td>
                                        <td>{emp.trainings}</td>
                                        <td><Button variant="contained" color="primary" onClick={() => updateEmployee(emp.emp_id) } >UPDATE</Button> </td>
                                    </tr>
                                )
                            )
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}