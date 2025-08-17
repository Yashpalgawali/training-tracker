import { useEffect, useRef, useState } from "react"
import { retrieveAllTraining } from "../api/TrainingApiService"
import $ from 'jquery'; // jQuery is required for DataTables to work
  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { showToast } from "../SharedComponent/showToast"
 

export default function ViewTrainingComponent() {

    const [training_list,setTrainingList] = useState([])
     
    const tableRef = useRef(null); // Ref for the table
    const navigate = useNavigate()
    const didFetchRef = useRef(false);
    
    useEffect(() => {
        if (!didFetchRef.current) {
            didFetchRef.current = true;
            retrieveAllTrainings();
        }
    }, []);

    function retrieveAllTrainings() {        
        retrieveAllTraining().then((response)=> {             
            setTrainingList(response.data)
        }).catch((error)=>{           
           const message =  error?.response?.data?.errorMessage
           showToast(message , "error")
           
        })
    }

     useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && training_list.length >0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [training_list]); // Re-initialize DataTables when activities data changes

    function updateTraining(id) {
        navigate(`/training/${id}`)
    }
    function addTraining() {
        navigate(`/training/-1`)
    }
    return(                                                                                         
        <div className="container">
            <Box>
                <Typography variant="h4" gutterBottom>View Trainings <Button type="submit" variant="contained" color="primary" style={ { float: 'right' } } className="m-2" onClick={addTraining} > <Tooltip title="Add Training" arrow> Add Training</Tooltip></Button>    </Typography>
            </Box>

            <table ref={tableRef} className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Sr</th>
                        <th>Training</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {
                    (training_list.length == 0) ? (
                        <tr>
                            <td colSpan={3}> No Data Available</td>
                        </tr>
                    ) : (
                        training_list.map((train,index)=>(
                            <tr key={train.training_id}>
                                <td> {index+1} </td>
                                <td>{train.training_name}</td>
                                <td>
                                    <Button variant="contained" color="success" className="m-2"  onClick={()=> updateTraining(train.training_id)}> <EditIcon /> UPDATE</Button>
                                </td>
                            </tr>
                        ))
                    )
                }
                </tbody>
            </table>
        </div>
    )
}