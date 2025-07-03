import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { getTrainingsByEmployeeId } from "../api/EmployeeTrainingApiService";

import { showToast } from "../SharedComponent/showToast"
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import $ from 'jquery'; // jQuery is required for DataTables to work



export default function ViewEmployeeTrainings() {

    const [traininglist,setTrainingList] = useState([]);

    const {id} = useParams();
    const navigate = useNavigate()
    const didFetchRef = useRef(false)
    const tableRef = useRef(false)

    const [employee,setEmployee] = useState({
        emp_name : '',
        emp_code : '',
        department : {
            dept_name : ''
        },
        designation : {
            desig_name : ''
        }
    })
      
    useEffect(() => {
           if(tableRef.current && traininglist.length>0) {
               $(tableRef.current).DataTable()
           }
       }, [traininglist] )
 
    useEffect(
    () => 
        {               
            if (!didFetchRef.current) {
                didFetchRef.current = true;                            
                getTrainingsByEmpId()
            }
        },[id])

    function getTrainingsByEmpId() {
       getTrainingsByEmployeeId(id).then((response) => {
            setEmployee(response.data[0].employee)
                setTrainingList(response.data)
       })
       .catch((error) => {
            showToast("No Trainings are given ","error")
            navigate(`/viewemployees`)
       })
    }

    return (
      <div className="container">
        <div>
            <h3 className="text-center">View Employee Trainings</h3>
            <div>
                <div style={{ float : 'left' }}  className="mb-3">
                    <label htmlFor="" >Name:</label><strong> {employee.emp_name}</strong>
                </div>
                <div style={{ float : 'right' }}>
                    <label htmlFor="" >Designation:</label><strong> {employee.designation.desig_name}</strong>
                </div>
                <div style={{ float : 'left' , clear : 'both'}} className="mb-3">
                    <label htmlFor="" >Department:</label><strong> {employee.department.dept_name}</strong>
                </div>
            </div>
        </div>
        <div>
            <table ref={tableRef} className="table table-hover table-striped">
                <thead>
                    <tr>
                        <th>Sr</th>
                        <th>Training</th>
                        <th>Start Date</th>
                        <th>Complete Date</th>                        
                    </tr>
                </thead>
                <tbody>
                {
                    traininglist.length===0 ? (
                        <tr>
                            <td colSpan={4}>No Trainings are Given </td>
                        </tr>
                    ) : 
                    (
                        traininglist.map(
                            (training,index) => (
                                            <tr key={training.emp_train_hist_id}>
                                                <td>{index+1}</td>
                                                <td>{training.training.training_name}</td>
                                                <td>{training?.training_date}</td>
                                                <td>{ training.completion_date ? (training.completion_date ): (<span style={{ color : 'red'}}> Not Completed</span>)} </td>
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