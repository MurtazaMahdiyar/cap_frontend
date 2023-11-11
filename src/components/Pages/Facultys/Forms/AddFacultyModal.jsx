import { Modal, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "../../../../context/AuthContext";

const AddFacultyModal = ({ show, data, handleClose, handleConfirm }) => {
  const { authTokens, baseUrl } = useContext(AuthContext);
  const [name, setName] = useState('');

  const resetForm = () => {
    setName('')
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("name", name);

    let requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": data?.csrftoken,
      },
    };

    await fetch(`${baseUrl}/api/v1/facultys/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        resetForm();
        handleConfirm(data);
      })
      .catch(error => {
        console.error("Error:", error);
      })

  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size=""
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Faculty</Modal.Title>
      </Modal.Header>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-12">
              <label className="ps-2 mb-2">Faculty Name: </label>
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

export default AddFacultyModal;
