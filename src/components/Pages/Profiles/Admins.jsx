import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import CustomModal from "../CustomModal";
import AddAdminModal from "./Forms/AddAdminModal";

const Admins = () => {
  const { authTokens, baseUrl, csrftoken } = useContext(AuthContext);

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [facultys, setFacultys] = useState([]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [admins, setAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adminCount, setAdminCount] = useState({
    all: 0,
    inActive: 0,
    active: 0,
  });

  const handleDeleteAdmin = async (data) => {
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
        `${baseUrl}/api/v1/admins/${data?.id}/`,
        requestOptions
      );
      await fetch(
        `${baseUrl}/api/v1/profile/${data?.id}/`,
        requestOptions
      )
        .then(() => {
          setAdmins(
            admins.filter((item) => item?.admin_profile?.id !== data?.id)
          );
          toast.success("Admin deleted successfully!");
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

    await fetch(`${baseUrl}/api/v1/admins/`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setAdmins(data);
      })
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

    setAdminCount({
      all: admins?.length,
    });

    // Fetch data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [admins]);

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
          handleDeleteAdmin(data);
        }}
      />
      <AddAdminModal
        show={showAddAdminModal}
        facultys={facultys}
        data={{ ...modalContent, csrftoken: csrftoken }}
        token={{ authTokens: authTokens, csrftoken: csrftoken }}
        handleClose={() => setShowAddAdminModal(false)}
        handleConfirm={(data) => {
          setShowAddAdminModal(false);
          setAdmins([...admins, data]);
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
                    {adminCount.all}
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
                setShowAddAdminModal(true);
              }}
            >
              Add
            </button>
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
                  <th scope="col">Full Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {admins?.length > 0 &&
                  admins.map((item, index) => {
                    let filter = true;
                    switch (activeTab) {
                      case 3:
                        filter = item?.admin_profile?.is_active == true;
                        break;
                    }
                    return (
                      filter && (
                        <tr key={index}>
                          <th scope="row">{item?.faculty_info?.name}</th>
                          <td>{`${item?.admin_profile?.first_name} ${item?.admin_profile?.last_name}`}</td>
                          <td>{item?.admin_profile?.email}</td>
                          <td>{item?.admin_profile?.phone}</td>
                          <td>{item?.admin_profile?.gender}</td>
                          <td className="text-info">
                            <i
                              className="bi bi-trash-fill ms-3 text-danger"
                              onClick={() => {
                                setModalContent({
                                  title: "Delete Admin",
                                  body: "This action is not undo-able! Continue?",
                                  cancel: "Cancel",
                                  ok: "Sure! Delete",
                                  variant: {
                                    cancel: "light",
                                    ok: "danger",
                                  },
                                  data: { id: item?.admin_profile?.id },
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

export default Admins;
