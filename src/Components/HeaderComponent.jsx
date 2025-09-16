import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "./Security/AuthContext";
 

export default function HeaderComponent() {
    
    const authContext  = useAuth()
   
    const isAuthenticated = authContext.isAuthenticated
    const navigate = useNavigate()
     
    function logout()
    {
        if(authContext.logout()) {
            navigate('login')
        }
    }

 return(
    <header className="border-bottom border-light border-5 p-2 ">
        <div className="container-fluid">
            <div className="row">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                   {/* Toggler button (hamburger) */}
                    <button
                         className="navbar-toggler"
                         type="button"
                         data-bs-toggle="collapse"
                         data-bs-target="#navbarNav"
                         aria-controls="navbarNav"
                         aria-expanded="false"
                         aria-label="Toggle navigation"
                    >
                         <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse"  id="navbarNav">
                        <ul className="navbar-nav ms-auto">

                        <li className="nav-item fs-5">
                        { isAuthenticated &&
                             <Link className="nav-link" to="/companies">Companies</Link>
                        }
                        </li>             

                        <li className="nav-item fs-5">
                        { isAuthenticated &&
                             <Link className="nav-link" to="/viewdesignations">Designations</Link>
                        }
                        </li>
                        
                        <li className="nav-item fs-5">
                        { isAuthenticated &&
                             <Link className="nav-link" to="/viewdepartments">Departments</Link>
                        }
                        </li>
                        <li className="nav-item fs-5">
                        { isAuthenticated &&
                             <Link className="nav-link" to="/viewtraining">Trainings</Link>
                        }
                        </li>
                        <li className="nav-item fs-5">
                        { isAuthenticated &&
                             <Link className="nav-link" to="/viewemployees">Employees</Link>
                        }
                        </li>
                         <li className="nav-item fs-5">
                        { isAuthenticated &&
                             <Link className="nav-link" to="/train/employee/-1">Train Employee</Link>
                        }
                        </li>
                          <li className="nav-item fs-5">
                        { isAuthenticated &&
                             <Link className="nav-link" to="/viewcategories">Category</Link>
                        }
                        </li>
                        <li className="nav-item fs-5">
                        { isAuthenticated &&
                             <Link className="nav-link" to="/trainingtimeslots">Training Slots</Link>
                        }
                        </li>

                         <li className="nav-item fs-5">
                        { isAuthenticated &&
                             <Link className="nav-link" to="/competencies">Competency Scores</Link>
                        }
                        </li>
                        
                        </ul>
                    </div>
                    <ul className="navbar-nav">
                        <li className="nav-item fs-5">
                        { !isAuthenticated &&
                              <Link className="nav-link" to="/login"> Login</Link>  
                        }
                        </li>
                        <li className="nav-item fs-5">
                        { isAuthenticated &&
                             <Link className="nav-link"   onClick={logout}  >
                                <i className="fa fa-home"></i><LogoutIcon  color="warning"  /> Logout</Link>
                        }
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
    )
}