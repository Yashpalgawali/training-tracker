import { useEffect, useRef, useState } from "react"
import { retrieveAllCompanies } from "../api/CompanyApiService"
import { useNavigate } from "react-router-dom"
import $ from 'jquery'; // jQuery is required for DataTables to work
  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { Box, Button, Tooltip, Typography } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import { showToast } from "../SharedComponent/showToast";


export default function ViewCompanyComponent() {

    const [complist,setCompList] = useState([])

    const tableRef = useRef(null); // Ref for the table
    const navigate = useNavigate()

    useEffect(()=> refreshCompanies() , [] )

    useEffect(() => {
        // Initialize DataTable only after the component has mounted
       if (tableRef.current) {
               // 🔴 Destroy old DataTable if exists
               if ($.fn.DataTable.isDataTable(tableRef.current)) {
                 $(tableRef.current).DataTable().destroy();
               }
       
               // ✅ Initialize only when data exists
               if (complist.length > 0) {
                 $(tableRef.current).DataTable({
                   responsive: true,
                   destroy: true // <-- Important, allows re-init
                 });
               }
             }
     
      }, [complist]); // Re-initialize DataTables when activities data changes
   

    function refreshCompanies() {
     
        retrieveAllCompanies().then((response)=> {
            setCompList(response.data)
        }).catch((error)=>{
             showToast(error.response.data.errorMessage, "error")
        })
    }  

    function addNewCompany() {
        navigate(`/company/-1`)
    }

    function updateCompany(id) {
        navigate(`/company/${id}`)
    }

    return(
        <div className="container">
            <Box>
                <Typography variant="h4" gutterBottom>View Companies <Button type="submit" variant="contained" color="primary" style={ { float: 'right' } } className="m-2" onClick={addNewCompany} > <Tooltip title="Add Company" arrow> Add Company</Tooltip></Button>    </Typography>
            </Box>
            <div>
            <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Company</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {complist.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        complist.map((comp,index) => (
                            <tr key={comp.companyId}>
                            <td>{index+1}</td>
                            <td>{comp.compName}</td>
                            <td>
                                <Button type="submit" variant="contained" color="success" onClick={() => updateCompany(comp.companyId)} > <Tooltip title={`Update ${comp.compName}` } placement="left" arrow><EditIcon /> &nbsp;Update</Tooltip></Button>
                            </td>
                            </tr>
                        ))
                      )}
                </tbody>
            </table>
            </div>
        </div>
    )
}