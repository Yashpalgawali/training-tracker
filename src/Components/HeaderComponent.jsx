import { Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

export default function HeaderComponent(){
    return(
 <header className="border-bottom border-light border-5 mb-5 p-2 ">
        <div className="container-fluid">
            <div className="row">
                <nav className="navbar navbar-expand-lg">
                    {/* <a className="navbar-brand ms-2 fs-2 fw-bold text-black" href="https://www.in28minutes.com">in28minutes</a> */}
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav">
                        <li className="nav-item fs-5">
                        { <Link className="nav-link" to="/home">Home</Link> }
                        </li>
                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/companies">Companies</Link>
                        }
                        </li>             

                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/viewdesignations">Designations</Link>
                        }
                        </li>
                        
                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/viewdepartments">Departments</Link>
                        }
                        </li>
                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/viewtraining">Trainings</Link>
                        }
                        </li>
                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/viewemployees">Employees</Link>
                        }
                        </li>
                         <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/train/employee/-1">Train Employee</Link>
                        }
                        </li>
                        </ul>
                    </div>
                    <ul className="navbar-nav">
                        <li className="nav-item fs-5">
                        {
                            ! <Link className="nav-link" to="/login"> Login</Link>
                        }
                        </li>
                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/logout"   >
                                <i className="fa fa-home"></i><LogoutIcon  color="warning" /> Logout</Link>
                        }
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
    )
}