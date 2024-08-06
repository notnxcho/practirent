import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"
import "./LayoutStyles.scss"

const Navbar = () => {
    const { currentUser, logout } = useAuth()
    return (
        <div className="navbar-container">
            <div className="navigation-wrap">
                <NavLink to="/" className={({ isActive }) => isActive ? "navlink-item active" : "navlink-item"}>Home</NavLink> 
                <NavLink to="/properties" className={({ isActive }) => isActive ? "navlink-item active" : "navlink-item"}>Properties</NavLink>
            </div>
            <div className="navbar-options">
                <div>{currentUser.email}</div>
                <div className="logout-button" onClick={logout}>logout</div>
            </div>
        </div>
    )
}

export default Navbar