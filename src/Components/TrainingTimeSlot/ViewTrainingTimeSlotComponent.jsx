import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import $ from 'jquery'; // jQuery is required for DataTables to work
  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { Box, Button, Tooltip, Typography } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import { retrieveAllTrainingTimeSlots } from "../api/TrainingTimeSlotApiService";
import { showToast } from "../SharedComponent/showToast";


export default function ViewTrainingTimeSlotComponent() {

    const [trainingTimeSlotList,setTrainingTimeSlotList] = useState([])

    const tableRef = useRef(null); // Ref for the table
    const navigate = useNavigate()

    useEffect(()=> refreshTrainingTimeSlots() , [] )
    
    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && trainingTimeSlotList.length > 0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [trainingTimeSlotList]); // Re-initialize DataTables when activities data changes

    function refreshTrainingTimeSlots() {
     
        retrieveAllTrainingTimeSlots().then((response)=> {
            setTrainingTimeSlotList(response.data)
        }).catch((error) => {
             showToast(error.response.data.errorMessage, "error")
        })
    }  

    function addNewTrainingTimeSlot() {
        navigate(`/trainingtimeslot/-1`)
    }

    function updateTrainingTimeSlot(id) {
        navigate(`/trainingtimeslot/${id}`)
    }

    return(
        <div className="container">
            <Box>
                <Typography variant="h4" gutterBottom>View Training Time Slots <Button type="submit" variant="contained" color="primary" style={ { float: 'right' } } className="m-2" onClick={addNewTrainingTimeSlot} > <Tooltip title="Add Training Time Slots" arrow> Add Training Time Slots</Tooltip></Button>    </Typography>
            </Box>
 
        {/* <DataTable  
            data={complist}
            columns={[
                {title : 'Sr' , data: 'comp_id'},
                {title : 'Company Name' , data: 'comp_name'},
                {title : 'Action' , data: 'comp_id',render : function(data,type ,row){
                    return `<Button type="submit" variant="contained" color="primary" className="m-3" data-id="${row.id}"><EditSquareIcon /> Update</Button>`
                    // return `<button className="btn btn-primary" data-id="${row.id}" >Update</button>`
                } } 
            ]}
            options={{
                searching: true,
                paging: true,
                ordering: true,
                info: true,
                responsive: true
            }}
        /> */}

            <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Training Time Slot</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {trainingTimeSlotList.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        trainingTimeSlotList.map((training,index) => (
                            <tr key={training.training_time_slot_id}>
                            <td>{index+1}</td>
                            <td>{training.training_time_slot}</td>
                            <td>
                                <Button type="submit" variant="contained" color="success" onClick={() => updateTrainingTimeSlot(training.training_time_slot_id)} > <Tooltip title="Update Training Time Slot" placement="left" arrow><EditIcon /> &nbsp;Update</Tooltip></Button>
                            </td>
                            </tr>
                        ))
                      )}
                </tbody>
            </table>
        </div>
    )
}