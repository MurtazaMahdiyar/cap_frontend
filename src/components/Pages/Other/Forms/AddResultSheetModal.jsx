import { Modal, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "../../../../context/AuthContext";
import { read, utils } from "xlsx";

const AddResultSheetModal = ({
  show,
  data,
  facultys,
  departments,
  classes,
  subjects,
  students,
  admin,
  teacher,
  handleClose,
  handleConfirm,
}) => {
  const { authTokens, baseUrl } = useContext(AuthContext);

  const [department, setDepartment] = useState("");
  const [faculty, setFaculty] = useState("");
  const [subjectClass, setSubjectClass] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  const resetForm = () => {
    setFaculty("");
    setDepartment("");
    setSubjectClass("");
    setSubject("");
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ab = await file.arrayBuffer();
    const wb = read(ab);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const items = utils.sheet_to_json(ws);

    let rows = [];
    let tmp_students = subjectClass
      ? students.filter((item) => item?.student_class == subjectClass)
      : [];

    items.forEach((item) => {
      let row = {
        uid: item["Student UID"],
        mark: item["Mark"],
        subject: subject,
      };
      let student = tmp_students.filter(
        (item) => item?.university_id == row?.uid
      )?.[0];

      if (student) {
        rows = [
          ...rows,
          {
            id: student?.student_profile?.id,
            subject: parseInt(row?.subject),
            mark: row?.mark,
          },
        ];
      }
    });

    let requestOptions = {
      method: "POST",
      body: "",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
        "X-CSRFToken": data?.csrftoken,
      },
    };
    let formData;
    let results = [];

    const fetchRequests = rows?.map((item) => {
      const url = `${baseUrl}/api/v1/result-sheets/`;

      formData = new FormData();
      formData.append("subject", item?.subject);
      formData.append("student", item?.id);
      formData.append("mark", item?.mark);

      requestOptions.body = formData;

      return fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => results.push(data))
        .catch((error) => {
          console.error(error);
        });
    });

    Promise.all(fetchRequests)
      .then((response) => {
        if ([201, 200].includes(response?.status)) {
          handleConfirm([]);
        } else {
          handleConfirm(results);
        }
        resetForm();
      })
      .catch((error) => {
        toast.error("Something went wrong! try again");
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add ResultSheet</Modal.Title>
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
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="ps-2 mb-2">Class Name: </label>
              <select
                className="form-select"
                value={subjectClass}
                required
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
              <label className="ps-2 mb-2">Subject Name: </label>
              <select
                className="form-select"
                value={subject}
                required
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {[
                  ...(subjectClass
                    ? subjects.filter(
                        (item) => item?.subject_class == subjectClass
                      )
                    : subjects),
                ]?.map((item, index) => {
                  return (
                    <option key={index} value={item?.id}>
                      {item?.subject_name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <label className="ps-2 mb-2">MS Excel ResultSheet File: </label>
              <input
                className="form-control"
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
            <a href="sample.xlsx" className="ps-3 my-2 text-center">
              sample.xlsx - Sample File
            </a>
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

export default AddResultSheetModal;
