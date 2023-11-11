import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import CustomModal from "../CustomModal";
import AddSuperAdminModal from "./Forms/AddSuperAdminModal";
import { toast } from "react-toastify";

const SuperAdmins = () => {
  const { authTokens, user, baseUrl, csrftoken } = useContext(AuthContext);

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showAddSuperAdminModal, setShowAddSuperAdminModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [superAdmins, setSuperAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [superAdminCount, setSuperAdminsCount] = useState({
    all: 0,
    inActive: 0,
    active: 0,
  });

  const handleDeleteSuperAdmin = async (data) => {
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
        `${baseUrl}/api/v1/super-admins/${data?.id}/`,
        requestOptions
      );
      await fetch(
        `${baseUrl}/api/v1/profile/${data?.id}/`,
        requestOptions
      )
        .then(() => {
          setSuperAdmins(
            superAdmins.filter(
              (item) => item?.superadmin_profile?.id !== data?.id
            )
          );
          toast.success("SuperAdmin deleted successfully!");
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

    await fetch(`${baseUrl}/api/v1/super-admins/`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setSuperAdmins(data);
      })
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

    setSuperAdminsCount({
      all: superAdmins?.length,
    });

    // Fetch data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [superAdmins]);

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
          handleDeleteSuperAdmin(data);
        }}
      />
      <AddSuperAdminModal
        show={showAddSuperAdminModal}
        data={{ ...modalContent, csrftoken: csrftoken }}
        token={{ authTokens: authTokens, csrftoken: csrftoken }}
        handleClose={() => setShowAddSuperAdminModal(false)}
        handleConfirm={(data) => {
          setShowAddSuperAdminModal(false);
          setSuperAdmins([...superAdmins, data]);
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
                    {superAdminCount.all}
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
                setShowAddSuperAdminModal(true);
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
                  <th scope="col">Full Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {superAdmins?.length > 0 &&
                  superAdmins.map((item, index) => {
                    let filter = true;
                    switch (activeTab) {
                      case 3:
                        filter = item?.superadmin_profile?.is_active == true;
                        break;
                    }
                    return (
                      filter && (
                        <tr key={index}>
                          <td>{`${item?.superadmin_profile?.first_name} ${item?.superadmin_profile?.last_name}`}</td>
                          <td>{item?.superadmin_profile?.email}</td>
                          <td>{item?.superadmin_profile?.phone}</td>
                          <td>{item?.superadmin_profile?.gender}</td>
                          <td className="text-info">
                            {user?.user_id !== item?.superadmin_profile?.id && (
                              <i
                                className="bi bi-trash-fill ms-3 text-danger"
                                onClick={() => {
                                  setModalContent({
                                    title: "Delete Super Admin",
                                    body: "This action is not undo-able! Continue?",
                                    cancel: "Cancel",
                                    ok: "Sure! Delete",
                                    variant: {
                                      cancel: "light",
                                      ok: "danger",
                                    },
                                    data: { id: item?.superadmin_profile?.id },
                                    size: "",
                                  });
                                  setShowCustomModal(true);
                                }}
                              ></i>
                            )}
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

export default SuperAdmins;
