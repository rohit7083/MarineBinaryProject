// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";
import Repeater from "@components/repeater";

// ** Third Party Components
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { SlideDown } from "react-slidedown";
import { X, Plus, Hash } from "react-feather";
import Select, { components } from "react-select";
import { Check } from "react-feather";

// ** Reactstrap Imports
import { selectThemeColors } from "@utils";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Label,
  Button,
  CardBody,
  CardText,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import PaymentSection from "./PaymentSection";
// ** Styles
import "react-slidedown/lib/slidedown.css";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
const CustomLabel = ({ htmlFor }) => {
  return (
    <Label className="form-check-label" htmlFor={htmlFor}>
      <span className="switch-icon-left">
        <Check size={14} />
      </span>
      <span className="switch-icon-right">
        <X size={14} />
      </span>
    </Label>
  );
};
const AddCard = () => {
  // ** States
  const [count, setCount] = useState(1);
  const [value, setValue] = useState({});
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState(null);
  const [selected, setSelected] = useState(null);
  const [picker, setPicker] = useState(new Date());
  const [invoiceNumber, setInvoiceNumber] = useState(false);
  const [dueDatepicker, setDueDatePicker] = useState(new Date());
  const [chargesShow, setChargesShow] = useState(false);
  const [DiscountShow, setDiscountShow] = useState(false);

  const [options, setOptions] = useState([
    {
      value: "add-new",
      label: "Add New Customer",
      type: "button",
      color: "flat-success",
    },
  ]);

  useEffect(() => {
    // ** Get Clients
    axios.get("/api/invoice/clients").then((response) => {
      const arr = options;
      response.data.map((item) =>
        arr.push({ value: item.name, label: item.name })
      );
      setOptions([...arr]);
      setClients(response.data);
    });

    // ** Get Invoices & Set Invoice Number
    axios
      .get("/apps/invoice/invoices", {
        q: "",
        page: 1,
        status: "",
        sort: "asc",
        perPage: 10,
        sortColumn: "id",
      })
      .then((response) => {
        const lastInvoiceNumber = Math.max.apply(
          Math,
          response.data.allData.map((i) => i.id)
        );
        setInvoiceNumber(lastInvoiceNumber + 1);
      });
  }, []);

  // ** Deletes form
  const deleteForm = (e) => {
    e.preventDefault();
    e.target.closest(".repeater-wrapper").remove();
  };

  // ** Function to toggle sidebar
  const toggleSidebar = () => setOpen(!open);

  // ** Vars
  const countryOptions = [
    { value: "australia", label: "Australia" },
    { value: "canada", label: "Canada" },
    { value: "russia", label: "Russia" },
    { value: "saudi-arabia", label: "Saudi Arabia" },
    { value: "singapore", label: "Singapore" },
    { value: "sweden", label: "Sweden" },
    { value: "switzerland", label: "Switzerland" },
    { value: "united-kingdom", label: "United Kingdom" },
    { value: "united-arab-emirates", label: "United Arab Emirates" },
    { value: "united-states-of-america", label: "United States of America" },
  ];

  // ** Custom Options Component
  const OptionComponent = ({ data, ...props }) => {
    if (data.type === "button") {
      return (
        <Button
          className="text-start rounded-0 px-50"
          color={data.color}
          block
          onClick={() => setOpen(true)}
        >
          <Plus className="font-medium-1 me-50" />
          <span className="align-middle">{data.label}</span>
        </Button>
      );
    } else {
      return <components.Option {...props}> {data.label} </components.Option>;
    }
  };

  // ** Invoice To OnChange
  const handleInvoiceToChange = (data) => {
    setValue(data);
    setSelected(clients.filter((i) => i.name === data.value)[0]);
  };

  const handleCharges = () => {
    setChargesShow(true);
  };
  const handleclosed = () => {
    setChargesShow(false);
  };
  const handleDiscounts = () => {
    setDiscountShow(true);
  };
  const note =
    "It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!";

  return (
    <Fragment>
      <Card className="invoice-preview-card">
        {/* Header */}

        <div className="d-flex justify-content-end mt-1" style={{ maxWidth: '20%' }}>
          <img className="" src="https://www.longcoveresort.com/assets/img/navbar-logo.png" width="60px" height="60px " alt="error"/>
        </div>

        <CardBody className="invoice-padding pb-0">
          
          <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
            <div> 
         
              <div className="logo-wrapper">
              {/* <img className="" src="https://www.longcoveresort.com/assets/img/navbar-logo.png" width="20px" height="20px " alt="error"/> */}

                
                <h3 className="text-primary invoice-logo">Longcove Marine</h3>
              </div>
              <p className="card-text mb-25">
                Office 149, 450 South Brand Brooklyn
              </p>
              <p className="card-text mb-25">San Diego County, CA 91905, USA</p>
              <p className="card-text mb-0">
                +1 (123) 456 7891, +44 (876) 543 2198
              </p>
            </div>

            <div className=" invoice-number-date mt-md-0 mt-2">
              <div className="d-flex align-items-center justify-content-md-end mb-1">
                <h4 className="invoice-title">Invoice</h4>
                <InputGroup className="input-group-merge invoice-edit-input-group disabled">
                  <InputGroupText>
                    <Hash size={15} />
                  </InputGroupText>
                  <Input
                    type="number"
                    className="invoice-edit-input"
                    value={invoiceNumber || 3171}
                    placeholder="53634"
                    disabled
                  />
                </InputGroup>
              </div>

              <div className="d-flex align-items-center mb-1">
                <span className="title">Invoice Date:</span>
                <Flatpickr
                  value={picker}
                  onChange={(date) => setPicker(date)}
                  className="form-control invoice-edit-input date-picker"
                />
              </div>
              <div className="d-flex align-items-center">
                <span className="title">Due Date:</span>
                <Flatpickr
                  value={dueDatepicker}
                  onChange={(date) => setDueDatePicker(date)}
                  className="form-control invoice-edit-input due-date-picker"
                />
              </div>
            </div>

            <div className=" invoice-number-date mt-md-0 mt-2">
              <div className="d-flex align-items-center mb-1">
                <span className="title">PO Bill No</span>
                <Input
                    type="number"
                    className="invoice-edit-input"
                    
                    placeholder="53634"
                  />
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="title">Payment Term</span>
                <Input
                    type="number"
                    className="invoice-edit-input"
                    
                    placeholder="30"
                  />
              </div>
              <div className="d-flex align-items-center">
                <span className="title">Vehical No</span>
                <Input
                    type="number"
                    className="invoice-edit-input"
                    
                    placeholder="53634"
                  />
              </div>
            </div>
          </div>
        </CardBody>
        {/* /Header */}

        <hr className="invoice-spacing" />

        {/* Address and Contact */}
        <CardBody className="invoice-padding pt-0">
          <Row className="row-bill-to invoice-spacing">
            <Col className="col-bill-to ps-0" xl="8">
              <h6 className="invoice-to-title">Invoice To:</h6>
              <div className="invoice-customer">
                {clients !== null ? (
                  <Fragment>
                    <Select
                      className="react-select"
                      classNamePrefix="select"
                      id="label"
                      value={value}
                      options={options}
                      theme={selectThemeColors}
                      components={{
                        Option: OptionComponent,
                      }}
                      onChange={handleInvoiceToChange}
                    />
                    {selected !== null ? (
                      <div className="customer-details mt-1">
                        <p className="mb-25">{selected.name}</p>
                        <p className="mb-25">{selected.company}</p>
                        <p className="mb-25">{selected.address}</p>
                        <p className="mb-25">{selected.country}</p>
                        <p className="mb-0">{selected.contact}</p>
                        <p className="mb-0">{selected.companyEmail}</p>
                      </div>
                    ) : null}
                  </Fragment>
                ) : null}
              </div>
            </Col>
            <Col className="pe-0 mt-xl-0 mt-2" xl="4">
              <h6 className="mb-2">Payment Details:</h6>
              <table>
                <tbody>
                  <tr>
                    <td className="pe-1">Total Due:</td>
                    <td>
                      <span className="fw-bolder">$12,110.55</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="pe-1">Bank name:</td>
                    <td>American Bank</td>
                  </tr>
                  <tr>
                    <td className="pe-1">Country:</td>
                    <td>United States</td>
                  </tr>
                  <tr>
                    <td className="pe-1">IBAN:</td>
                    <td>ETD95476213874685</td>
                  </tr>
                  <tr>
                    <td className="pe-1">SWIFT code:</td>
                    <td>BR91905</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </CardBody>
        {/* /Address and Contact */}

        {/* Product Details */}
        <CardBody className="invoice-padding invoice-product-details">
          <Repeater count={count}>
            {(i) => {
              const Tag = i === 0 ? "div" : SlideDown;
              return (
                <Tag key={i} className="repeater-wrapper">
                  <Row>
                    <Col
                      className="d-flex product-details-border position-relative pe-0"
                      sm="12"
                    >
                      <Row className="w-100 pe-lg-0 pe-1 py-2">
                        <Col
                          className="mb-lg-0 mb-2 mt-lg-0 mt-2"
                          lg="5"
                          sm="12"
                        >
                          <CardText className="col-title mb-md-50 mb-0">
                            Product
                          </CardText>
                          <Input type="select" className="item-details">
                            <option>App Design</option>
                            <option>App Customization</option>
                            <option>ABC Template</option>
                            <option>App Development</option>
                          </Input>
                          <Input
                            className="mt-2"
                            type="textarea"
                            rows="1"
                            defaultValue="Customization & Bug Fixes"
                          />
                        </Col>
                        <Col className="my-lg-0 my-2" lg="3" sm="12">
                          <CardText className="col-title mb-md-2 mb-0">
                            Cost
                          </CardText>
                          <Input
                            type="number"
                            defaultValue="24"
                            placeholder="24"
                          />
                          <div className="mt-2">
                            <span>Discount:</span> <span>0%</span>
                          </div>
                        </Col>
                        <Col className="my-lg-0 my-2" lg="2" sm="12">
                          <CardText className="col-title mb-md-2 mb-0">
                            Qty
                          </CardText>
                          <Input
                            type="number"
                            defaultValue="1"
                            placeholder="1"
                          />
                        </Col>
                        <Col className="my-lg-0 mt-2" lg="2" sm="12">
                          <CardText className="col-title mb-md-50 mb-0">
                            Price
                          </CardText>
                          <CardText className="mb-0">$24.00</CardText>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-center border-start invoice-product-actions py-50 px-25">
                        <X
                          size={18}
                          className="cursor-pointer"
                          onClick={deleteForm}
                        />
                      </div>
                    </Col>
                  </Row>
                </Tag>
              );
            }}
          </Repeater>
          <Row className="mt-1">
            <Col sm="12" className="px-0">
              <Button
                color="primary"
                size="sm"
                className="btn-add-new"
                onClick={() => setCount(count + 1)}
              >
                <Plus size={14} className="me-25"></Plus>{" "}
                <span className="align-middle">Add Item</span>
              </Button>
            </Col>
          </Row>
        </CardBody>


        {/* Invoice Total */}
        <CardBody className="invoice-padding">
          <Row className="invoice-sales-total-wrapper">
            <Col
              className="mt-md-0 mt-3"
              md={{ size: "6", order: 1 }}
              xs={{ size: 12, order: 2 }}
            >
                <div className="d-flex align-items-center mb-1">
                {!chargesShow ? (
               
                  <Button.Ripple color='flat-secondary' onClick={handleCharges}>
                      <Plus size={14} className="me-25"></Plus>Add Charges</Button.Ripple>

                ) : (
                 
                  <X onClick={handleclosed} />
                )}
                {chargesShow && (
                  <Input
                    style={{
                      width: "15rem",
                    }}
                    type="text"
                    className="ms-50"
                    id="salesperson"
                    placeholder="Enter Charges"
                  />
                )}
              </div>

              <div className="d-flex align-items-center mb-1">
              {!DiscountShow ? (    
              <Button.Ripple color='flat-secondary' onClick={handleDiscounts}>
                      <Plus size={14} className="me-25"></Plus>Add Discount</Button.Ripple>
              ):(                 
                 <X onClick={()=>setDiscountShow(false)} />
              )}
                              {DiscountShow && (    

                  <Input
                    style={{
                      width: "15rem",
                    }}
                    type="text"
                    className="ms-50"
                    id="salesperson"
                    placeholder="Enter Amount"
                  />
                )}
              </div>
            </Col>

            <Col
              className="d-flex justify-content-end"
              md={{ size: "6", order: 2 }}
              xs={{ size: 12, order: 1 }}
            >
              <div className="invoice-total-wrapper">
                <div className="invoice-total-item">
                  <p className="invoice-total-title">Subtotal:</p>
                  <p className="invoice-total-amount">$1800</p>
                </div>
                <div className="invoice-total-item">
                  <p className="invoice-total-title">Discount:</p>
                  <p className="invoice-total-amount">$28</p>
                </div>
                <div className="invoice-total-item">
                  <p className="invoice-total-title">Tax:</p>
                  <p className="invoice-total-amount">21%</p>
                </div>
                <hr className="my-50" />
                <div className="invoice-total-item">
                  <p className="invoice-total-title">Total:</p>
                  <p className="invoice-total-amount">$1690</p>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
        {/* /Invoice Total */}

        <hr className="invoice-spacing mt-0" />

        {/* Add bank Detailse */}
        <CardBody className="invoice-padding py-0">
          {/* <Row>
            <Col md={8}> */}
          {/* <div className='d-flex flex-Row mb-2'>
            <label className='cursor-pointer mb-0' htmlFor='payment-terms'>
             Partial Payment 
            </label>
            <div className='form-switch form-check-dark ms-1'>
            <Input type='switch' defaultChecked id='icon-dark' name='icon-dark' />
            <CustomLabel htmlFor='icon-dark' />            </div>
          </div> */}

          <PaymentSection />

          {/* </Col>
           
          </Row> */}
        </CardBody>

        <hr className="invoice-spacing mt-0" />

        {/* Invoice Note */}
        <CardBody className="invoice-padding py-0">
          <Row>
            <Col md={8}>
              <div className="mb-2">
                <Label for="note" className="form-label fw-bold">
                  Note:
                </Label>
                <Input
                defaultValue="20 days return policy."
                  type="textarea"
                  rows="2"
                  id="note"
                  //  defaultValue={note}
                />
              </div>
              <div className="mb-2">
                <Label for="terms" className="form-label fw-bold">
                  Terms and Conditions:
                </Label>
                <Input
                defaultValue="10 days return policy. Damaged items won't be taken back Bill is compulsory for returning items"
                  type="textarea"
                  rows="2"
                  id="terms"
                  // defaultValue={terms}
                />
              </div>
            </Col>
            <Col
              md={4}
              className="d-flex flex-column justify-content-end align-items-center"
            >
              <div className="mt-auto text-center">
                <Label className="form-label fw-bold">
                  Authorized signatory for Sender
                </Label>
                {/* <div className="signature-box border border-dark " > */}
                {/* Signature area */}
                {/* </div> */}
              </div>
            </Col>
          </Row>
        </CardBody>

        {/* /Invoice Note */}
      </Card>

      <Sidebar
        size="lg"
        open={open}
        title="Create New Party
"
        headerClassName="mb-1"
        contentClassName="p-0"
        toggleSidebar={toggleSidebar}
      >
        <Form>
          <div className="mb-2">
            <Label for="customer-name" className="form-label">
            PARTY NAME            </Label>
            <Input id="customer-name" placeholder="John Doe" />
          </div>
          <div className="mb-2">
            <Label for="customer-email" className="form-label">
            Email             </Label>
            <Input
              type="email"
              id="customer-email"
              placeholder="example@domain.com"
            />
          </div>
         
          <div className="mb-2">
            <Label for="country" className="form-label">
            Mobile Number
            </Label>
            <Input
              type="textarea"
              cols="2"
              rows="2"
              id="customer-address"
              placeholder="1307 8859 9658"
            />
          </div>
          <div className="mb-2">
            <Label for="customer-address" className="form-label">
           Billing Address           </Label>
            <Input
              type="textarea"
              cols="2"
              rows="2"
              id="customer-address"
              placeholder="1307 Lady Bug Drive New York"
            />
          </div>



          <div className="mb-2">
            <Label for="customer-address" className="form-label">
            Shiping Addres  (Optional)          </Label>
            <Input
              type="textarea"
              cols="2"
              rows="2"
              id="customer-address"
              placeholder="1307 Lady Bug Drive New York"
            />
          </div>
       

          <div className="mb-2">
            <Label for="country" className="form-label">
            place Of Supply (Country) (Optional) 
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={countryOptions}
              isClearable={false}
            />
          </div>

          <div className="d-flex flex-wrap my-2">
            <Button
              className="me-1"
              color="primary"
              onClick={() => setOpen(false)}
            >
              Add
            </Button>
            <Button color="secondary" onClick={() => setOpen(false)} outline>
              Cancel
            </Button>
          </div>
        </Form>
      </Sidebar>
    </Fragment>
  );
};

export default AddCard;
