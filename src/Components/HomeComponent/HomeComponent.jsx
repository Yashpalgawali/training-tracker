import { Link } from "react-router-dom";
import "./Homecomponent.css" 
import EmployeeComponent from "../Employee/EmployeeComponent";

export default function HomeComponent() {
    return (
        <div className="container-fluid"  >
             <div className="sidebar">
               <ul>
                    <li>Home</li>
                    <li className="nav-item fs-5">
                        <Link className="nav-link" to="/viewemployees" > Employee</Link></li>
               </ul>
             </div>
            
        </div>
    )
}