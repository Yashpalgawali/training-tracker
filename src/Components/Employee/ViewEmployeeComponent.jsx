import { useEffect, useRef, useState } from "react"
import { retrieveAllEmployees } from "../api/EmployeeApiService"
import { showToast } from "../SharedComponent/showToast"
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import $ from 'jquery'; // jQuery is required for DataTables to work
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

 const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export default function ViewEmployeeComponent() {
  

    const [empList,setEmpList] = useState([])

    const navigate = useNavigate()
    const didFetchRef = useRef(false)
    const tableRef = useRef(false)

    useEffect(
    () => 
        {               
            if (!didFetchRef.current) {
                didFetchRef.current = true;                            
                retriveAllEmployeeList()
            }
        },[])

    useEffect(() => {
        if(tableRef.current && empList.length>0) {
            $(tableRef.current).DataTable()
        }
    }, [empList] )

    function retriveAllEmployeeList() {
        retrieveAllEmployees().then((response) => {
            console.log(response.data)        
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

    function getEmployeeTrainings(id)
    {         
        navigate(`/training/employee/${id}`)
    }

    function isDisabled(){

    }

    return (
        <div className="container">
            <h2 className="text-center">View Employees <Button style={ { float : 'right'} }  variant="contained" color="primary" onClick={addNewEmployee} >Add Employee</Button> </h2>
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        empList.length === 0 ? (
                            <tr>
                                <td colSpan="8">No Employees Data Found</td>
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
                                        <td>
                                         
                                            <Fab size="medium" style={ { marginRight : 5 } }  color="primary" onClick={() => updateEmployee(emp.emp_id) } aria-label="add">
                                                <BootstrapTooltip title="Add Training">
                                                    <AddIcon />
                                                </BootstrapTooltip>
                                                
                                            </Fab>
                                            <Fab  size="medium" color="warning" onClick={() => getEmployeeTrainings(emp.emp_id) } aria-label="add">
                                                <BootstrapTooltip title="View Training">
                                                    <VisibilityIcon />
                                                </BootstrapTooltip>
                                                
                                            </Fab>
                                        </td>
                                    </tr>
                                )
                            )
                        )
                    }
                    </tbody>
                </table>
                 <div>
       
    </div>
            </div>
        </div>
    )
}