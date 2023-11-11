import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import CustomModal from "../CustomModal";
import AddSubjectModal from "./Forms/AddSubjectModal";
import { toast } from "react-toastify";

const Subjects = () => {
  const { authTokens, user, baseUrl, csrftoken } = useContext(AuthContext);

  const [showCustomModal, setShowCustomModal] = useState(false);

  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [Class, setClass] = useState("");

  const [admin, setAdmin] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [facultys, setFacultys] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [subjectsCount, setSubjectsCount] = useState({
    all: 0,
  });

  const handleDeleteSubject = async (data) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    };
    await fetch(`${baseUrl}/api/v1/subjects/${data?.id}/`, requestOptions)
      .then(() => {
        setSubjects(subjects.filter((item) => item?.id !== data?.id));
        toast.success("Subject deleted successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Something went wrong! try again");
      });
  };

  const fetchData = async () => {
    const headers = {
      Authorization: `Bearer ${authTokens?.access}`,
    };

    await fetch(`${baseUrl}/api/v1/classes/`, { headers })
      .then((response) => response.json())
      .then((data) => setClasses(data))
      .catch((error) => {
        console.error("Error:", error);
      });

    await fetch(`${baseUrl}/api/v1/subjects/`, { headers })
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => {
        console.error("Error:", error);
      });

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

    await fetch(`${baseUrl}/api/v1/teachers/`, { headers })
      .then((response) => response.json())
      .then((data) => setTeachers(data))
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
    }
  };

  useEffect(() => {
    // Fetch data initially
    if (loading) {
      fetchData();
      setLoading(false);
    }

    setSubjectsCount({
      all: subjects?.length,
    });

    // Fetch data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [subjects]);

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
          handleDeleteSubject(data);
        }}
      />
      <AddSubjectModal
        show={showAddClassModal}
        facultys={facultys}
        departments={departments}
        classes={classes}
        teachers={teachers}
        admin={admin}
        data={{ ...modalContent, csrftoken: csrftoken }}
        handleClose={() => {
          setShowAddClassModal(false);
        }}
        handleConfirm={(data) => {
          setShowAddClassModal(false);
          toast.success("Subject added successfully!");
          setSubjects([...subjects, data]);
        }}
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
                    {subjectsCount.all}
                  </span>
                </button>
              </li>
            </ul>
          </div>
          <div className="col-4">
            {["SUPER_ADMIN", "ADMIN"].includes(user?.profile_type) && (
              <button
                type="button"
                className="btn btn-success w-100 rounded-pill"
                onClick={() => {
                  setShowAddClassModal(true);
                }}
              >
                Add
              </button>
            )}
          </div>
        </div>
        <div className="row my-3">
          <div className="col-md-4">
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
          <div className="col-md-4">
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
          <div className="col-md-4">
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
                  <th scope="col">ID</th>
                  <th scope="col">Subject Code</th>
                  <th scope="col">Subject Name</th>
                  <th scope="col"># Credits</th>
                  <th scope="col">Semster</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...(Class
                    ? subjects.filter((item) => item?.subject_class == Class)
                    : subjects),
                ]?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td scope="row">{item?.id}</td>
                      <td scope="row">{item?.subject_code}</td>
                      <td scope="row">{item?.subject_name}</td>
                      <td scope="row">{item?.number_of_credits}</td>
                      <td scope="row">{item?.semester}</td>
                      <td className="text-info">
                        {(user?.profile_type == "SUPER_ADMIN" ||
                          user?.profile_type == "ADMIN") && (
                          <i
                            className="bi bi-trash-fill ms-3 text-danger"
                            onClick={() => {
                              setModalContent({
                                title: "Delete Subject",
                                body: "This action is not undo-able! Continue?",
                                cancel: "Cancel",
                                ok: "Sure! Delete",
                                variant: {
                                  cancel: "light",
                                  ok: "danger",
                                },
                                data: { id: item?.id },
                                size: "",
                              });
                              setShowCustomModal(true);
                            }}
                          ></i>
                        )}
                      </td>
                    </tr>
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

export default Subjects;
