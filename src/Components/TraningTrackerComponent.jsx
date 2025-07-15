import HeaderComponent from './HeaderComponent';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import DesignationComponent from './Designation/DesignationComponent';
import ViewDesignation from './Designation/ViewDesignation';
import CompanyComponent from './Company/CompanyComponent';
import ViewCompanyComponent from './Company/ViewCompaniesComponent';
import DepartmentComponent from './Department/DepartmentComponent';
import ViewDepartmentComponent from './Department/ViewDepartmentComponent';
import { ToastContainer } from 'react-toastify';
import TrainingComponent from './Training/TrainingComponent';
import ViewTrainingComponent from './Training/ViewTrainingComponent';
import EmployeeComponent from './Employee/EmployeeComponent';
import ViewEmployeeComponent from './Employee/ViewEmployeeComponent';
import HomeComponent from './HomeComponent/HomeComponent';
import ViewEmployeeTrainings from './Employee/ViewEmployeeTrainings';
import EmployeeTrainingComponent from './Employee/EmployeeTrainingComponent';
import LoginComponent from './LoginComponent';
import ErrorComponent from './ErrorComponent';
import AuthProvider, { useAuth } from './Security/AuthContext';


function AuthenticateRoute({children}) {
   const authContext  = useAuth()

   if(authContext.isAuthenticated) {
       return children
   }

    return <Navigate to="/" />
}

export default function TrainingTrackerComponent() {

  
    return(
      <AuthProvider>
       <BrowserRouter basename="/trainingtracker">
        <HeaderComponent />
          <ToastContainer position="top-center" autoClose={2500} />
            <Routes>
              
                <Route path='/company/:id' element={ 
                   <AuthenticateRoute> 
                      <CompanyComponent /> 
                   </AuthenticateRoute>
                  }>
                 </Route>
                
                <Route path='/companies' element={ <AuthenticateRoute> <ViewCompanyComponent /> </AuthenticateRoute> }> </Route>

                <Route path='/designation/:id' element={ <AuthenticateRoute><DesignationComponent /> </AuthenticateRoute>}> </Route>

                <Route path='/viewdesignations' element={ <AuthenticateRoute><ViewDesignation /> </AuthenticateRoute>}> </Route>

                <Route path='/department/:id' element={ <AuthenticateRoute><DepartmentComponent /> </AuthenticateRoute>}> </Route>

                <Route path='/viewdepartments' element={ <AuthenticateRoute><ViewDepartmentComponent /></AuthenticateRoute> }></Route>
                
                <Route path='/training/:id' element={<AuthenticateRoute> <TrainingComponent /> </AuthenticateRoute>}> </Route>

                <Route path='/viewtraining' element={ <AuthenticateRoute><ViewTrainingComponent /> </AuthenticateRoute>}> </Route>
                
                <Route path='/employee/:id' element={ <AuthenticateRoute><EmployeeComponent /></AuthenticateRoute> }> </Route>
                
                <Route path='/viewemployees' element={ <AuthenticateRoute><ViewEmployeeComponent /></AuthenticateRoute> }> </Route>

                <Route path='/training/employee/:id' element={ <AuthenticateRoute><ViewEmployeeTrainings /> </AuthenticateRoute>}> </Route>
                
                <Route path='/train/employee/:id' element={<AuthenticateRoute> <EmployeeTrainingComponent /> </AuthenticateRoute>}> </Route>

                <Route path='/home' element={<AuthenticateRoute> <HomeComponent /></AuthenticateRoute> }> </Route>
                <Route path='/' element={ <LoginComponent /> }> </Route>
                <Route path='/login' element={ <LoginComponent /> }> </Route>
                <Route path='*' element={ <ErrorComponent /> }> </Route>

            </Routes>
          </BrowserRouter>
          
          <footer className='footer'>
            <p><strong>&copy;</strong> All Rights Reserved @ Tidycasa Pvt. Ltd</p>
          </footer> 
       </AuthProvider>
    )
}