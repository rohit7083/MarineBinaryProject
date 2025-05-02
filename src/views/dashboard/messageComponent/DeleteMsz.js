import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function ConfirmDialogExample() {
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const handleAccept = () => {
        // Your accept logic here
        toggle();
        console.log('Accepted');
    };

    const handleReject = () => {
        // Your reject logic here
        toggle();
        console.log('Rejected');
    };

    return (
        <div className="d-flex justify-content-center flex-wrap gap-2">
            <Button color="primary" onClick={toggle}>
                Confirm
            </Button>

            <Modal isOpen={modal} toggle={toggle} centered>
                <div className="text-center pt-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center" style={{ width: '6rem', height: '6rem', marginTop: '-3rem' }}>
                        <i className="bi bi-question-circle" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                </div>
                <ModalHeader toggle={toggle} className="text-center border-0 mt-2">
                    Are you sure?
                </ModalHeader>
                <ModalBody className="text-center">
                    Do you want to proceed with this action?
                </ModalBody>
                <ModalFooter className="justify-content-center border-0 pb-4">
                    <Button color="primary" onClick={handleAccept} className="w-25">
                        Save
                    </Button>{' '}
                    <Button outline color="secondary" onClick={handleReject} className="w-25">
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ConfirmDialogExample;
