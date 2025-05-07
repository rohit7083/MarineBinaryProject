import React from "react";
import LocationGuide from '../../../../src/views/pages/authentication/Images/locationguide.png';
function EnableLocation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isLoacationEnabled = localStorage.getItem("locationEnabled");
    if (isLoacationEnabled === true || isLoacationEnabled === "true") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, []);

  const onSubmit=(data)=>{
    
  }
  return (
    <div>
      <Fragment>
        <Modal
          isOpen={show}
          toggle={() => setShow(!show)}
          className="modal-dialog-centered"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setShow(!show)}
          ></ModalHeader>
          <ModalBody className="px-sm-5 mx-50 pb-5">
            <h1 className="text-center mb-1">Turn On Your Location</h1>
            <Row
              tag="form"
              className="gy-1 gx-2 mt-75"
              onSubmit={handleSubmit(onSubmit)}
            >
              <img src={LocationGuide} />

              <Button
                color="primary"
                onClick={() => {
                  setShow(!show);
                }}
              >
                OK
              </Button>
            </Row>
          </ModalBody>
        </Modal>
      </Fragment>
    </div>
  );
}

export default EnableLocation;
