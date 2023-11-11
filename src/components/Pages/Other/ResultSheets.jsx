import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import CustomModal from "../CustomModal";
import AddResultSheetModal from "./Forms/AddResultSheetModal";
import EditResultSheetModal from "./Forms/EditResultSheetModal";
import { toast } from "react-toastify";

const ResultSheets = () => {
  const { authTokens, user, baseUrl, csrftoken } = useContext(AuthContext);

  const [showCustomModal, setShowCustomModal] = useState(false);

  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [Class, setClass] = useState("");

  const [admin, setAdmin] = useState(null);
  const [teacher, setTeacher] = useState(null);

  const [resultSheets, setResultSheets] = useState([]);
  const [rawResults, setRawResults] = useState([]);
  const [facultys, setFacultys] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [showAddResultSheetModal, setShowAddResultSheetModal] = useState(false);
  const [showEditResultSheetModal, setShowEditResultSheetModal] =
    useState(false);

  const [modalContent, setModalContent] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [resultSheetCount, setResultSheetsCount] = useState({
    all: 0,
  });

  const handleDeleteResultSheet = (data) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": csrftoken,
      },
    };

    let subjectId = "";
    const fetchRequests = data?.map((item) => {
      const url = `${baseUrl}/api/v1/result-sheets/${item?.id}/`;
      subjectId = item?.subject_info?.id;
      return fetch(url, requestOptions).catch((error) => {
        console.error(error);
      });
    });

    Promise.all(fetchRequests)
      .then(() => {
        setRawResults(
          rawResults?.filter((i) => i?.subject_info.id !== subjectId)
        );
        toast.success("Result Sheet deleted successfully!");
      })
      .catch((error) => {
        toast.error("Something went wrong! try again");
      });
  };

  const fetchData = async () => {
    const headers = {
      Authorization: `Bearer ${authTokens?.access}`,
    };

    await fetch(`${baseUrl}/api/v1/result-sheets/`, { headers })
      .then((response) => response.json())
      .then((data) => setRawResults(data))
      .catch((error) => {
        console.error("Error:", error);
      });

    await fetch(`${baseUrl}/api/v1/students/`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

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

    if (user?.profile_type === "ADMIN") {
      await fetch(`${baseUrl}/api/v1/admins/${user?.user_id}/`, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => setAdmin(data))
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (user?.profile_type === "TEACHER") {
      await fetch(`${baseUrl}/api/v1/teachers/${user?.user_id}/`, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => setTeacher(data))
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
    let temp_data = [
      ...(teacher
        ? rawResults?.filter(
            (item) =>
              item?.subject_info?.teacher == teacher?.teacher_profile?.id
          )
        : rawResults),
    ].reduce((result, item) => {
      const categoryExists = result.find(
        (group) => group?.subject_info?.id == item?.subject_info?.id
      );

      if (categoryExists) {
        categoryExists.items.push(item);
      } else {
        result.push({ subject_info: item?.subject_info, items: [item] });
      }

      return result;
    }, []);
    setResultSheets(temp_data);

    setResultSheetsCount({
      all: resultSheets?.length,
    });

    // Fetch data every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [rawResults]);

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
          handleDeleteResultSheet(data);
        }}
      />

      <AddResultSheetModal
        show={showAddResultSheetModal}
        facultys={facultys}
        departments={departments}
        classes={classes}
        subjects={[
          ...(teacher
            ? subjects.filter(
                (item) => item?.teacher == teacher?.teacher_profile?.id
              )
            : subjects),
        ]}
        students={students}
        admin={admin}
        teacher={teacher}
        data={{ ...modalContent, csrftoken: csrftoken }}
        handleClose={() => {
          setShowAddResultSheetModal(false);
          setResultSheetsCount({
            all: resultSheets?.length,
          });
        }}
        handleConfirm={(data) => {
          setShowAddResultSheetModal(false);
          toast.success("ResultSheet added successfully!");
          setRawResults([...rawResults, ...data]);
        }}
      />
      <EditResultSheetModal
        show={showEditResultSheetModal}
        students={students?.filter(
          (item) =>
            item?.student_class ==
            modalContent?.data?.subject_info?.subject_class
        )}
        admin={admin}
        handleDelete={(id) => {
          setRawResults(rawResults.filter((item) => item?.id !== id));
          setModalContent({
            ...modalContent,
            data: {
              ...modalContent.data,
              items: [
                ...modalContent.data.items.filter((item) => item?.id !== id),
              ],
            },
          });
        }}
        handleAdd={(data) => {
          setRawResults([...rawResults, data]);
          setModalContent({
            ...modalContent,
            data: {
              ...modalContent.data,
              items: [...modalContent.data.items, data],
            },
          });
        }}
        data={{ ...modalContent, csrftoken: csrftoken }}
        handleClose={() => {
          setShowEditResultSheetModal(false);
        }}
      />

      <div className="card-body">
        <div className="row">
          <div className="col-8"></div>
          <div className="col-4">
            {["TEACHER"].includes(user?.profile_type) && (
              <button
                type="button"
                className="btn btn-success w-100 rounded-pill"
                onClick={() => {
                  setShowAddResultSheetModal(true);
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
                  <th scope="col"># Student</th>
                  <th scope="col">Semster</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...(Class
                    ? resultSheets.filter(
                        (item) => item?.subject_info?.subject_class == Class
                      )
                    : resultSheets),
                ]?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td scope="row">{item?.subject_info?.id}</td>
                      <td scope="row">{item?.subject_info?.subject_code}</td>
                      <td scope="row">{item?.subject_info?.subject_name}</td>
                      <td scope="row">
                        {item?.subject_info?.number_of_credits}
                      </td>
                      <td scope="row">{item?.items.length} student(s)</td>
                      <td scope="row">{item?.subject_info?.semester}</td>
                      <td className="text-info">
                        {["TEACHER", "ADMIN"].includes(user?.profile_type) && (
                          <i
                            className="bi bi-pencil ms-2 text-primary"
                            onClick={() => {
                              setModalContent({
                                cancel: "Cancel",
                                ok: "Sure! Delete",
                                data: item,
                                size: "",
                              });
                              setShowEditResultSheetModal(true);
                            }}
                          ></i>
                        )}
                        {(user?.profile_type == "ADMIN" ||
                          user?.profile_type == "TEACHER") && (
                          <i
                            className="bi bi-trash-fill ms-3 text-danger"
                            onClick={() => {
                              setModalContent({
                                title: "Delete ResultSheet",
                                body: "This action is not undo-able! Continue?",
                                cancel: "Cancel",
                                ok: "Sure! Delete",
                                variant: {
                                  cancel: "light",
                                  ok: "danger",
                                },
                                data: item?.items,
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

export default ResultSheets;
