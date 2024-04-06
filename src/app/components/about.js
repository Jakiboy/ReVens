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
  MDBBtn as Btn
} from 'mdb-react-ui-kit';

const About = () => {

  const [isOpened, setModalStatus] = useState(false);
  const openModal  = () => setModalStatus(true);
  const closeModal = () => setModalStatus(false);

  useEffect(() => {
    window.electron.on('open-about', openModal);
    return () => {
      window.electron.off('open-about', showModal);
    };
  }, []);

  return (
    <>
      <Modal tabIndex="-1" staticBackdrop open={isOpened} setOpen={setModalStatus}>
        <Dialog centered>
          <Content>
            <Body>
              .....
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

export default About;
