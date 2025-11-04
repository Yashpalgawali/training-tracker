import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllDesignations }  from "../api/DesignationApiService"

import $ from 'jquery'; // jQuery is required for DataTables to work
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality

import { Box, Button, Tooltip, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast";
import EditIcon from '@mui/icons-material/Edit';

export default function ViewDesignation() {

    const [desiglist,setDesigList] = useState([])
    const navigate = useNavigate()
    const tableRef = useRef(null)

    const didFetchRef = useRef(false);

    useEffect(
    () => 
        {               
            if (!didFetchRef.current) {
                didFetchRef.current = true;                            
                retrieveAllDesignations()
            }
        },[]) 

    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && desiglist.length >0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [desiglist]); // Re-initialize DataTables when activities data changes
   

    function retrieveAllDesignations() {
        getAllDesignations().then(
            (response) => {   setDesigList(response.data) })
            .catch((error)=> {
                showToast(error.response.data.errorMessage, "error")
            })
    }

    function updateDesignation(id) {
        navigate(`/designation/${id}`)
    }
    
    function addNewDesignation() {
        navigate(`/designation/-1`)
    }
    
   return(
        <div className="container">
            <Box>
                <Typography variant="h4" gutterBottom>View Designation <Button type="submit" variant="contained" color="primary" style={ { float: 'right' } } className="m-2" onClick={addNewDesignation} > <Tooltip title="Add Designation" arrow> Add Designation</Tooltip></Button>    </Typography>
            </Box>
        
            <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Designation</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {
                  desiglist.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        desiglist.map((desig,index) => (
                            <tr key={desig.desigId}>
                            <td>{index+1}</td>
                            <td>{desig.desigName}</td>
                            <td>
                                <Button type="submit" variant="contained" color="success" onClick={() => updateDesignation(desig.desigId)} > <Tooltip arrow placement="left" title={`Update ${desig.desigName}`}> <EditIcon /> &nbsp;Update</Tooltip></Button>
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