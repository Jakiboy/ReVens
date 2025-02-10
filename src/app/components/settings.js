/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.1
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
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
  MDBCol as Col,
  MDBInput as Input
} from 'mdb-react-ui-kit';
import config from '../../config/app.json';

const Settings = () => {

  const [isOpened, setModalStatus] = useState(false);
  const [setting1, setSetting1] = useState('');
  const [setting2, setSetting2] = useState('');

  const openModal = () => setModalStatus(true);
  const closeModal = () => setModalStatus(false);

  const handleSetting1Change = (event) => setSetting1(event.target.value);
  const handleSetting2Change = (event) => setSetting2(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Save settings here
    closeModal();
  };

  useEffect(() => {
    window.electron.on('open-settings', openModal);
    return () => {
      window.electron.off('open-settings', openModal);
    };
  }, []);

  return (
    <>
      <Modal open={isOpened} setOpen={setModalStatus} className="settings-modal" tabIndex="-1" staticBackdrop >
        <Dialog centered>
          <Content>
            <Body>
              <Container className="d-flex align-items-center justify-content-center text-center">
                <Row>
                  <Col>
                    <h1>Settings</h1>
                    <form onSubmit={handleSubmit}>
                      <Input label="Setting 1" id="setting1" type="text" value={setting1} onChange={handleSetting1Change} />
                      <Input label="Setting 2" id="setting2" type="text" value={setting2} onChange={handleSetting2Change} />
                      <Btn color="primary" type="submit">Save</Btn>
                    </form>
                  </Col>
                </Row>
              </Container>
            </Body>
            <Footer>
              <Btn color="secondary" onClick={closeModal}>Close</Btn>
            </Footer>
          </Content>
        </Dialog>
      </Modal>
    </>
  );
};

export default Settings;
