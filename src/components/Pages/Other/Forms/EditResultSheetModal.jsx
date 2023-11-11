import { Modal, Button } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import AuthContext from "../../../../context/AuthContext";

const EditResultSheetModal = ({
  show,
  data,
  students,
  admin,
  handleAdd,
  handleClose,
  handleDelete,
}) => {
  const { authTokens, baseUrl } = useContext(AuthContext);

  const [listView, setListView] = useState([]);
  const [student, setStudent] = useState("");
  const [mark, setMark] = useState("");

  const resetForm = () => {
    setStudent("");
    setMark("");
  };

  const handleAddItem = async (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": data?.csrftoken,
      },
    };

    let formData = new FormData();

    formData.append("student", student);
    formData.append("mark", mark);
    formData.append("subject", data?.data?.items?.[0]?.subject_info?.id);

    requestOptions.body = formData;

    await fetch(`${baseUrl}/api/v1/result-sheets/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        toast.success("ResultSheet item added successfully!");
        handleAdd(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Something went wrong! try again");
      });
  };

  const handleDeleteResultSheetItem = async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": data?.csrftoken,
      },
    };
    await fetch(`${baseUrl}/api/v1/result-sheets/${id}/`, requestOptions)
      .then(() => {
        handleDelete(id);

        toast.success("ResultSheet item deleted successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Something went wrong! try again");
      });
  };

  useEffect(() => {
    setListView(
      students?.filter(
        (item) =>
          !data?.data?.items.some(
            (item2) => item2?.student === item?.student_profile?.id
          )
      )
    );
    if (data?.data?.items?.length == 0) {
      handleClose();
    }
  }, [students]);

  return (
    <Modal show={show} onHide={handleClose} centered size="">
      <Modal.Header closeButton>
        <Modal.Title>
          Edit ResultSheet #({data?.data?.subject_info?.subject_name})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Student UID</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Mark</th>
                  {!admin && <th scope="col">Action</th>}
                </tr>
              </thead>
              <tbody>
                {data?.data?.items?.map((item, index) => {
                  let st = students?.find(
                    (i) => i?.student_profile?.id == item?.student
                  );
                  return (
                    <tr key={index}>
                      <th scope="row">{st?.university_id}</th>
                      <td>
                        {st?.student_profile?.first_name}{" "}
                        {st?.student_profile?.last_name}
                      </td>
                      <td>{item?.mark}</td>
                      {!admin && (
                        <td>
                          <i
                            className="bi bi-trash-fill ps-3 text-danger"
                            onClick={() =>
                              handleDeleteResultSheetItem(item?.id)
                            }
                          ></i>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!admin && (
            <form onSubmit={handleAddItem} className="row">
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={student}
                  required
                  onChange={(e) => setStudent(e.target.value)}
                >
                  <option value="">Select Student</option>
                  {listView?.map((item, index) => {
                    return (
                      <option key={index} value={item?.student_profile?.id}>
                        {item?.university_id}{" "}
                        {item?.student_profile?.first_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Mark"
                  className="form-control"
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2 px-0">
                <button type="submit" className="form-control btn btn-warning">
                  Add
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="light"
          className="w-100"
          onClick={() => {
            resetForm();
            handleClose();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditResultSheetModal;
