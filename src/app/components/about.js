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

  const [openedModal, setOpenedModal] = useState(false);

  useEffect(() => {

    const openAbout = () => {
      setOpenedModal(true);
    };

    window.electron.on('open-about', openAbout);

    return () => {
      window.electron.off('open-about', openAbout);
    };

  }, []);

  const handleClose = () => {
    setOpenedModal(false);
  };

  return (
    <>
      <Modal open={openedModal} onClose={handleClose} tabIndex='-1'>
        <Dialog centered>
          <Content>
            <Body>
              .....
            </Body>
            <Footer>
              <Btn color='primary' onClick={handleClose}>
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
