import { Modal, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "../../../../context/AuthContext";

const AddClassModal = ({
  show,
  data,
  facultys,
  departments,
  admin,
  handleClose,
  handleConfirm,
}) => {
  const { authTokens, baseUrl } = useContext(AuthContext);
  const [year, setYear] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFaculty("");
    setDepartment("");
    setYear("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let formData = new FormData();

    formData.append(
      "name",
      `${
        departments.filter((item) => item?.id == department)[0]?.name
      }, ${year}`
    );
    formData.append("year", year);
    formData.append("department", department);

    let requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": data?.csrftoken,
      },
    };

    await fetch(`${baseUrl}/api/v1/classes/`, requestOptions)
      .then(async (response) => {
        if (response.status == 201) {
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
        setLoading(false);
        resetForm();
        handleConfirm(data);
      })
      .catch((error) => {
        setLoading(false);
        resetForm();
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add Class</Modal.Title>
      </Modal.Header>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="ps-2 mb-2">Faculty: </label>
              <select
                className="form-select"
                value={faculty}
                required
                onChange={(e) => {
                  setFaculty(e.target.value);
                }}
              >
                <option value="">Select faculty</option>
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
            <div className="col-md-5">
              <label className="ps-2 mb-2">Department: </label>
              <select
                className="form-select"
                value={department}
                required
                onChange={(e) => {
                  setDepartment(e.target.value);
                }}
              >
                <option value="">Select department</option>
                {[
                  ...(faculty
                    ? (admin
                        ? departments.filter(
                            (item) =>
                              item?.faculty_info?.id == admin?.faculty_info?.id
                          )
                        : departments
                      ).filter((item) => item?.faculty_info?.id == faculty)
                    : admin
                    ? departments.filter(
                        (item) =>
                          item?.faculty_info?.id == admin?.faculty_info?.id
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
            <div className="col-md-3">
              <label className="ps-2 mb-2">Year: </label>
              <input
                type="number"
                min="2000"
                max="9999"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
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

export default AddClassModal;
