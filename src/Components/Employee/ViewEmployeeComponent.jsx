import $ from 'jquery'; // jQuery is required for DataTables to work
import { useEffect, useRef, useState } from "react"
import { downAllEmployeesList, downSampleEmployeesList, retrieveAllEmployees, retrieveAllEmployeesWithPagination, uploadEmployeeList } from "../api/EmployeeApiService"
import { showToast } from "../SharedComponent/showToast"
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality
import '../Employee/ViewEmployeeComponent.css';

import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DisabledVisibleIcon from '@mui/icons-material/DisabledVisible';

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { getAllTrainingHistory, getTrainingsByEmployeeId } from "../api/EmployeeTrainingApiService";

import { apiClient } from '../api/apiClient';

import ReactDOM from "react-dom/client"; // ✅ important for createRoot

 const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
        ))(({ theme }) => ({
            [`& .${tooltipClasses.arrow}`]: {
                color: theme.palette.common.black,
            },
            [`& .${tooltipClasses.tooltip}`]: {
                backgroundColor: theme.palette.common.black,
            },
    }));

export default function ViewEmployeeComponent() {

    const [empList,setEmpList] = useState([])

    const navigate = useNavigate()
    const didFetchRef = useRef(false)
    const tableRef = useRef(false)
    const dataTable = useRef(false)
    const [disabled,setDisabled] = useState(false)
    const [disabledDownloadTraining,setDownloadTrainingDisabled] = useState(false)

    const [loading, setLoading] = useState(false);
    const [isTrainingGiven,setIsTrainingGiven] = useState(false)

    function getTrainingsOfEmployeeById(empid) {
      let res;
      getTrainingsByEmployeeId(empid).then((response) => {
        res = true
        return res
      })
    }

    useEffect(()=> {
       
        const table = $(tableRef.current).DataTable({
          serverSide: true,
          processing: true,
          paging: true,        // ✅ ensure paging is enabled
          searching: true,     // ✅ enable search box
          info: true,          // ✅ show "Showing 1 to 10 of ..."
          lengthChange: true,  // ✅ allow user to select rows per page
        ajax: async (data, callback) => {
          try {
            // DataTables sends: start, length, search[value], etc.
            const params = {
              start: data.start,
              length: data.length,
              search: data.search.value || "",
              orderColumn: data.columns[data.order[0].column].data, // which column to sort
              orderDir: data.order[0].dir, // 'asc' or 'desc'
            }; 
            const response = await apiClient.get("employee/paged", { params });
              setEmpList(response.data.data)
            // DataTables expects this exact structure
            callback({
              draw: data.draw,
              recordsTotal: response.data.recordsTotal,
              recordsFiltered: response.data.recordsFiltered,
              data: response.data.data,
            });
          } catch (error) {
            console.error("DataTables AJAX error:", error);
            callback({ data: [] });
          }
        },
        columns: [
          { data: "empId", title: "ID" },
          { data: "empName", title: "Name" },
          { data: "empCode", title: "Employee Code" },
          { data: "joiningDate", title: "Joining Date" },
          { data: "contractorName", title: "Contractor Name" },
          { data: "designation.desigName", title: "Designation" },
          { data: "department.dept_name", title: "Department" },
          { data: "department.company.comp_name", title: "Company" },
         
          {
          data: null,
          title: "Actions",
          orderable: false,
          searchable: false,
          createdCell: (td, cellData, rowData) => {
          
            // Clear previous renders
            const root = ReactDOM.createRoot(td);
 
            root.render(
              <div style={{ display: "flex", gap: "8px" }}>
                <Fab size="medium" style={ { marginRight : 5 } }  color="primary" onClick={() => addTraining(rowData.empId) } aria-label="add">
                    <BootstrapTooltip title="Add Training">
                        <AddIcon />
                    </BootstrapTooltip>                                                
                </Fab>

                <Fab size="medium" style={ { marginRight : 5 } }  color="secondary" onClick={() => updateEmployee(rowData.empId) } aria-label="edit">
                    <BootstrapTooltip title="Update Employee Details">
                        <EditIcon />
                    </BootstrapTooltip>                                                
                </Fab>
                {
                    <Fab  size="medium" disabled= {
                                              ()=> {
                                                getTrainingsOfEmployeeById(rowData.empId) 
                                              }
                    } color="warning" onClick={() => getTrainingsOfEmployeeById(rowData.empId) } aria-label="view">
                    <BootstrapTooltip title="View Training">
                        <VisibilityIcon />
                    </BootstrapTooltip>
                  </Fab>
                }                  
              </div>
            );
          },
        },
        ],
      });
    
      // Cleanup when component unmounts
     return () => {
       if ($.fn.DataTable.isDataTable(tableRef.current)) {
          table.destroy(true); // ✅ true keeps the original table element
        }
      //  if (tableRef.current) {
      //   if ($.fn.DataTable.isDataTable(tableRef.current)) {
      //     $(tableRef.current).DataTable().clear().destroy();
      //   }
      //  }
    };
    }, [])

    
    // useEffect(
    // () =>
    //     {
    //         if (!didFetchRef.current) {
    //             didFetchRef.current = true;                            
    //             retriveAllEmployeeList()
    //         }
    //     },[])

    //   useEffect(() => {
    //     if (tableRef.current) {
    //       // 🔴 Destroy old DataTable if exists
    //       if ($.fn.DataTable.isDataTable(tableRef.current)) {
    //         $(tableRef.current).DataTable().destroy();
    //       }

    //       // ✅ Initialize only when data exists
    //       if (empList.length > 0) {
    //         $(tableRef.current).DataTable({
    //             responsive: true,
    //             destroy: true, // <-- Important, allows re-init
    //             scrollX: true // ensures horizontal scroll
    //         });
    //       }
    //     }
    // }, [empList]);

    // function retriveAllEmployeeList() {
      
    //     retrieveAllEmployees().then((response) => {          
    //         setEmpList(response.data) 
         
            // getTrainingsByEmployeeId(parseInt(response.data[0].emp_id)).then((response) =>{
            //    if(response.data=='') {
            //     setDownloadTrainingDisabled(true)
            //    }
            // })
    //     }).catch((error)=>{      
    //          setDisabled(true)   
    //           setDownloadTrainingDisabled(true)   
    //          showToast(error.response.data.errorMessage, "error")
    //     })
    // }
      

    function updateEmployee(id) {
        navigate(`/employee/${id}`)
    }

    function addNewEmployee() {
        navigate(`/employee/-1`)
    }

    function getEmployeeTrainings(id)  {         
        navigate(`/training/employee/${id}`)
    }

    function addTraining(empid) {
         navigate(`/train/employee/${empid}`)
    }
    
    function downloadAllTrainings() {
        getAllTrainingHistory().then((response)=> {
                // Convert the array buffer to a Blob
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // Create a link element to trigger download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'All Employees Training.xlsx';
                link.click();
            })
    }

     function downloadSampleToUploadEmployee() {
        downSampleEmployeesList().then((response)=> {
                // Convert the array buffer to a Blob
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // Create a link element to trigger download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'Sample To upload Employees.xlsx';
                link.click();
            })
    }
     
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  const handleUpload = async () => {
    setLoading(true)
    if (!file) {
      alert("Please Select an Excel file first");
      return;
    }

    const formData = new FormData();
    formData.append("empListExcel", file);

    try {
      const res = await  uploadEmployeeList(formData)
      
      setDisabled(false)
      setFile(null)
      setLoading(false);
      setFileName('')
      // 🔥 Refresh employee list after successful upload
      //  fetchEmployees();
           
    } catch (err) {      
        alert("File Upload failed");
    }
  };

function downloadAllEmployees() {
  setLoading(true)
    downAllEmployeesList().then((response)=> {
            setLoading(false)
            // Convert the array buffer to a Blob
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Create a link element to trigger download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'All Employees List.xlsx';
            link.click();
        })
    }

    return (
        <div className="container">
            <Box className="btnblock" sx={ {
               marginBlockEnd : '10px'
            } }>
                <Typography variant="h4">View Employees   </Typography>
                <Stack
                  direction={{ xs :"column", sm: "row" }}
                  
                  spacing={  2 }
                  alignItems={ { xs:'stretch' , sm: 'flex-end' } }
                  sx={{ alignSelf: {  xs : 'stretch' ,sm: 'center' }   }}
                >
                      <BootstrapTooltip title="Download Employee List">
                          <Button  disabled={!empList || empList.length===0} variant="contained" color="primary" onClick={downloadAllEmployees}><CloudDownloadIcon style={ { paddingRight : '5px'} }  /> Employees  </Button>
                      </BootstrapTooltip>
                      <BootstrapTooltip title="Add Employee">
                        <Button  variant="contained" color="secondary" onClick={addNewEmployee} >Add Employee</Button>
                      </BootstrapTooltip>
                          <BootstrapTooltip title="Download Trainings given to Employees">
                                  <Button   disabled={disabledDownloadTraining} variant="contained" color="inherit"  onClick={downloadAllTrainings}><CloudDownloadIcon style={ { paddingRight : '5px'} } /> Trainings  </Button>
                          </BootstrapTooltip> 
                      <BootstrapTooltip title="Download Sample excel To upload Employees">
                            <Button   variant="contained" color="info"  onClick={downloadSampleToUploadEmployee}><CloudDownloadIcon style={ { paddingRight : '5px'} } /> Sample  </Button>
                      </BootstrapTooltip> 
                        
                 </Stack>
            </Box>
            <hr className='mt-2' />
    <Box className="mt-4" display="flex" flexDirection="column" alignItems="center" gap={2}>
      {/* Hidden file input */}
      <input
        type="file"
        accept=".xlsx,.xls"
        id="excel-file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Label + Button */}
      <label htmlFor="excel-file">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Choose Excel File
        </Button>
      </label>

      {/* Show file name if selected */}
      {fileName && (
        <Typography variant="body2" color="textSecondary">
          Selected: {fileName}
        </Typography>
      )}

      {/* Upload Button */}
      <Button
        variant="contained"
        color="success"
        onClick={handleUpload}
        disabled={!file || loading}
        
        startIcon= {
          loading ? <CircularProgress size={20} color="teal" /> : null
        }
      >
        {loading ? "Uploading..." : "Upload to Server"}
      </Button>
    </Box>
   
   <div className="mt-3">
      <table ref={tableRef} className="display" style={{ width: "100%" }}></table>
    </div>
          {/* <div className='table-responsive'>
              <table ref={tableRef} className="table table-striped table-hover nowrap">
                  <thead>
                      <tr>
                          <th>Sr</th>
                          <th>Name</th>
                          <th>Employee Code</th>
                          <th>Joining Date</th>
                          <th>Designation</th>
                          <th>Department</th>
                          <th>Company</th>
                          <th>Contractor</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tbody>
                  {
                      empList.length === 0 ? (
                          <tr>
                              <td colSpan="9">No Employees Data Found</td>
                          </tr>
                      )
                      :
                      (
                          empList.map(
                              (emp,index) => (
                                  <tr key={emp.emp_id}>
                                      <td>{index+1}</td>
                                      <td>{emp.emp_name}</td>
                                      <td>{emp.emp_code}</td>
                                      <td>{emp.joining_date}</td>    
                                      <td>{emp.designation}</td>                                       
                                      <td>{emp.department}</td>
                                      <td>{emp.company}</td>
                                      <td>{emp.contractor_name}</td>
                                      <td>                                         
                                          <Fab size="medium" style={ { marginRight : 5 } }  color="primary" onClick={() => addTraining(emp.emp_id) } aria-label="add">
                                              <BootstrapTooltip title="Add Training">
                                                  <AddIcon />
                                              </BootstrapTooltip>                                                
                                          </Fab>
                                          <Fab size="medium" style={ { marginRight : 5 } }  color="secondary" onClick={() => updateEmployee(emp.emp_id) } aria-label="edit">
                                              <BootstrapTooltip title="Update Employee Details">
                                                  <EditIcon />
                                              </BootstrapTooltip>                                                
                                          </Fab>
                                            {   
                                            emp.trainings != '' ? (
                                                <Fab  size="medium" disabled={false} color="warning" onClick={() => getEmployeeTrainings(emp.emp_id) } aria-label="view">
                                                  <BootstrapTooltip title="View Training">
                                                      <VisibilityIcon />
                                                  </BootstrapTooltip>
                                                </Fab>
                                            ) : (
                                                <Fab  size="medium" disabled={true} color="warning" onClick={() => getEmployeeTrainings(emp.emp_id) } aria-label="view">
                                                  <BootstrapTooltip title="View Training">
                                                      <DisabledVisibleIcon />
                                                  </BootstrapTooltip>
                                                </Fab>
                                            )
                                            }
                                      </td>
                                  </tr>
                              )
                          )
                      )
                  }
                  </tbody>
              </table>
            <div>
          </div>
        </div> */}
      </div>
    )
}