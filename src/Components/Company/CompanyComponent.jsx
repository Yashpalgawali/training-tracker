import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { retrieveAllCompanies, retrieveCompanyById, saveCompany, updateCompany } from "../api/CompanyApiService"
import { ErrorMessage,  Formik,Form } from "formik"
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material"

import { toast } from "react-toastify"

import EditIcon from '@mui/icons-material/Edit';

import $ from 'jquery'; // jQuery is required for DataTables to work

import 'datatables.net-dt/css/dataTables.dataTables.css'; // DataTables CSS styles
import 'datatables.net'; // DataTables core functionality

export default function CompanyComponent () {

    const {id} =  useParams()
    const [compName , setCompName] = useState('')
    const [companyId ,setCompId] = useState('')
    const navigate = useNavigate()
    const [isDisabled, setIsDisabled] = useState(false)
    const [btnValue, setBtnValue] = useState('Add Company')
    const [complist,setCompList] = useState([])

    const tableRef = useRef(null); // Ref for the table
    useEffect(()=> {
        const getCompanyById = async() => {
             
            if(id != -1) {
                setBtnValue('Update Company')         
                retrieveCompanyById(id).then((response) => {
                    setCompName(response.data.compName)
                    setCompId(response.data.companyId)
                })
                .catch((error)=> { 
                    sessionStorage.setItem('reserr',error.response.data.errorMessage)
                    navigate(`/companies`)
                })
            }
        };

        if(id){
            getCompanyById()
        }
    }, [id] ) 
       

    
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
             toast.error(error?.data?.errorMessage)
        })
    }  

    function onSubmit(values) {
        setIsDisabled(true)
            const company = {
                companyId : id , compName: values.compName
            }

            setTimeout(() => {
                setIsDisabled(false)
            }, 1000);

            if(id == -1) {
                saveCompany(company)
                    .then((response)=> {                          
                        toast.success(response?.data?.responseMessage)
                        navigate('/company/-1')
                        })
                    .catch((error) => {   
                        toast.error(error?.data?.errorMessage,"error")
                        navigate('/company/-1')
                    }) 
            }
            else {
                updateCompany(company)
                    .then((response)=> {
                        toast.success(response?.data?.responseMessage)
                        refreshCompanies()
                        setCompName("")
                        setBtnValue("Add Company")
                        navigate('/company/-1')
                    })
                    .catch((error) => {
                        toast.error(error?.data?.errorMessage,"error")
                        refreshCompanies()
                        setCompName("")
                        navigate('/company/-1')
                    })
            }
         }
  
   function validate(values) {
        let errors = { }
  
        if(values.compName.length<2) {
            errors.compName = 'Please Enter at least 2 Characters'
        }
        return errors
   }

    
    return (
       <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", p: 2 }}>
            <Typography variant="h4" gutterBottom>
            {btnValue}
            </Typography>

    <Formik
      initialValues={{ companyId, compName }}
      enableReinitialize={true}
      onSubmit={onSubmit}
      validate={validate}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {(props) => (
        <Form>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            <TextField
              id="compName"
              name="compName"
              label="Company Name"
              variant="standard"
              placeholder="Enter Company Name"
              value={props.values.compName}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              error={props.touched.compName && Boolean(props.errors.compName)}
              helperText={<ErrorMessage name="compName" />}
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {btnValue}
              </Button>
            </Box>

          </Box>

        </Form>
      )}
    </Formik>


    <Box>
                    <Typography variant="h4" gutterBottom>View Companies </Typography>
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
                                    <Button type="submit" variant="contained" color="success" onClick={() => navigate(`/company/${comp.companyId}`)} > <Tooltip title={`Update ${comp.compName}` } placement="left" arrow><EditIcon /> &nbsp;Update</Tooltip></Button>
                                </td>
                                </tr>
                            ))
                          )}
                    </tbody>
                </table>
            </div>
  </Box>
);
}