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
import CategoryComponent from './Category/CategoryComponent';
import ViewCategoriesComponent from './Category/ViewCategoriesComponent';
import TrainingTimeSlotComponent from './TrainingTimeSlot/TrainingTimeSlotComponent';
import ViewTrainingTimeSlotComponent from './TrainingTimeSlot/ViewTrainingTimeSlotComponent';
import ViewCompetenciesComponent from './Competency/ViewCompetenciesComponent';
import CompetencyComponent from './Competency/CompetencyComponent';
import ChangePassword from './ChangePassword';
import ConfirmOtp from './ConfirmOtp';
import ChangeForgotPassword from './ChangeForgotPassword';
import ViewEmployeehistory from './Employee/ViewEmployeehistory';
import ViewEmployeeTrainingHistory from './Employee/ViewEmployeeTrainingHistory';
import ViewTrainingHistory from './Employee/ViewTrainingHistory';
import HolidayComponent from './Holidays/HolidayComponent';
import ViewHolidays from './Holidays/ViewHolidays';
import DashboardLayout from './Layout/DashboardLayout';

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
       {/* <HashRouter> */}
        {/* <HeaderComponent /> */}
          <ToastContainer position="top-center" autoClose={2500} />
            <Routes>
              
                <Route path='/company/:id' element={ 
                   <AuthenticateRoute>
                      <DashboardLayout>
                      <CompanyComponent /> 
                      </DashboardLayout> 
                   </AuthenticateRoute>
                  }>
                 </Route>                
                <Route path='/companies' element={ <AuthenticateRoute><DashboardLayout> <ViewCompanyComponent /> </DashboardLayout> </AuthenticateRoute> }> </Route>

                <Route path='/competency/:id' element={  <AuthenticateRoute> <DashboardLayout><CompetencyComponent /> </DashboardLayout>  </AuthenticateRoute> }> </Route>                
                <Route path='/competencies' element={ <AuthenticateRoute> <DashboardLayout> <ViewCompetenciesComponent /></DashboardLayout>  </AuthenticateRoute> }> </Route>

                <Route path='/designation/:id' element={ <AuthenticateRoute><DashboardLayout> <DesignationComponent /> </DashboardLayout> </AuthenticateRoute>}> </Route>
                <Route path='/viewdesignations' element={ <AuthenticateRoute><DashboardLayout> <ViewDesignation /></DashboardLayout>  </AuthenticateRoute>}> </Route>

                <Route path='/department/:id' element={ <AuthenticateRoute><DashboardLayout> <DepartmentComponent /> </DashboardLayout> </AuthenticateRoute>}> </Route>
                <Route path='/viewdepartments' element={ <AuthenticateRoute><DashboardLayout> <ViewDepartmentComponent /></DashboardLayout> </AuthenticateRoute> }></Route>
                
                <Route path='/training/:id' element={<AuthenticateRoute> <DashboardLayout> <TrainingComponent /> </DashboardLayout> </AuthenticateRoute>}> </Route>
                <Route path='/viewtraining' element={ <AuthenticateRoute><DashboardLayout> <ViewTrainingComponent /></DashboardLayout>  </AuthenticateRoute>}> </Route>
                
                <Route path='/employee/:id' element={ <AuthenticateRoute><DashboardLayout> <EmployeeComponent /></DashboardLayout> </AuthenticateRoute> }> </Route>
                <Route path='/viewemployees' element={ <AuthenticateRoute><DashboardLayout> <ViewEmployeeComponent /></DashboardLayout> </AuthenticateRoute> }> </Route>
                <Route path='/history/employee/:id' element={<AuthenticateRoute> <DashboardLayout> <ViewEmployeehistory /></DashboardLayout>  </AuthenticateRoute>} ></Route>
                
                <Route path='/trainingtimeslot/:id' element={ <AuthenticateRoute><DashboardLayout> <TrainingTimeSlotComponent /></DashboardLayout> </AuthenticateRoute> }> </Route>
                <Route path='/trainingtimeslots' element={ <AuthenticateRoute><DashboardLayout> <ViewTrainingTimeSlotComponent /></DashboardLayout> </AuthenticateRoute> }> </Route>

                <Route path='/training/employee/:id' element={ <AuthenticateRoute><DashboardLayout> <ViewEmployeeTrainings /></DashboardLayout>  </AuthenticateRoute>}> </Route>
                
                <Route path='/train/employee/:id' element={<AuthenticateRoute> <DashboardLayout> <EmployeeTrainingComponent /></DashboardLayout>  </AuthenticateRoute>}> </Route>

                <Route path='/category/:id' element={ <AuthenticateRoute><DashboardLayout> <CategoryComponent /></DashboardLayout> </AuthenticateRoute> }> </Route>
                <Route path='/viewcategories' element={ <AuthenticateRoute><DashboardLayout> <ViewCategoriesComponent /></DashboardLayout> </AuthenticateRoute> }> </Route>
                
                <Route path='/change/password' element={<AuthenticateRoute> <DashboardLayout> <ChangePassword /></DashboardLayout>  </AuthenticateRoute>}></Route>
                <Route path='/confirm/otp' element={  <ConfirmOtp />  } ></Route>

                <Route path='/training/history/:empid/:trainingid' element={ <AuthenticateRoute><DashboardLayout>  <ViewEmployeeTrainingHistory /></DashboardLayout>  </AuthenticateRoute>}></Route> 

                <Route path='/training/history/:empid' element={ <AuthenticateRoute> <DashboardLayout> <ViewTrainingHistory /></DashboardLayout>  </AuthenticateRoute>}></Route> 
                
                <Route path='/forgot/password/change' element={  <ChangeForgotPassword />  } ></Route>

                <Route path='/holiday/:id' element={ <AuthenticateRoute><DashboardLayout> <HolidayComponent /></DashboardLayout> </AuthenticateRoute> }> </Route>
                <Route path='/holidays' element={ <AuthenticateRoute><DashboardLayout>  <ViewHolidays /> </DashboardLayout> </AuthenticateRoute> }> </Route>
                
                <Route path='/home' element={<AuthenticateRoute><DashboardLayout>  <HomeComponent /> </DashboardLayout> </AuthenticateRoute> }> </Route>
                <Route path='/' element={ <LoginComponent /> }> </Route>
                <Route path='/login' element={ <LoginComponent /> }> </Route>
                <Route path='*' element={ <ErrorComponent /> }> </Route>

            </Routes>
          </BrowserRouter>
          {/* </HashRouter> */}
          
          {/* <footer className='footer' style={{ marginTop : '50px' }}   >
            <p><strong>&copy;</strong> All Rights Reserved @<strong>Company Pvt. Ltd</strong></p>
          </footer>  */}
       </AuthProvider>
    )
}