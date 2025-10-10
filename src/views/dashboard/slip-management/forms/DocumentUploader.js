
// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import { Button, Card, CardBody, CardTitle, ListGroup, ListGroupItem } from 'reactstrap'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { DownloadCloud, FileText, X } from 'react-feather'

// ** Styles
import '@styles/react/libs/file-uploader/file-uploader.scss'

const DocumentUploader = ({label,name,handleChangeDocument,uploadedFiles}) => {
  // ** State
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: acceptedFiles => {
        handleChangeDocument(name,[...acceptedFiles.map(file => Object.assign(file))])
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
    } else {
      return <FileText size='28' />
    }
  }

  const handleRemoveFile = () => {
    handleChangeDocument(name,[])
  }

  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const fileList = uploadedFiles.map((file, index) => (
    <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
        <X size={14} />
      </Button>
    </ListGroupItem>
  ))

  const handleRemoveAllFiles = () => {
    handleChangeDocument(name,[])
  }

  return (
   <>
     <CardTitle tag='h4'>{label}</CardTitle>
    <Card>
    
      <CardBody className={'d-flex'}>
        <div {...getRootProps({ className: 'dropzone' })} style={{
            minHeight:'150px'
        }}>
          <input {...getInputProps()} />
          <div className='d-flex align-items-center justify-content-center flex-column'>
            <DownloadCloud size={34} />
            <h5>Drop Files here or click to upload</h5>
            <small className='text-secondary'>
              Drop files here or click{' '}
              <a href='/' onClick={e => e.preventDefault()}>
                browse
              </a>{' '}
              thorough your machine
            </small>
          </div>
        </div>
        <div>

        
        {uploadedFiles.length ? (
          <Fragment>
            <ListGroup className='my-2'>{fileList}</ListGroup>
            <div className='d-flex justify-content-end'>
              <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                Remove All
              </Button>
              <Button color='primary'>Upload Files</Button>
            </div>
          </Fragment>
        ) : null}
        </div>
      </CardBody>
    </Card></>
  )
}

export default DocumentUploader
