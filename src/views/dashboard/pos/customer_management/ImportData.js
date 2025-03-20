// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Label,
  Input,
  Modal,
  Button,
  CardBody,
  CardText,
  CardTitle,
  ModalBody,
  ModalHeader,
  FormFeedback,
} from "reactstrap";

// ** Third Party Components
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Home, Check, X, Briefcase } from "react-feather";
import csvFileIcon from "../../../../assets/icons/csvFileIcon.png";
// ** Utils
import { selectThemeColors } from "@utils";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";

const defaultValues = {
  lastName: "",
  firstName: "",
};

const countryOptions = [
  { value: "uk", label: "UK" },
  { value: "usa", label: "USA" },
  { value: "france", label: "France" },
  { value: "russia", label: "Russia" },
  { value: "canada", label: "Canada" },
];

const AddNewAddress = ({ show, setShow }) => {
  // ** States
  //   const [show, setShow] = useState(false)

  // ** Hooks
  const {
    reset,
    control,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      setShow(false);
      reset();
    } else {
      setError("firstName", {
        type: "manual",
      });
      setError("lastName", {
        type: "manual",
      });
    }
  };

  const onDiscard = () => {
    clearErrors();
    setShow(false);
    reset();
  };

  return (
    <Fragment>
      <Modal
        isOpen={show}
        onClosed={onDiscard}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="pb-5 px-sm-4 mx-50">
          <h1 className="address-title text-center mb-1">
            Import Customer Data
          </h1>
          <p className="address-subtitle text-center mb-2 pb-75">
            Add address for billing address
          </p>

          <Row
            tag="form"
            className="gy-1 gx-2 d-flex justify-content-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Col xs={12} md={4} className="text-center">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-csv-file-file-extension-fauzidea-flat-fauzidea.png"
                alt="external-csv-file-file-extension-fauzidea-flat-fauzidea"
              />{" "}
              <br />
              <Label>CSV File</Label>
            </Col>

            <Col xs={12} md={4} className="text-center">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/fluency/48/microsoft-excel-2019.png"
                alt="microsoft-excel-2019"
              />
              <br />
              <Label>XLS File</Label>
            </Col>

            <Col xs={12} md={4} className="text-center">
              <img
                width="64"
                height="64"
                src="https://img.icons8.com/external-fauzidea-flat-fauzidea/64/external-xlsx-file-file-extension-fauzidea-flat-fauzidea.png"
                alt="external-xlsx-file-file-extension-fauzidea-flat-fauzidea"
              />{" "}
              <br />
              <Label>XLSX File</Label>
            </Col>

            <Col className="text-center" xs={12}>
              <Button type="submit" className="me-1 mt-2" color="primary">
                Upload
              </Button>
              <Button
                type="reset"
                className="mt-2"
                color="secondary"
                outline
                onClick={onDiscard}
              >
                Discard
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default AddNewAddress;
