import HeaderComponent from './HeaderComponent';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
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

export default function TrainingTrackerComponent() {
    return(
       <BrowserRouter basename="/trainingtracker">
        <HeaderComponent />
          <ToastContainer position="top-center" autoClose={2500} />
            <Routes>
                <Route path='/company/:id' element={ <CompanyComponent /> }> </Route>
                
                <Route path='/companies' element={ <ViewCompanyComponent /> }> </Route>

                <Route path='/designation/:id' element={ <DesignationComponent /> }> </Route>

                <Route path='/viewdesignations' element={ <ViewDesignation /> }> </Route>

                <Route path='/department/:id' element={ <DepartmentComponent /> }> </Route>

                <Route path='/viewdepartments' element={ <ViewDepartmentComponent /> }></Route>
                
                <Route path='/training/:id' element={ <TrainingComponent /> }> </Route>

                <Route path='/viewtraining' element={ <ViewTrainingComponent /> }> </Route>
                
                <Route path='/employee/:id' element={ <EmployeeComponent /> }> </Route>
                
                <Route path='/viewemployees' element={ <ViewEmployeeComponent /> }> </Route>

                <Route path='/training/employee/:id' element={ <ViewEmployeeTrainings /> }> </Route>
                
                <Route path='/train/employee/:id' element={ <EmployeeTrainingComponent /> }> </Route>

                <Route path='/home' element={ <HomeComponent /> }> </Route>
                <Route path='/' element={ <HomeComponent /> }> </Route>

            </Routes>
       </BrowserRouter>
    )
}