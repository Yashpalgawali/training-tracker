import { useEffect, useRef, useState } from "react"
import { retrieveAllCompanies } from "../api/CompanyApiService"
import { useNavigate } from "react-router-dom"
import $ from 'jquery'; // jQuery is required for DataTables to work
  
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import { Box, Button, Tooltip, Typography } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import { retrieveAllCategories } from "../api/CategoryApiService";


export default function ViewCategoriesComponent() {

    const [categorylist,setCategoryList] = useState([])

    const tableRef = useRef(null); // Ref for the table
    const navigate = useNavigate()

    useEffect(()=> refreshCategories() , [] )
    
    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && categorylist.length > 0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [categorylist]); // Re-initialize DataTables when activities data changes
   

    function refreshCategories() {     
        
        retrieveAllCategories().then((response)=> {
            setCategoryList(response.data)
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