// ** React Imports
import { Fragment } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
// ** Reactstrap Imports
import { Card, CardBody, Button, Input } from "reactstrap";

const AddActions = () => {
  const paymentOptions = [
    { value: "debit-card", label: "Debit Card" },
    { value: "credit-card", label: "Credit Card" },
    { value: "paypal", label: "Paypal" },
    { value: "internet-banking", label: "Internet Banking" },
    { value: "upi-transfer", label: "UPI Transfer" },
    { value: "QR code", label: "Qr code" },
  ];

  return (
    <Fragment>
      <Card className="invoice-action-wrapper">
        <CardBody>
          <Button color="primary" block className="mb-75" disabled>
            Send Invoice
          </Button>
          <Button
            tag={Link}
            to="/dashboard/invoice_management/invoice/preview"
            color="primary"
            block
            outline
            className="mb-75"
          >
            Preview
          </Button>
          <Button color="primary" block outline>
            Save
          </Button>
        </CardBody>
      </Card>
      <div className="mt-2">
        <div className="invoice-payment-option">
          <p className="mb-50">Accept payments via</p>
          <Select
            options={paymentOptions}
            id="payment-select"
            placeholder="Select Payment Method"
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        <div className="invoice-terms mt-1">
          <div className="d-flex justify-content-between">
            <label className="cursor-pointer mb-0" htmlFor="payment-terms">
              Payment Terms
            </label>
            <div className="form-switch">
              <Input type="switch" id="payment-terms" defaultChecked />
            </div>
          </div>
          <div className="d-flex justify-content-between py-1">
            <label className="cursor-pointer mb-0" htmlFor="client-notes">
              Client Notes
            </label>
            <div className="form-switch">
              <Input type="switch" id="client-notes" defaultChecked />
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <label className="cursor-pointer mb-0" htmlFor="payment-stub">
              Payment Stub
            </label>
            <div className="form-switch">
              <Input type="switch" id="payment-stub" />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AddActions;
