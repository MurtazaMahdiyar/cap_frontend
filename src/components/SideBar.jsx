import { useEffect } from "react";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import LogoutModal from "./LogoutModal";
import "./sidebar.css";

const Sidebar = ({ changePage }) => {
  const { user, logoutUser, authTokens, baseUrl } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [student, setStudent] = useState(null);

  const [sidebarExpand, setSidebarExpand] = useState({
    profiles: false,
    facultys: false,
    resultSheets: false,
  });

  const headers = {
    Authorization: `Bearer ${authTokens?.access}`,
  };

  const fetchData = async () => {
    if (user?.profile_type == "STUDENT") {
      await fetch(`${baseUrl}/api/v1/students/${user?.user_id}/`, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setStudent(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          {["ADMIN", "SUPER_ADMIN"].includes(user?.profile_type) && (
            <li className="nav-item">
              <a
                className="nav-link "
                href="#"
                onClick={() =>
                  changePage({
                    data: {
                      url: "dashboard",
                      breadCrumb: ["Dashboard"],
                      pageTitle: "Dashboard",
                    },
                  })
                }
              >
                <i className="bi bi-grid"></i>
                <span>Dashboard</span>
              </a>
            </li>
          )}

          {["STUDENT", "ADMIN", "SUPER_ADMIN"].includes(user?.profile_type) && (
            <li className="nav-item">
              <a
                className="nav-link collapsed"
                href="#"
                onClick={() =>
                  setSidebarExpand({
                    ...sidebarExpand,
                    profiles: !sidebarExpand.profiles,
                  })
                }
              >
                <i className="bi bi-menu-button-wide"></i>
                <span>Profiles</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul
                id="components-nav"
                className={`nav-content collapse ${
                  sidebarExpand.profiles && "show"
                }`}
                data-bs-parent="#sidebar-nav"
              >
                {user?.profile_type == "STUDENT" && student && (
                  <>
                    {!student?.graduated && (
                      <li>
                        <a
                          href="#"
                          onClick={() =>
                            changePage({
                              data: {
                                url: "students",
                                breadCrumb: ["Profiles", "Students"],
                                pageTitle: "Students",
                              },
                            })
                          }
                        >
                          <i className="bi bi-circle"></i>
                          <span>Students</span>
                        </a>
                      </li>
                    )}
                    {student?.graduated && (
                      <li>
                        <a
                          href="#"
                          onClick={() =>
                            changePage({
                              data: {
                                url: "alumnus",
                                breadCrumb: ["Profiles", "Alumnus"],
                                pageTitle: "Alumnus",
                              },
                            })
                          }
                        >
                          <i className="bi bi-circle"></i>
                          <span>Alumnus</span>
                        </a>
                      </li>
                    )}
                  </>
                )}

                {["ADMIN", "SUPER_ADMIN"].includes(user?.profile_type) && (
                  <>
                    <li>
                      <a
                        href="#"
                        onClick={() =>
                          changePage({
                            data: {
                              url: "students",
                              breadCrumb: ["Profiles", "Students"],
                              pageTitle: "Students",
                            },
                          })
                        }
                      >
                        <i className="bi bi-circle"></i>
                        <span>Students</span>
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        onClick={() =>
                          changePage({
                            data: {
                              url: "alumnus",
                              breadCrumb: ["Profiles", "Alumnus"],
                              pageTitle: "Alumnus",
                            },
                          })
                        }
                      >
                        <i className="bi bi-circle"></i>
                        <span>Alumnus</span>
                      </a>
                    </li>
                  </>
                )}
                {["ADMIN", "SUPER_ADMIN"].includes(user?.profile_type) && (
                  <li>
                    <a
                      href="#"
                      onClick={() =>
                        changePage({
                          data: {
                            url: "teachers",
                            breadCrumb: ["Profiles", "Teachers"],
                            pageTitle: "Teachers",
                          },
                        })
                      }
                    >
                      <i className="bi bi-circle"></i>
                      <span>Teachers</span>
                    </a>
                  </li>
                )}

                {["SUPER_ADMIN"].includes(user?.profile_type) && (
                  <li>
                    <a
                      href="#"
                      onClick={() =>
                        changePage({
                          data: {
                            url: "admins",
                            breadCrumb: ["Profiles", "Admins"],
                            pageTitle: "Admins",
                          },
                        })
                      }
                    >
                      <i className="bi bi-circle"></i>
                      <span>Admins</span>
                    </a>
                  </li>
                )}

                {["SUPER_ADMIN"].includes(user?.profile_type) && (
                  <li>
                    <a
                      href="#"
                      onClick={() =>
                        changePage({
                          data: {
                            url: "super-admins",
                            breadCrumb: ["Profiles", "Super Admins"],
                            pageTitle: "Super Admins",
                          },
                        })
                      }
                    >
                      <i className="bi bi-circle"></i>
                      <span>Super Admins</span>
                    </a>
                  </li>
                )}
              </ul>
            </li>
          )}

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              onClick={() =>
                setSidebarExpand({
                  ...sidebarExpand,
                  facultys: !sidebarExpand.facultys,
                })
              }
            >
              <i className="bi bi-building"></i>
              <span>Facultys</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="components-nav"
              className={`nav-content collapse ${
                sidebarExpand.facultys && "show"
              }`}
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <a
                  href="#"
                  onClick={() =>
                    changePage({
                      data: {
                        url: "facultys",
                        breadCrumb: ["Facultys", "Facultys"],
                        pageTitle: "Facultys",
                      },
                    })
                  }
                >
                  <i className="bi bi-circle"></i>
                  <span>Facultys</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() =>
                    changePage({
                      data: {
                        url: "departments",
                        breadCrumb: ["Facultys", "Departments"],
                        pageTitle: "Departments",
                      },
                    })
                  }
                >
                  <i className="bi bi-circle"></i>
                  <span>Departments</span>
                </a>
              </li>

              {["ADMIN", "SUPER_ADMIN"].includes(user?.profile_type) && (
                <li>
                  <a
                    href="#"
                    onClick={() =>
                      changePage({
                        data: {
                          url: "classes",
                          breadCrumb: ["Facultys", "Classes"],
                          pageTitle: "Classes",
                        },
                      })
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>Classes</span>
                  </a>
                </li>
              )}

              {["ADMIN", "SUPER_ADMIN"].includes(user?.profile_type) && (
                <li>
                  <a
                    href="#"
                    onClick={() =>
                      changePage({
                        data: {
                          url: "subjects",
                          breadCrumb: ["Facultys", "Subjects"],
                          pageTitle: "Subjects",
                        },
                      })
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>Subjects</span>
                  </a>
                </li>
              )}
            </ul>
          </li>

          <li className="nav-heading">Pages</li>

          {["ADMIN", "TEACHER"].includes(user?.profile_type) && (
            <li className="nav-item">
              <a
                className="nav-link collapsed"
                href="#"
                onClick={() =>
                  changePage({
                    data: {
                      url: "result-sheets",
                      breadCrumb: ["Result Sheets"],
                      pageTitle: "Result Sheets",
                    },
                  })
                }
              >
                <i className="bi bi-stack"></i>
                <span>Result Sheets</span>
              </a>
            </li>
          )}

          {/*<li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              onClick={() =>
                changePage({
                  data: {
                    url: "my-profile",
                    breadCrumb: ["My Profile"],
                    pageTitle: "My Profile",
                  },
                })
              }
            >
              <i className="bi bi-person"></i>
              <span>My Profile</span>
            </a>
          </li>*/}

          <li className="nav-item">
            <LogoutModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              handleLogout={logoutUser}
            />
            <a
              className="nav-link collapsed"
              href="#"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
