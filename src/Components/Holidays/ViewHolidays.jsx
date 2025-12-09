import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { retrieveAllHolidays }  from "../api/HolidayApiService"

import $ from 'jquery'; // jQuery is required for DataTables to work
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality

import { Box, Button, Tooltip, Typography } from "@mui/material"
import { showToast } from "../SharedComponent/showToast";

export default function ViewHolidays() {

    const [holidaylist,setHolidayList] = useState([])
    const navigate = useNavigate()
    const tableRef = useRef(null)

    const didFetchRef = useRef(false);

    useEffect(
    () => 
        {               
            if (!didFetchRef.current) {
                didFetchRef.current = true;                            
                retrieveAllHolidaysFunction()
            }
        },[]) 

    useEffect(() => {
        // Initialize DataTable only after the component has mounted
        if (tableRef.current && holidaylist.length >0 ) {
          $(tableRef.current).DataTable(); // Initialize DataTables
        }
      }, [holidaylist]); // Re-initialize DataTables when activities data changes
   

    function retrieveAllHolidaysFunction() {
        
        retrieveAllHolidays().then(
            (response) => {   
                setHolidayList(response.data) 
            })
            .catch((error)=> {
                showToast(error.response.data.errorMessage, "error")
            })
    }

    function addNewHoliday() {
            navigate(`/holiday/-1`)
    }
    
   return(
        <div className="container">
            <Box>
                <Typography variant="h4" gutterBottom>View Holidays <Button type="submit" variant="contained" color="primary" style={ { float: 'right' } } className="m-2" onClick={addNewHoliday} > <Tooltip title="Add Holiday" arrow> Add Holiday</Tooltip></Button>    </Typography>
            </Box>

            <table ref={tableRef} className="table table-striped table-hover display">
                <thead>
                    <tr >
                        <th>Sr No.</th>
                        <th>Date</th>
                        <th>Holiday</th>
                        
                    </tr>
                </thead>
                <tbody>
                  {
                  holidaylist.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                No Data available
                            </td>
                        </tr>
                        ) : (
                        holidaylist.map((holiday,index) => (
                            <tr key={holiday.holidayId}>
                                <td>{index+1}</td>
                                <td>{holiday.holidayDate}</td>
                                <td>{holiday.holiday}</td>                             
                            </tr>
                        ))
                      )
                    }    
                </tbody>
            </table>
        </div>
    )
}