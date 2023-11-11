import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import CustomModal from "../CustomModal";
import AddDepartmentModal from "./Forms/AddDepartmentModal";
import { toast } from "react-toastify";

const Departments = () => {
  const { authTokens, user, baseUrl, csrftoken } = useContext(AuthContext);

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [faculty, setFaculty] = useState("");

  const [facultys, setFacultys] = useState([]);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [departmentCount, setDepartmentCount] = useState({
    all: 0,
  });

  const handleDeleteDepartment = async (data) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    };
    await fetch(
      `${baseUrl}/api/v1/departments/${data?.id}/`,
      requestOptions
    )
      .then(() => {
        setDepartments(departments.filter((item) => item?.id !== data?.id));
        toast.success("Deapartment deleted successfully!");
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

    await fetch(`${baseUrl}/api/v1/departments/`, { headers })
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((error) => {
        console.error("Error:", error);
      });

    await fetch(`${baseUrl}/api/v1/facultys/`, { headers })
      .then((response) => response.json())
      .then((data) => setFacultys(data))
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

    setDepartmentCount({
      all: departments?.length,
    });

    // Fetch data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [departments]);

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
          handleDeleteDepartment(data);
        }}
      />
      <AddDepartmentModal
        show={showAddDepartmentModal}
        facultys={facultys}
        data={{ ...modalContent, csrftoken: csrftoken }}
        handleClose={() => {
          setShowAddDepartmentModal(false);
        }}
        handleConfirm={(data) => {
          setShowAddDepartmentModal(false);
          toast.success("Department added successfully!");
          setDepartments([...departments, data]);
        }}
      />
      <div className="card-body">
        <div className="row">
          <div className="col">
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
                    {departmentCount.all}
                  </span>
                </button>
              </li>
            </ul>
          </div>
          {user?.profile_type == "SUPER_ADMIN" && (
            <div className="col">
              <button
                type="button"
                className="btn btn-success w-100 rounded-pill"
                onClick={() => {
                  setShowAddDepartmentModal(true);
                }}
              >
                Add
              </button>
            </div>
          )}
        </div>
        <div className="row my-3">
          <div className="col-md-12 ps-2 ">
            <select
              className="form-select ps-5"
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
                  <td scope="col">Faculty</td>
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...(faculty
                    ? departments?.filter(
                        (item) => item?.faculty_info?.id == faculty
                      )
                    : departments),
                ]?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{item?.id}</th>
                      <th scope="row">{item?.faculty_info?.name}</th>
                      <td>{`${item?.name}`}</td>
                      <td className="text-info">
                        {user?.profile_type === "SUPER_ADMIN" && (
                          <i
                            className="bi bi-trash-fill ms-3 text-danger"
                            onClick={() => {
                              setModalContent({
                                title: "Delete Department",
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

export default Departments;
