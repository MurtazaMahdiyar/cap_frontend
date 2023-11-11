import { Modal, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "../../../../context/AuthContext";

const AddDepartmentModal = ({
  show,
  data,
  facultys,
  handleClose,
  handleConfirm,
}) => {
  const { authTokens, baseUrl } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");

  const resetForm = () => {
    setName("");
    setFaculty("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("name", name);
    formData.append("faculty", faculty);

    let requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": data?.csrftoken,
      },
    };

    await fetch(`${baseUrl}/api/v1/departments/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        resetForm();
        handleConfirm(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add Department</Modal.Title>
      </Modal.Header>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="ps-2 mb-2">Faculty Name: </label>
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
              <label className="ps-2 mb-2">Department Name: </label>
              <input
                type="text"
                name="first_name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
          >
            Back
          </Button>
          <Button variant="warning" onClick={resetForm}>
            Reset Form
          </Button>
          <Button type="submit" variant="success">
            Submit Form
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddDepartmentModal;
