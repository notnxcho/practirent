import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"
import "./LayoutStyles.scss"
import Logo from '../../assets/practirent-iso.png'
import ProfilePopup from 'src/components/common/ProfilePopup/ProfilePopup'

const Navbar = () => {
    const { currentUser } = useAuth()
    return (
        <div className="navbar-container">
            <div className="navigation-wrap">
                <img src={Logo} alt='logo' width={44} height={44}/>
                <NavLink to="/" className={({ isActive }) => isActive ? "navlink-item active" : "navlink-item"}>Home</NavLink> 
                <NavLink to="/properties" className={({ isActive }) => isActive ? "navlink-item active" : "navlink-item"}>Properties</NavLink>
            </div>
            <div className="navbar-options">
                <ProfilePopup />
            </div>
        </div>
    )
}

export default Navbar