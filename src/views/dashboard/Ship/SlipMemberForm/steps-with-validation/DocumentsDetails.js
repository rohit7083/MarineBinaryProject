import { Fragment, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { read, utils } from 'xlsx';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { DownloadCloud } from 'react-feather';
import ExtensionsHeader from '@components/extensions-header';
import { Row, Col, Card, CardBody, Button, Table, CardHeader, CardTitle, Input, Label } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// ** Styles
import '@styles/react/libs/file-uploader/file-uploader.scss';

// ** Validation Schema
const schema = yup.object().shape({
  contractFile: yup.mixed().required('Contract file is required').test('fileFormat', 'File must be .xlsx, .xls, or .csv', (value) => {
    return value && ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(value.type);
  }),
  identityDocumentFile: yup.mixed().required('Identity document file is required').test('fileFormat', 'File must be .xlsx, .xls, or .csv', (value) => {
    return value && ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(value.type);
  }),
  registrationFile: yup.mixed().required('Registration file is required').test('fileFormat', 'File must be .xlsx, .xls, or .csv', (value) => {
    return value && ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(value.type);
  }),
  insuranceFile: yup.mixed().required('Insurance file is required').test('fileFormat', 'File must be .xlsx, .xls, or .csv', (value) => {
    return value && ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(value.type);
  }),
});

const SocialLinks = ({stepper}) => {
  // ** States
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [name, setName] = useState('');

  // ** React Hook Form
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // ** File Upload Handler
  const getTableData = (arr, name) => {
    setTableData(arr);
    setName(name);
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: result => {
      const reader = new FileReader();
      reader.onload = function () {
        const fileData = reader.result;
        const wb = read(fileData, { type: 'binary' });

        wb.SheetNames.forEach(function (sheetName) {
          const rowObj = utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
          getTableData(rowObj, result[0].name);
        });
      };
      if (result.length && result[0].name.endsWith('xlsx')) {
        reader.readAsBinaryString(result[0]);
      } else {
        toast.error(
          () => (
            <p className='mb-0'>
              You can only upload <span className='fw-bolder'>.xlsx</span>, <span className='fw-bolder'>.xls</span> &{' '}
              <span className='fw-bolder'>.csv</span> Files!{' '}
            </p>
          ),
          {
            style: {
              minWidth: '380px',
            },
          }
        );
      }
    },
  });

  // ** Handle File Filtering
  const handleFilter = e => {
    const data = tableData;
    let filteredData = [];
    const value = e.target.value;
    setFilteredData(value.length ? data.filter((col) => col.some((key) => key.toString().toLowerCase().includes(value.toLowerCase()))) : data);
  };

  const headArr = tableData.length ? tableData.map((col, index) => (index === 0 ? [...Object.keys(col)] : null)) : [];
  const dataArr = filteredData.length ? filteredData : tableData;

  // ** Table Rendering
  const renderTableBody = () => {
    if (dataArr.length) {
      return dataArr.map((col, index) => {
        const keys = Object.keys(col);
        return (
          <tr key={index}>
            {keys.map((key, idx) => (
              <td key={idx}>{col[key]}</td>
            ))}
          </tr>
        );
      });
    }
    return null;
  };

  const renderTableHead = () => {
    if (headArr.length) {
      return headArr[0].map((head, index) => <th key={index}>{head}</th>);
    }
    return null;
  };

  // ** Submit Handler
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Fragment>
      <Row>
        <div className="content-header">
          <h5 className="mb-0 my-2">Documents </h5>
          <small>Upload Given Documents</small>
        </div>
      </Row>
      <Row className="import-component">
        <Col sm="12">
          <Card>
            <CardBody>
              <Row>
                <Col sm="6">
                  <h5 className="mb-2 my-2">
                    Contract File <span style={{ color: 'red' }}>*</span>
                  </h5>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <DownloadCloud size={64} />
                      <h5>Drop Files here or click to upload</h5>
                      <p className="text-secondary">
                        Drop files here or click{' '}
                        <a href="/" onClick={(e) => e.preventDefault()}>
                          browse
                        </a>{' '}
                        through your machine
                      </p>
                    </div>
                  </div>
                  {errors.contractFile && <span>{errors.contractFile.message}</span>}
                </Col>
                <Col sm="6">
                  <h5 className="mb-2 my-2">
                    identity Document File File <span style={{ color: 'red' }}>*</span>
                  </h5>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()}  />
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <DownloadCloud size={64} />
                      <h5>Drop Files here or click to upload</h5>
                      <p className="text-secondary">
                        Drop files here or click{' '}
                        <a href="/" onClick={(e) => e.preventDefault()}>
                          browse
                        </a>{' '}
                        through your machine
                      </p>
                    </div>
                  </div>
                  {errors.contractFile && <span>{errors.contractFile.message}</span>}
                </Col>
                <Col sm="6">
                  <h5 className="mb-2 my-2">
                    Registration File <span style={{ color: 'red' }}>*</span>
                  </h5>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <DownloadCloud size={64} />
                      <h5>Drop Files here or click to upload</h5>
                      <p className="text-secondary">
                        Drop files here or click{' '}
                        <a href="/" onClick={(e) => e.preventDefault()}>
                          browse
                        </a>{' '}
                        through your machine
                      </p>
                    </div>
                  </div>
                  {errors.contractFile && <span>{errors.contractFile.message}</span>}
                </Col>
                <Col sm="6">
                  <h5 className="mb-2 my-2">
                    Insurance File <span style={{ color: 'red' }}>*</span>
                  </h5>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <DownloadCloud size={64} />
                      <h5>Drop Files here or click to upload</h5>
                      <p className="text-secondary">
                        Drop files here or click{' '}
                        <a href="/" onClick={(e) => e.preventDefault()}>
                          browse
                        </a>{' '}
                        through your machine
                      </p>
                    </div>
                  </div>
                  {errors.contractFile && <span>{errors.contractFile.message}</span>}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        {tableData.length ? (
          <Col sm="12">
            <Card>
              <CardHeader className="justify-content-between flex-wrap">
                <CardTitle tag="h4">{name}</CardTitle>
                <div className="d-flex align-items-center justify-content-end">
                  <Label for="search-input" className="me-1">
                    Search
                  </Label>
                  <Input
                    id="search-input"
                    type="text"
                    bsSize="sm"
                    value={value}
                    onChange={(e) => handleFilter(e)}
                  />
                </div>
              </CardHeader>
              <Table className="table-hover-animation" responsive>
                <thead>
                  <tr>{renderTableHead()}</tr>
                </thead>
                <tbody>{renderTableBody()}</tbody>
              </Table>
            </Card>
          </Col>
        ) : null}
      </Row>

      <div className="d-flex justify-content-between">
        <Button
          type="button"
          color="primary"
          className="btn-prev"
          onClick={() => stepper.previous()}
        >
          <ArrowLeft
            size={14}
            className="align-middle me-sm-25 me-0"
          ></ArrowLeft>
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span>
        </Button>
        <Button type="submit" color="primary" className="btn-next">
          <span className="align-middle d-sm-inline-block d-none">submit</span>
          <ArrowRight
            size={14}
            className="align-middle ms-sm-25 ms-0"
          ></ArrowRight>
        </Button>
      </div>
    </Fragment>
  );
};

export default SocialLinks;
