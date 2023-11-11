import { Modal, Button } from "react-bootstrap";
import { useContext } from 'react';
import AuthContext from '../../../../context/AuthContext';

const ViewStudentModal = ({ show, data, handleClose }) => {

  const { baseUrl } = useContext(AuthContext);

  return (
    <Modal show={show} onHide={handleClose} centered size="">
      <Modal.Header closeButton>
        <Modal.Title>{`${data?.item?.university_id} - ${
          data?.item?.graduated ? "Alumni" : "Student"
        } Information`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="">
          <div className="row">
            <div className="col-4">
              <img
                src={(data?.item?.student_profile?.personal_photo.includes(baseUrl) ? (data?.item?.student_profile?.personal_photo) : (`${baseUrl}${data?.item?.student_profile?.personal_photo}`))}
                className="w-100 rounded-circle bg-primary p-1"
              />
            </div>
            <div className="col-8 p-0 ps-1 m-0">
              <h4 className="text-capitalize">
                <strong>
                  {data?.item?.student_profile?.first_name}{" "}
                  {data?.item?.student_profile?.last_name}
                </strong>
              </h4>
              <div>
                {data?.item?.university_id} - Status
                <i className="text-primary"> {data?.item?.status}</i>
              </div>
              <div>
                Email:{" "}
                <span className="text-primary">
                  {data?.item?.student_profile?.email}
                </span>
              </div>
              <div>
                Phone:{" "}
                <span className="text-primary">
                  {data?.item?.student_profile?.phone}
                </span>
              </div>
              <div className="">
                Gender:{" "}
                <span className="text-primary text-capitalize">
                  {data?.item?.student_profile?.gender.toLowerCase()}
                </span>
                , Born{" "}
                <span className="text-primary">
                  {data?.item?.student_profile?.date_of_birth}
                </span>
              </div>
            </div>
          </div>
          <div className="ps-3 mt-3">
            <h5>Jobs:</h5>
            <ul>
              {data?.item?.job_list?.map((i) => {
                return (
                  <li>
                    {i?.company} - {i?.title} <br />
                    {i?.description}
                  </li>
                );
              })}
            </ul>
            <h5 className="my-3">Scholarships:</h5>
            <ul>
              {data?.item?.scholarship_list?.map((i) => {
                return (
                  <li>
                    {i?.country}: {i?.university} - {i?.degree} {i?.study_field}{" "}
                    <br />
                    {i?.description}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="light"
          className="w-100"
          onClick={() => {
            handleClose();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewStudentModal;
