import { Link } from "react-router-dom";

export default function HeaderComponent(){
    return(
 <header className="border-bottom border-light border-5 mb-5 p-2">
        <div className="container">
            <div className="row">
                <nav className="navbar navbar-expand-lg">
                    <a className="navbar-brand ms-2 fs-2 fw-bold text-black" href="https://www.in28minutes.com">in28minutes</a>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav">
                        <li className="nav-item fs-5">
                        { <Link className="nav-link" to="/home">Home</Link> }
                        </li>
                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/companies">View Companies</Link>
                        }
                        </li>             

                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/viewdesignations">View Designations</Link>
                        }
                        </li>
                        
                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/viewdepartments">View Departments</Link>
                        }
                        </li>
                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/viewtraining">View Trainings</Link>
                        }
                        </li>
                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/viewemployees">View Employees</Link>
                        }
                        </li>
                         <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/train/employee">Train Employee</Link>
                        }
                        </li>
                        </ul>
                    </div>
                    <ul className="navbar-nav">
                        <li className="nav-item fs-5">
                        {
                            ! <Link className="nav-link" to="/login">Login</Link>
                        }
                        </li>
                        <li className="nav-item fs-5">
                        {
                             <Link className="nav-link" to="/logout"   >
                                <i className="fa fa-home"></i> Logout</Link>
                        }
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
    )
}