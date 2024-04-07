/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MDBModal as Modal,
  MDBModalDialog as Dialog,
  MDBModalContent as Content,
  MDBModalBody as Body,
  MDBModalFooter as Footer,
  MDBBtn as Btn,
  MDBContainer as Container,
  MDBRow as Row,
  MDBCol as Col
} from 'mdb-react-ui-kit';
// import config from '../../config/app.json';

const Doc = () => {

  const [isOpened, setModalStatus] = useState(false);
  const openModal  = () => setModalStatus(true);
  const closeModal = () => setModalStatus(false);

  useEffect(() => {
    window.electron.on('open-doc', openModal);
    return () => {
      window.electron.off('open-doc', showModal);
    };
  }, []);

  return (
    <>
      <Modal open={isOpened} setOpen={setModalStatus} className="doc-modal" tabIndex="-1" staticBackdrop >
        <Dialog centered>
          <Content>
            <Body>
            <Container className="d-flex align-items-center justify-content-center text-center">
            <Row>
              <Col>
                <h1>XXX</h1>
                <p><strong>Version</strong> XXXX (x64)</p>
                <p className="mb-2">XXXXXXXX.</p>
                <hr/>
                <p>
                  XXXX
                </p>
              </Col>
            </Row>
          </Container>
            </Body>
            <Footer>
              <Btn color="primary" onClick={closeModal}>
                Close
              </Btn>
            </Footer>
          </Content>
        </Dialog>
      </Modal>
    </>
  );
};

export default Doc;
