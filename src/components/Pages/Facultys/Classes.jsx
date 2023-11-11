import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import CustomModal from "../CustomModal";
import AddClassModal from "./Forms/AddClassModal";
import { toast } from "react-toastify";

const Classes = () => {
  const { authTokens, user, baseUrl, csrftoken } = useContext(AuthContext);

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [classes, setClasses] = useState([]);

  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [admin, setAdmin] = useState(null);

  const [facultys, setFacultys] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [classesCount, setClassesCount] = useState({
    all: 0,
  });

  const toggleStatus = async (item) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("is_graduated", !item?.is_graduated);
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": csrftoken,
      },
      body: formData,
    };

    await fetch(`${baseUrl}/api/v1/classes/${item?.id}/`, requestOptions)
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          handleClose();
          let result = await response.json();
          for (const key in result) {
            toast.error(key + ": " + result[key]);
          }
          throw new Error("error");
        }
      })
      .then((data) => {
        setClasses([...classes.filter((item) => item?.id !== data?.id), data]);
        setLoading(false);
        toast.success("Success!");
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Something went wrong! try again");
      });
  };

  const handleDeleteClass = async (data) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    };
    await fetch(`${baseUrl}/api/v1/classes/${data?.id}/`, requestOptions)
      .then(() => {
        setClasses(classes.filter((item) => item?.id !== data?.id));
        toast.success("Class deleted successfully!");
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

    setClassesCount({
      all: classes?.length,
    });

    // Fetch data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [classes]);

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
          handleDeleteClass(data);
        }}
      />
      <AddClassModal
        show={showAddClassModal}
        facultys={facultys}
        departments={departments}
        admin={admin}
        data={{ ...modalContent, csrftoken: csrftoken }}
        handleClose={() => {
          setShowAddClassModal(false);
        }}
        handleConfirm={(data) => {
          setShowAddClassModal(false);
          toast.success("Class added successfully!");
          setClasses([...classes, data]);
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
                    {classesCount.all}
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
          <div className="col-md-5">
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
          <div className="col-md-5">
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
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
          <div className="col-md-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter Status</option>
              <option value="true">Graduated</option>
              <option value="false">Not Graduated</option>
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
                  <th scope="col">Faculty</th>
                  <th scope="col">Department</th>
                  <th scope="col">Year</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...(statusFilter
                    ? (department
                        ? classes.filter(
                            (item) => item?.department_info?.id == department
                          )
                        : classes
                      ).filter(
                        (item) => item?.is_graduated == JSON.parse(statusFilter)
                      )
                    : department
                    ? classes.filter(
                        (item) => item?.department_info?.id == department
                      )
                    : classes),
                ]?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td scope="row">{item?.id}</td>
                      <td scope="row">
                        {item?.department_info?.faculty_info?.name}
                      </td>
                      <td scope="row">{item?.department_info?.name}</td>
                      <td>{`${item?.year}`}</td>
                      <td>
                        {item?.is_graduated ? "Graduated" : "Not Graduated"}
                      </td>
                      <td className="text-info">
                        {["SUPER_ADMIN", "ADMIN"].includes(
                          user?.profile_type
                        ) && (
                          <>
                            <button
                              className="btn btn-sm btn-success rounded text-light"
                              onClick={() => toggleStatus(item)}
                              disabled={loading}
                            >
                              Change Status
                            </button>
                            <i
                              className="bi bi-trash-fill ms-3 text-danger"
                              onClick={() => {
                                setModalContent({
                                  title: "Delete Class",
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
                          </>
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

export default Classes;
