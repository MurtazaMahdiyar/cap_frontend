import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import CustomModal from "../CustomModal";
import AddStudentModal from "./Forms/AddStudentModal";
import ViewStudentModal from "./Forms/ViewStudentModal";
import { toast } from "react-toastify";

const Students = () => {
  const { authTokens, user, baseUrl, csrftoken } = useContext(AuthContext);

  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [Class, setClass] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [classes, setClasses] = useState([]);
  const [facultys, setFacultys] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [admin, setAdmin] = useState(null);
  const [student_info, setStudent_info] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showViewStudentModal, setShowViewStudentModal] = useState(false);

  const [modalContent, setModalContent] = useState({});
  const [Student, setStudent] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState({
    all: 0,
    inActive: 0,
    active: 0,
  });

  const handleDeleteStudent = async (data) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    };
    try {
      await fetch(
        `${baseUrl}/api/v1/students/${data?.id}/`,
        requestOptions
      );
      await fetch(
        `${baseUrl}/api/v1/profile/${data?.id}/`,
        requestOptions
      )
        .then(() => {
          setStudent(
            Student.filter((item) => item?.student_profile?.id !== data?.id)
          );
          toast.success("Student deleted successfully!");
        })
        .catch((error) => {
          toast.error("Something went wrong! try again");
        });
    } catch (error) {
      toast.error("Something went wrong! try again");
    }
  };

  const handleSetActive = async (id) => {
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({
        is_active: "true",
      }),
    };
    await fetch(`${baseUrl}/api/v1/profile/${id}/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setStudent(
          Student.map((item, index) => {
            if (item?.student_profile?.id === data?.id) {
              item.student_profile = data;
            }
            return item;
          })
        );
        toast.success("Success!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const fetchData = async () => {
    const headers = {
      Authorization: `Bearer ${authTokens?.access}`,
    };

    await fetch(`${baseUrl}/api/v1/students/`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setStudent([...data?.filter((item) => item?.graduated == false)]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    if (user?.profile_type === "ADMIN") {
      await fetch(`${baseUrl}/api/v1/admins/${user?.user_id}/`, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => setAdmin(data))
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (user?.profile_type === "STUDENT") {
      await fetch(`${baseUrl}/api/v1/students/${user?.user_id}/`, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setStudent_info(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    await fetch(`${baseUrl}/api/v1/facultys/`, { headers })
      .then((response) => response.json())
      .then((data) => setFacultys(data))
      .catch((error) => {
        console.error("Error:", error);
      });

    await fetch(`${baseUrl}/api/v1/departments/`, { headers })
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((error) => {
        console.error("Error:", error);
      });

    await fetch(`${baseUrl}/api/v1/classes/`, { headers })
      .then((response) => response.json())
      .then((data) =>
        setClasses(data.filter((item) => item?.is_graduated == false))
      )
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    // Fetch data initially
    if (loading) {
      fetchData();
      setLoading(false);
    }

    setStudentCount({
      all: Student?.length,
      inActive:
        Student?.length > 0
          ? Student?.filter(
              (item) => item?.student_profile?.is_active === false
            ).length
          : 0,
      active:
        Student?.length > 0
          ? Student?.filter((item) => item?.student_profile?.is_active === true)
              .length
          : 0,
    });

    // Fetch data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [Student]);

  return (
    <>
      <CustomModal
        show={showCustomModal}
        content={modalContent}
        handleClose={() => {
          setShowCustomModal(false);
        }}
        handleConfirm={(data) => {
          setShowCustomModal(false);
          handleDeleteStudent(data);
        }}
      />
      <AddStudentModal
        show={showAddStudentModal}
        facultys={facultys}
        departments={departments}
        classes={classes}
        admin={admin}
        student={student_info}
        data={{ ...modalContent, csrftoken: csrftoken }}
        token={{ authTokens: authTokens, csrftoken: csrftoken }}
        handleClose={() => setShowAddStudentModal(false)}
        handleConfirm={(data) => {
          setShowAddStudentModal(false);
          setStudent([...Student, data]);
        }}
      />
      <ViewStudentModal
        show={showViewStudentModal}
        data={modalContent.data}
        handleClose={() => setShowViewStudentModal(false)}
      />

      <div className="card-body">
        <div className="row">
          <div className="col-8">
            <ul
              className="nav nav-tabs nav-tabs-bordered d-flex "
              id="borderedTabJustified"
              role="tablist"
            >
              <li className="nav-item flex-fill" role="presentation">
                <button
                  className={`nav-link w-100 ${
                    activeTab == 1 ? "active show" : ""
                  }`}
                  id="contact-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#bordered-justified-contact"
                  type="button"
                  role="tab"
                  aria-controls="contact"
                  aria-selected={activeTab == 1}
                  tabIndex="-1"
                  onClick={() => setActiveTab(1)}
                >
                  All
                  <span className="badge rounded-pill bg-info mx-1">
                    {studentCount.all}
                  </span>
                </button>
              </li>
              <li className="nav-item flex-fill" role="presentation">
                <button
                  className={`nav-link w-100 ${
                    activeTab == 2 ? "active show" : ""
                  }`}
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#bordered-justified-profile"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected={activeTab == 2}
                  onClick={() => setActiveTab(2)}
                >
                  InActive
                  <span className="badge rounded-pill bg-warning mx-1">
                    {studentCount.inActive}
                  </span>
                </button>
              </li>
              <li className="nav-item flex-fill" role="presentation">
                <button
                  className={`nav-link w-100 ${
                    activeTab == 3 ? "active show" : ""
                  }`}
                  id="contact-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#bordered-justified-contact"
                  type="button"
                  role="tab"
                  aria-controls="contact"
                  aria-selected={activeTab == 3}
                  tabIndex="-1"
                  onClick={() => setActiveTab(3)}
                >
                  Active
                  <span className="badge rounded-pill bg-success mx-1">
                    {studentCount.active}
                  </span>
                </button>
              </li>
            </ul>
          </div>
          <div className="col-4">
            <button
              type="button"
              className="btn btn-success w-100 rounded-pill"
              onClick={() => {
                setShowAddStudentModal(true);
              }}
            >
              Add
            </button>
          </div>
        </div>
        <div className="row my-3">
          <div className="col-md-3">
            <select
              className="form-select"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
            >
              <option value="">Select Faculty</option>
              {facultys?.map((item, index) => {
                return (
                  <option key={index} value={item?.id}>
                    {item?.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
              }}
            >
              <option value="">Select Department</option>
              {[
                ...(faculty
                  ? departments?.filter(
                      (item) => item?.faculty_info?.id == faculty
                    )
                  : departments),
              ]?.map((item, index) => {
                return (
                  <option key={index} value={item?.id}>
                    {item?.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={Class}
              onChange={(e) => setClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {[
                ...(department
                  ? classes.filter(
                      (item) => item?.department_info?.id == department
                    )
                  : classes),
              ]?.map((item, index) => {
                return (
                  <option key={index} value={item?.id}>
                    {item?.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Job Status</option>
              <option value="SCHOLARSHIP">Scholarship</option>
              <option value="JOB">In Job</option>
              <option value="JOBLESS">Jobless</option>
            </select>
          </div>
        </div>

        <div className="tab-content pt-2" id="borderedTabJustifiedContent">
          <div
            className={`tab-pane fade active show`}
            id="bordered-justified-home"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">UID</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Father Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...(statusFilter
                    ? Class
                      ? Student.filter(
                          (item) => item?.status == statusFilter
                        ).filter((item) => item?.student_class == Class)
                      : Student.filter((item) => item?.status == statusFilter)
                    : Class
                    ? Student.filter((item) => item?.student_class == Class)
                    : Student),
                ]?.map((item, index) => {
                  let content = "";
                  let filter = true;
                  switch (activeTab) {
                    case 2:
                      filter = item?.student_profile?.is_active == false;
                      content = (
                        <span
                          className="btn btn-sm btn-warning p-1 rounded"
                          onClick={() =>
                            handleSetActive(item?.student_profile?.id)
                          }
                        >
                          Set Active
                        </span>
                      );
                      break;
                    case 3:
                      filter = item?.student_profile?.is_active == true;
                      break;
                  }
                  return (
                    filter && (
                      <tr key={index}>
                        <th scope="row">{item?.university_id}</th>
                        <td>{`${item?.student_profile?.first_name} ${item?.student_profile?.last_name}`}</td>
                        <td>{item?.father_name}</td>
                        <td>{item?.student_profile?.email}</td>
                        <td>{item?.student_profile?.phone}</td>
                        <td>{item?.status}</td>
                        <td className="text-info">
                          <i
                            className="bi bi-eye-fill text-info"
                            onClick={() => {
                              setModalContent({
                                variant: {
                                  cancel: "light",
                                  ok: "danger",
                                },
                                data: { item },
                                size: "",
                              });
                              setShowViewStudentModal(true);
                            }}
                          ></i>
                          {content}
                          <i
                            className="bi bi-trash-fill ms-3 text-danger"
                            onClick={() => {
                              setModalContent({
                                title: "Delete Student",
                                body: "This action is not undo-able! Continue?",
                                cancel: "Cancel",
                                ok: "Sure! Delete",
                                variant: {
                                  cancel: "light",
                                  ok: "danger",
                                },
                                data: { id: item?.student_profile?.id },
                                size: "",
                              });
                              setShowCustomModal(true);
                            }}
                          ></i>
                        </td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Students;
