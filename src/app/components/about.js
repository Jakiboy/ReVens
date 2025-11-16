/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.3.x
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
  MDBCol as Col
} from 'mdb-react-ui-kit';
import config from '../../config/app.json';

const About = () => {

  const [isOpened, setModalStatus] = useState(false);
  const openModal = () => setModalStatus(true);
  const closeModal = () => setModalStatus(false);

  useEffect(() => {
    window.electron.on('open-about', openModal);
    return () => {
      window.electron.off('open-about', showModal);
    };
  }, []);

  return (
    <>
      <Modal open={isOpened} setOpen={setModalStatus} className="about-modal" tabIndex="-1" staticBackdrop >
        <Dialog centered>
          <Content>
            <Body>
              <Container className="d-flex align-items-center justify-content-center text-center">
                <Row>
                  <Col>
                    <div className="image-wrapper">
                      <img src="./app/assets/img/icon-64.png" className="img-fluid" />
                    </div>
                    <h1>{config.name}</h1>
                    <p><strong>Version</strong> {config.version} (x64)</p>
                    <p className="mb-2">{config.about.desctiption}.</p>
                    <p>
                      <a href={config.url} className="page-link">
                        <i className="icon-social-github"></i> Source
                      </a>
                    </p>
                    <hr />
                    <p>
                      <strong>Copyright</strong> © {config.year} {config.author.name} <span className="space"></span>
                      (<a href={config.author.url} className="page-link">{config.author.nickname}</a>)
                    </p>
                  </Col>
                </Row>
              </Container>
            </Body>
            <Footer>
              <Btn color="primary" onClick={closeModal}>Close</Btn>
            </Footer>
          </Content>
        </Dialog>
      </Modal>
    </>
  );
};

export default About;
