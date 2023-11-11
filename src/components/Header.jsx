import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import "./header.css";

const Header = () => {
  let { user, baseUrl } = useContext(AuthContext);
  const [navMessages, setNavMessages] = useState(false);

  console.log(user);

  return (
    <>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div className="d-flex align-items-center justify-content-between">
          <a
            href="#"
            className="logo d-flex align-items-center text-decoration-none"
          >
            <span className="d-none d-lg-block">Complaint & Alumni Portal</span>
          </a>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item dropdown pe-3">
              {user && (
                <a
                  className="nav-link nav-profile d-flex align-items-center pe-0"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <span className="d-none d-md-block pe-2 text-end">
                    {user?.first_name} {user?.last_name}
                    <br />
                    <span style={{ opacity: "50%" }}>{user?.profile_type}</span>
                  </span>
                  {user?.personal_photo && (
                    <img
                      src={`${baseUrl}${user?.personal_photo}`}
                      alt="Profile"
                      className="rounded-circle"
                    />
                  )}
                </a>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
