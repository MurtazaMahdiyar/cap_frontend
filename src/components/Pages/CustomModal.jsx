import { Modal, Button } from "react-bootstrap";

const CustomModal = ({ show, content, handleClose, handleConfirm }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size={content?.size}
      backdrop={content?.backdrop}
    >
      <Modal.Header closeButton>
        <Modal.Title>{content?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content?.body}</Modal.Body>
      <Modal.Footer>
        <Button variant={content?.variant?.cancel} onClick={handleClose}>
          {content?.cancel}
        </Button>
        <Button
          variant={content?.variant?.ok}
          onClick={() => handleConfirm(content.data)}
        >
          {content?.ok}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
