import { Modal, Button } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import AuthContext from "../../../../context/AuthContext";

const AddTeacherModal = ({
  show,
  facultys,
  departments,
  data,
  handleClose,
  handleConfirm,
}) => {
  const { authTokens, baseUrl } = useContext(AuthContext);
  const [listDepartments, setListDepartments] = useState([...departments]);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    personal_photo: "",
  });

  const [teacherData, setTeacherData] = useState({
    profile: "",
    faculty: "",
    department: "",
  });

  const resetForm = () => {
    setProfileData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      date_of_birth: "",
      personal_photo: "",
    });
    setTeacherData({ profile: "", faculty: "", department: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let formData = new FormData();

    formData.append("first_name", profileData.first_name);
    formData.append("last_name", profileData.last_name);
    formData.append("email", profileData.email);
    formData.append("password", profileData.password);
    formData.append("phone", profileData.phone);
    formData.append("gender", profileData.gender);
    formData.append("date_of_birth", profileData.date_of_birth);
    formData.append("personal_photo", profileData.personal_photo);

    let requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": data?.csrftoken,
      },
    };

    try {
      await fetch(`${baseUrl}/api/v1/profile/`, requestOptions)
        .then((response) => response.json())
        .then((data) => (teacherData.profile = data?.id));

      formData = new FormData();

      formData.append("profile", teacherData.profile);
      formData.append("department", teacherData.department);

      requestOptions.body = formData;

      await fetch(`${baseUrl}/api/v1/teachers/`, requestOptions)
        .then(async (response) => {
          if (response.ok) {
            return response.json();
          } else {
            requestOptions.method = "DELETE";
            fetch(
              `${baseUrl}/api/v1/profile/${teacherData.profile}/`,
              requestOptions
            );
            let result = await response.json();
            for (const key in result) {
              toast.error(key + ": " + result[key]);
            }
            throw new Error("error");
          }
        })
        .then((data) => {
          setLoading(false);
          toast.success("Teacher added successfully!");
          resetForm();
          handleConfirm(data);
        })
        .catch((error) => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong! try again.");
    }
  };

  useEffect(() => {
    setListDepartments([
      ...departments.filter(
        (item) => item?.faculty_info?.id == teacherData.faculty
      ),
    ]);
  }, [teacherData]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="xl"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>Add Teacher</Modal.Title>
      </Modal.Header>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-3">
              <label className="ps-2">First Name: </label>
              <input
                type="text"
                name="first_name"
                className="form-control"
                value={profileData.first_name}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    first_name: event.target.value.replace(/[^a-z]/gi, ""),
                  })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <label className="ps-2">Last Name: </label>
              <input
                type="text"
                name="last_name"
                className="form-control"
                value={profileData.last_name}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    last_name: e.target.value.replace(/[^a-z]/gi, ""),
                  })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <label className="ps-2">Date of Birth: </label>
              <input
                type="date"
                name="date_of_birth"
                className="form-control"
                value={profileData.date_of_birth}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    date_of_birth: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <label className="ps-2">Gender: </label>
              <select
                name="gender"
                className="form-select"
                value={profileData.gender}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    gender: e.target.value,
                  })
                }
                required
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-5">
              <label className="ps-2">Email: </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="col-md-4">
              <label className="ps-2">Password: </label>
              <input
                type="text"
                minLength={8}
                className="form-control"
                value={profileData.password}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <label className="ps-2">Phone #: </label>
              <input
                type="text"
                minLength={10}
                maxLength={10}
                className="form-control"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    phone: e.target.value.replace(/[^\d-]/g, ""),
                  })
                }
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-5">
              <label className="ps-2">Personal Photo </label>
              <input
                type="file"
                accept=".jpg, .png"
                name="personal_photo"
                className="form-control"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    personal_photo: e.target.files[0],
                  })
                }
              />
            </div>
            <div className="col-md-3">
              <label className="ps-2">Teacher Faculty: </label>
              <select
                name="student_class"
                className="form-select"
                value={teacherData.faculty}
                onChange={(e) => {
                  setTeacherData({
                    ...teacherData,
                    faculty: e.target.value,
                  });
                }}
              >
                <option value="">Select Faculty</option>
                {facultys &&
                  facultys?.map((item, index) => {
                    return (
                      <option key={index} value={item?.id}>
                        {item?.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="col-md-4">
              <label className="ps-2">Teacher Department: </label>
              <select
                className="form-select"
                value={teacherData.department}
                onChange={(e) =>
                  setTeacherData({
                    ...teacherData,
                    department: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Department</option>
                {listDepartments?.map((item, index) => {
                  return (
                    <option key={index} value={item?.id}>
                      {item?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => {
              resetForm();
              handleClose();
            }}
            disabled={loading ? "disabled" : ""}
          >
            Back
          </Button>
          <Button
            variant="warning"
            onClick={resetForm}
            disabled={loading ? "disabled" : ""}
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            variant="success"
            disabled={loading ? "disabled" : ""}
          >
            Submit Form
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddTeacherModal;
