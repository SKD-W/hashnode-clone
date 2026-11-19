import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { PenSquare, LogOut, LayoutDashboard, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="brand">
          <span className="brand-badge">H</span>
          <span>DevNode</span>
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              <Link to="/write" className="btn btn-primary">
                <PenSquare size={16} /> Write
              </Link>
              <Link to="/dashboard" className="nav-item">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to={`/u/${user.username}`} className="nav-item">
                <User size={16} /> @{user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-ghost"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
