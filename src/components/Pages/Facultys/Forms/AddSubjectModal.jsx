import { Modal, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "../../../../context/AuthContext";

const AddSubjectModal = ({
  show,
  data,
  facultys,
  departments,
  classes,
  teachers,
  admin,
  handleClose,
  handleConfirm,
}) => {
  const { authTokens, baseUrl } = useContext(AuthContext);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [department, setDepartment] = useState("");
  const [faculty, setFaculty] = useState("");
  const [subjectClass, setSubjectClass] = useState("");
  const [teacher, setTeacher] = useState("");
  const [semester, setSemester] = useState("");

  const resetForm = () => {
    setFaculty("");
    setSubjectName("");
    setSubjectClass("");
    setSubjectCode("");
    setDepartment("");
    setTeacher("");
    setSemester("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let formData = new FormData();
    formData.append("subject_code", subjectCode);
    formData.append("subject_name", subjectName);
    formData.append("subject_class", subjectClass);
    formData.append("semester", semester);
    formData.append("teacher", teacher);

    let requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": data?.csrftoken,
      },
    };

    await fetch(`${baseUrl}/api/v1/subjects/`, requestOptions)
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
        resetForm();
        setLoading(false);
        handleConfirm(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Something went wrong! try again");
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add Subject</Modal.Title>
      </Modal.Header>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="ps-2 mb-2">Subject Code: </label>
              <input
                type="text"
                className="form-control"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="ps-2 mb-2">Subject Name: </label>
              <input
                type="text"
                className="form-control"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="ps-2 mb-2">Faculty Name: </label>
              <select
                className="form-select"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
              >
                <option value="">Select Faculty</option>
                {[
                  ...(admin
                    ? facultys.filter(
                        (item) => item?.id == admin?.faculty_info?.id
                      )
                    : facultys),
                ]?.map((item, index) => {
                  return (
                    <option key={index} value={item?.id}>
                      {item?.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-6">
              <label className="ps-2 mb-2">Department Name: </label>
              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                {[
                  ...(faculty
                    ? departments.filter(
                        (item) => item?.faculty_info?.id == faculty
                      )
                    : []),
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
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="ps-2 mb-2">Class Name: </label>
              <select
                className="form-select"
                value={subjectClass}
                onChange={(e) => setSubjectClass(e.target.value)}
              >
                <option value="">Select Class</option>
                {[
                  ...(department
                    ? classes.filter(
                        (item) => item?.department_info?.id == department
                      )
                    : []),
                ]?.map((item, index) => {
                  return (
                    <option key={index} value={item?.id}>
                      {item?.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-6">
              <label className="ps-2 mb-2">Semester: </label>
              <select
                className="form-select"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="">Select Semester</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <label className="ps-2 mb-2">Teacher Name: </label>
              <select
                className="form-select"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
              >
                <option value="">Select Teacher</option>
                {teachers?.map((item, index) => {
                  return (
                    <option key={index} value={item?.teacher_profile?.id}>
                      {`${item?.teacher_profile?.first_name} ${item?.teacher_profile?.last_name} - ${item?.department_info?.faculty_info?.name}`}
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
            disabled={loading}
          >
            Back
          </Button>
          <Button variant="warning" onClick={resetForm} disabled={loading}>
            Reset Form
          </Button>
          <Button type="submit" variant="success" disabled={loading}>
            Submit Form
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddSubjectModal;
