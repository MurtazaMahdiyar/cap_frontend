import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import CustomModal from "../CustomModal";
import AddFacultyModal from "./Forms/AddFacultyModal";
import { toast } from "react-toastify";

const Facultys = () => {
  const { authTokens, user, baseUrl, csrftoken } = useContext(AuthContext);

  const [classes, setClasses] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [facultys, setFacultys] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [facultyCount, setFacultyCount] = useState({
    all: 0,
  });

  const handleDeleteFaculty = async (data) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    };
    await fetch(`${baseUrl}/api/v1/facultys/${data?.id}/`, requestOptions)
      .then(() => {
        setFacultys(facultys.filter((item) => item?.id !== data?.id));
        toast.success("Faculty deleted successfully!");
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

    setFacultyCount({
      all: facultys?.length,
    });

    // Fetch data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [facultys]);

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
          handleDeleteFaculty(data);
        }}
      />
      <AddFacultyModal
        show={showAddFacultyModal}
        data={{ ...modalContent, csrftoken: csrftoken }}
        handleClose={() => {
          setShowAddFacultyModal(false);
        }}
        handleConfirm={(data) => {
          setShowAddFacultyModal(false);
          toast.success("Faculty added successfully!");
          setFacultys([...facultys, data]);
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
                    {facultyCount.all}
                  </span>
                </button>
              </li>
            </ul>
          </div>
          {user?.profile_type == "SUPER_ADMIN" && (
            <div className="col-4">
              <button
                type="button"
                className="btn btn-success w-100 rounded-pill"
                onClick={() => {
                  setShowAddFacultyModal(true);
                }}
              >
                Add
              </button>
            </div>
          )}
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
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {facultys?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{item?.id}</th>
                      <td>{`${item?.name}`}</td>
                      <td className="text-info">
                        {user?.profile_type === "SUPER_ADMIN" && (
                          <i
                            className="bi bi-trash-fill ms-3 text-danger"
                            onClick={() => {
                              setModalContent({
                                title: "Delete Faculty",
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

export default Facultys;
