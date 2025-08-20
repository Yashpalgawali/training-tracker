import { useEffect, useRef, useState } from "react"
import { retrieveAllCompanies } from "../api/CompanyApiService"
import { useNavigate } from "react-router-dom"
import $, { error } from 'jquery'; // jQuery is required for DataTables to work
  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { Box, Button, Tooltip, Typography } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import { retrieveAllCategories } from "../api/CategoryApiService";
import { showToast } from "../SharedComponent/showToast";


export default function ViewCategoriesComponent() {

    const [categorylist,setCategoryList] = useState([])

    const didFetchRef = useRef(false)
    const tableRef = useRef(false); // Ref for the table
    const navigate = useNavigate()

    useEffect(()=> { 
        if (!didFetchRef.current) {
                didFetchRef.current = true;  
            refreshCategories()
        }
    } , [] )
    
    useEffect(() => {
      if (tableRef.current) {
        // 🔴 Destroy old DataTable if exists
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }

        // ✅ Initialize only when data exists
        if (categorylist.length > 0) {
          $(tableRef.current).DataTable({
            responsive: true,
            destroy: true // <-- Important, allows re-init
          });
        }
      }
    }, [categorylist]);
   

    function refreshCategories() {     
        
        retrieveAllCategories().then((response)=> {
            setCategoryList(response.data)
        }).catch((error)=> {             
             showToast(error.response.data.errorMessage, "error")
        })
    }  

    function addNewCategory() {
        navigate(`/category/-1`)
    }

    function updateCategory(id) {
        navigate(`/category/${id}`)
    }

    return(
        <div className="container">
            <Box>
                <Typography variant="h4" gutterBottom>View Categories <Button type="submit" variant="contained" color="primary" style={ { float: 'right' } } className="m-2" onClick={addNewCategory} > <Tooltip title="Add Category" arrow> Add Category</Tooltip></Button>    </Typography>
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
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {categorylist.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                No data available
                            </td>
                        </tr>
                        ) : (
                        categorylist.map((category,index) => (
                            <tr key={category.category_id}>
                            <td>{index+1}</td>
                            <td>{category.category}</td>
                            <td>
                                <Button type="submit" variant="contained" color="success" onClick={() => updateCategory(category.category_id)} > <Tooltip title="Update Category" placement="left" arrow><EditIcon /> &nbsp;Update</Tooltip></Button>
                            </td>
                            </tr>
                        ))
                      )}
                </tbody>
            </table>
        </div>
    )
}