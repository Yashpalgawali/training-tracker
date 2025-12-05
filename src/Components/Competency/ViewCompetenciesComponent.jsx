import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import $ from 'jquery'; // jQuery is required for DataTables to work
  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { Box, Button, Tooltip, Typography } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import { retrieveAllCompetencies } from "../api/CompetencyApiService";
import { showToast } from "../SharedComponent/showToast";


export default function ViewCompetenciesComponent() {

    const [competencylist,setCompetencyList] = useState([])

    const tableRef = useRef(null); // Ref for the table
    const navigate = useNavigate()

    useEffect(()=> refreshCompanies() , [] )
    
    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && competencylist.length > 0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [competencylist]); // Re-initialize DataTables when activities data changes
   

    function refreshCompanies() {
     
        retrieveAllCompetencies().then((response)=> {
            setCompetencyList(response.data)
        }).catch((error) => {
             showToast(error.response.data.errorMessage, "error")
        })
    }  

    function addNewCompetency() {
        navigate(`/competency/-1`)
    }

    function updateCompetency(id) {
        navigate(`/competency/${id}`)
    }

    return(
        <div className="container">
    <Box>
        <Typography variant="h4" gutterBottom>View Competencies 
          
            <Button type="submit" variant="contained" color="primary" style={ { float: 'right' } } className="m-2" onClick={addNewCompetency} > 
                <Tooltip title="Add Competency" arrow> Add Competency </Tooltip></Button>    
         
        </Typography>
    </Box>
        <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Competecny</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {competencylist.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        competencylist.map((comp,index) => (
                            <tr key={comp.competency_id}>
                            <td>{index+1}</td>
                            <td>{comp.score}</td>
                            <td>
                                <Button type="submit" variant="contained" color="success" onClick={() => updateCompetency(comp.competency_id)} > <Tooltip title="Update Competecny" placement="left" arrow><EditIcon /> &nbsp;Update</Tooltip></Button>
                            </td>
                            </tr>
                        ))
                      )}
                </tbody>
            </table>
        </div>
    )
}