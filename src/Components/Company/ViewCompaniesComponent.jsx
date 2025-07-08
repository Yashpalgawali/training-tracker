import { useEffect, useRef, useState } from "react"
import { retrieveAllCompanies } from "../api/CompanyApiService"
import { useNavigate } from "react-router-dom"
import $ from 'jquery'; // jQuery is required for DataTables to work
  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { Box, Button, Tooltip, Typography } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';


export default function ViewCompanyComponent() {

    const [complist,setCompList] = useState([])

    const tableRef = useRef(null); // Ref for the table
    const navigate = useNavigate()

    useEffect(()=> refreshCompanies() , [] )
    
    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && complist.length > 0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [complist]); // Re-initialize DataTables when activities data changes
   

    function refreshCompanies() {
        //if(sessionStorage.getItem('response')!=''){
        //     setSuccessMessage(sessionStorage.getItem('response'))
        //      setTimeout(() => {
        //         sessionStorage.removeItem('response')
        //         setSuccessMessage('')
        //      }, 2000);
        // }

        // if(sessionStorage.getItem('reserr')!=''){
        //     setErrorMessage(sessionStorage.getItem('reserr'))
        //      setTimeout(() => {
        //         sessionStorage.removeItem('reserr')
        //         setErrorMessage('')
        //      }, 2000);
        // }
        retrieveAllCompanies().then((response)=> {
            setCompList(response.data)
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
                            <tr key={comp.company_id}>
                            <td>{index+1}</td>
                            <td>{comp.comp_name}</td>
                            <td>
                                <Button type="submit" variant="contained" color="success" onClick={() => updateCompany(comp.company_id)} > <Tooltip title="Update Company" placement="left" arrow><EditIcon /> &nbsp;Update</Tooltip></Button>
                            </td>
                            </tr>
                        ))
                      )}
                </tbody>
            </table>
        </div>
    )
}