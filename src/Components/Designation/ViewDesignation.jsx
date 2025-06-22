import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllDesignations }  from "../api/DesignationApiService"

import $ from 'jquery'; // jQuery is required for DataTables to work

import EditIcon from '@mui/icons-material/Edit';

import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { Button, Tooltip } from "@mui/material"
import { showToast } from "../SharedComponent/showToast";



export default function ViewDesignation() {

    const [desiglist,setDesigList] = useState([])
    const navigate = useNavigate()
    const [successMessage , setSuccessMessage] = useState('')
    const [errorMessage , setErrorMessage] = useState('')
    const tableRef = useRef(null)

    const didFetchRef = useRef(false);

    useEffect(
    () => 
        {
            if(sessionStorage.getItem('response')!='') {
                setSuccessMessage(sessionStorage.getItem('response'))
                        setTimeout(() => {
                        sessionStorage.removeItem('response')
                        setSuccessMessage('')
                    }, 2000);
            }
            if(sessionStorage.getItem('reserr')!=''){
                setErrorMessage(sessionStorage.getItem('reserr'))
                    setTimeout(() => {
                    sessionStorage.removeItem('reserr')
                    setErrorMessage('')
                    }, 2000);
            }             
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
            <h2 className="text-center m-4">View Designation 
                <Button type="submit" variant="contained" color="primary" style={ { float: 'right  ' } } className="m-2" onClick={addNewDesignation} >Add Designation</Button>    
            </h2>
            {successMessage && <div className="text-center alert alert-success"><strong> {successMessage} </strong></div> }
            {errorMessage && <div className="text-center alert alert-warning"> <strong>{errorMessage} </strong></div> }
         
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
                            <tr key={desig.desig_id}>
                            <td>{index+1}</td>
                            <td>{desig.desig_name}</td>
                            <td>
                                <Button type="submit" variant="contained" color="success" onClick={() => updateDesignation(desig.desig_id)} > <Tooltip arrow placement="left" title={`Update ${desig.desig_name}`}> <EditIcon /> &nbsp;Update</Tooltip></Button>
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