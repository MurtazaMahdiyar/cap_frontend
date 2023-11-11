import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import CustomModal from "../CustomModal";
import AddTeacherModal from "./Forms/AddTeacherModal";
import { toast } from "react-toastify";

const Teachers = () => {
  const { authTokens, user, baseUrl, csrftoken } = useContext(AuthContext);

  const [showCustomModal, setShowCustomModal] = useState(false);

  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");

  const [facultys, setFacultys] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [teachersCount, setTeachersCount] = useState({
    all: 0,
    inActive: 0,
    active: 0,
  });

  const handleDeleteTeachers = async (data) => {
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
        `${baseUrl}/api/v1/teachers/${data?.id}/`,
        requestOptions
      );
      await fetch(
        `${baseUrl}/api/v1/profile/${data?.id}/`,
        requestOptions
      )
        .then(() => {
          setTeachers(
            teachers.filter((item) => item?.teacher_profile?.id !== data?.id)
          );
          toast.success("Teacher deleted sucessfully!");
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Something went wrong! try again");
        });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong! try again");
    }
  };

  const fetchData = async () => {
    const headers = {
      Authorization: `Bearer ${authTokens?.access}`,
    };

    await fetch(`${baseUrl}/api/v1/teachers/`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setTeachers(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    if (user?.profile_type === "ADMIN") {
      await fetch(`${baseUrl}/api/v1/admins/${user?.user_id}/`, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => setFacultys([data?.faculty_info]))
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (user?.profile_type === "SUPER_ADMIN") {
      await fetch(`${baseUrl}/api/v1/facultys/`, { headers })
        .then((response) => response.json())
        .then((data) => setFacultys(data))
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    await fetch(`${baseUrl}/api/v1/departments/`, { headers })
      .then((response) => response.json())
      .then((data) => setDepartments(data))
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

    setTeachersCount({
      all: teachers?.length,
    });

    // Fetch data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [teachers]);

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
          handleDeleteTeachers(data);
        }}
      />
      <AddTeacherModal
        show={showAddTeacherModal}
        facultys={facultys}
        departments={departments}
        data={{ ...modalContent, csrftoken: csrftoken }}
        token={{ authTokens: authTokens, csrftoken: csrftoken }}
        handleClose={() => setShowAddTeacherModal(false)}
        handleConfirm={(data) => {
          setShowAddTeacherModal(false);
          setTeachers([...teachers, data]);
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
                    {teachersCount.all}
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
                setShowAddTeacherModal(true);
              }}
            >
              Add
            </button>
          </div>
        </div>
        <div className="row mt-3 mb-1">
          <div className="col-md-6">
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
          <div className="col-md-6">
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
                  <th scope="col">Faculty</th>
                  <th scope="col">Department</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...(department
                    ? teachers?.filter(
                        (item) => item?.department_info?.id === department
                      )
                    : teachers),
                ]?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">
                        {item?.department_info?.faculty_info?.name}
                      </th>
                      <th>{item?.department_info?.name}</th>
                      <td>{`${item?.teacher_profile?.first_name} ${item?.teacher_profile?.last_name}`}</td>
                      <td>{item?.teacher_profile?.email}</td>
                      <td>{item?.teacher_profile?.phone}</td>
                      <td>{item?.teacher_profile?.gender}</td>
                      <td className="text-info">
                        <i
                          className="bi bi-trash-fill ms-3 text-danger"
                          onClick={() => {
                            setModalContent({
                              title: "Delete Teacher",
                              body: "This action is not undo-able! Continue?",
                              cancel: "Cancel",
                              ok: "Sure! Delete",
                              variant: {
                                cancel: "light",
                                ok: "danger",
                              },
                              data: { id: item?.teacher_profile?.id },
                              size: "",
                            });
                            setShowCustomModal(true);
                          }}
                        ></i>
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

export default Teachers;
