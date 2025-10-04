import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "./Security/AuthContext";
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';

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
//     <header className="  p-2 fixed-top top-0">
        <div className="container-fluid">
            <div className="row">
                <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-light">
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
                             <Link className="nav-link" to="/home"><HomeIcon /> Home</Link>
                        }
                        </li>             
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
                             <Link className="nav-link" to="/competencies">Competency</Link>
                        }
                        </li>
                        
                        </ul>
                    </div>
                    <ul className="navbar-nav">
                        <li className="nav-item fs-5">
                        { !isAuthenticated &&
                              <Link className="nav-link" to="/login"><LoginIcon color="success"/> Login</Link>  
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
//     </header>
    )
}