import $ from 'jquery'; // jQuery is required for DataTables to work
import { useEffect, useRef, useState } from "react"
import { downAllEmployeesList, downSampleEmployeesList, retrieveAllEmployees, uploadEmployeeList } from "../api/EmployeeApiService"
import { showToast } from "../SharedComponent/showToast"
import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality

import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { getAllTrainingHistory, getTrainingsByEmployeeId } from "../api/EmployeeTrainingApiService";



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
    const [disabled,setDisabled] = useState(false)
    const [disabledDownloadTraining,setDownloadTrainingDisabled] = useState(false)

    const [loading, setLoading] = useState(false);

    useEffect(
    () => 
        {               
            if (!didFetchRef.current) {
                didFetchRef.current = true;                            
                retriveAllEmployeeList()
            }
        },[])

    useEffect(() => {
      if (tableRef.current) {
        // 🔴 Destroy old DataTable if exists
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }

        // ✅ Initialize only when data exists
        if (empList.length > 0) {
          $(tableRef.current).DataTable({
            responsive: true,
            destroy: true // <-- Important, allows re-init
          });
        }
      }
    }, [empList]);

    function retriveAllEmployeeList() {
      
        retrieveAllEmployees().then((response) => {
            setEmpList(response.data) 
           
            getTrainingsByEmployeeId(parseInt(response.data[0].emp_id)).then((response) =>{
               if(response.data=='')
               {
                setDownloadTrainingDisabled(true)
               }
            })

        }).catch((error)=>{      
             setDisabled(true)   
              setDownloadTrainingDisabled(true)   
             showToast(error.response.data.errorMessage, "error")
        })
    }

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
      
      setFile(null)
      setLoading(false);
      setFileName('')
      // 🔥 Refresh employee list after successful upload
        retriveAllEmployeeList();
           
    } catch (err) {
      
      alert("Upload failed");
    }
  };

function downloadAllEmployees() {
    downAllEmployeesList().then((response)=> {
                
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
            <Box>
                <Typography variant="h4">View Employees  <BootstrapTooltip title="Download Employee List">
                            <Button   disabled={disabled} variant="contained" color="success" onClick={downloadAllEmployees}><CloudDownloadIcon /> Employees  </Button>
                        </BootstrapTooltip>
                    <Button style={ { float : 'right'} } variant="contained" color="primary" onClick={addNewEmployee} >Add Employee</Button> 
                        <BootstrapTooltip title="Download Trainings given to Employees">
                                <Button style={ { float : 'left' } } disabled={disabledDownloadTraining} variant="contained" color="info"  onClick={downloadAllTrainings}><CloudDownloadIcon /> Trainings  </Button>
                        </BootstrapTooltip> 
                                              
                </Typography>   
                 <BootstrapTooltip title="Download Sample excel To upload Employees">
                                <Button style={ { float : 'left' } }   variant="contained" color="info"  onClick={downloadSampleToUploadEmployee}><CloudDownloadIcon /> Sample  </Button>
                        </BootstrapTooltip> 
                
            </Box>
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
        
        startIcon={
          loading ? <CircularProgress size={20} color="teal" /> : null
        }
      >
        {loading ? "Uploading..." : "Upload to Server"}
      </Button>
    </Box>
            <div>
                <table ref={tableRef} className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Sr</th>
                            <th>Name</th>
                            <th>Employee Code</th>     
                            <th>Joininig Date</th>                     
                            <th>Designation</th>
                            <th>Department</th>
                            <th>Company</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        empList.length === 0 ? (
                            <tr>
                                <td colSpan="8">No Employees Data Found</td>
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

                                            <Fab  size="medium" color="warning" onClick={() => getEmployeeTrainings(emp.emp_id) } aria-label="view">
                                                <BootstrapTooltip title="View Training">
                                                    <VisibilityIcon />
                                                </BootstrapTooltip>
                                                
                                            </Fab>
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
        </div>
      </div>
    )
}