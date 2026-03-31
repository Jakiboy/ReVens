/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useState, useEffect } from 'react';
import {
  MDBModal as Modal,
  MDBModalDialog as Dialog,
  MDBModalContent as Content,
  MDBModalHeader as Header,
  MDBModalTitle as Title,
  MDBModalBody as Body,
  MDBModalFooter as Footer,
  MDBBtn as Btn,
  MDBSwitch as Switch,
  MDBRow as Row,
  MDBCol as Col,
} from 'mdb-react-ui-kit';
import config from '../../config/app.json';

const parts = config.items.parts;

const Settings = () => {

  const [isOpened, setModalStatus] = useState(false);
  const [packages, setPackages] = useState({});
  const [saved, setSaved] = useState(false);

  const openModal = () => {
    if (window.__activeModal) return;
    window.__activeModal = true;
    setModalStatus(true);
  };
  const closeModal = () => {
    window.__activeModal = false;
    setModalStatus(false);
  };

  const buildDefaultPackages = (saved) => {
    const defaults = {};
    parts.forEach(part => {
      const name = typeof part === 'string' ? part : part.name;
      defaults[name] = saved[name] !== undefined ? saved[name] : true;
    });
    return defaults;
  };

  useEffect(() => {
    if (isOpened && window.electron?.getSettings) {
      window.electron.getSettings().then(settings => {
        setPackages(buildDefaultPackages(settings.packages || {}));
      });
    }
  }, [isOpened]);

  useEffect(() => {
    window.electron.on('open-settings', openModal);
    return () => {
      window.electron.off('open-settings', openModal);
    };
  }, []);

  const handleToggle = (name) => {
    setPackages(prev => ({ ...prev, [name]: !prev[name] }));
    setSaved(false);
  };

  const handleSelectAll = () => {
    const all = {};
    parts.forEach(part => {
      const name = typeof part === 'string' ? part : part.name;
      all[name] = true;
    });
    setPackages(all);
    setSaved(false);
  };

  const handleDeselectAll = () => {
    const none = {};
    parts.forEach(part => {
      const name = typeof part === 'string' ? part : part.name;
      none[name] = false;
    });
    setPackages(none);
    setSaved(false);
  };

  const handleSave = async () => {
    if (window.electron?.saveSettings) {
      await window.electron.saveSettings({ packages });
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      closeModal();
    }, 800);
  };

  return (
    <>
      <Modal open={isOpened} setOpen={setModalStatus} className="settings-modal" tabIndex="-1" staticBackdrop>
        <Dialog centered scrollable>
          <Content>
            <Header>
              <Title>Settings</Title>
            </Header>
            <Body className="p-3">
              <h6 className="settings-subtitle">Packages</h6>
              <p className="text-muted small mb-2">Select the packages to include when downloading:</p>
              <div className="d-flex gap-2 mb-3">
                <Btn size="sm" color="primary" outline onClick={handleSelectAll}>Select All</Btn>
                <Btn size="sm" color="secondary" outline onClick={handleDeselectAll}>Deselect All</Btn>
              </div>
              <div className="settings-scroll-area">
                <Row>
                  {parts.map(part => {
                    const name = typeof part === 'string' ? part : part.name;
                    const label = name.replace('.zip', '');
                    return (
                      <Col key={name} size={6} className="mb-2">
                        <Switch
                          id={`pkg-${name}`}
                          label={label}
                          checked={packages[name] !== false}
                          onChange={() => handleToggle(name)}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </Body>
            <Footer>
              <Btn color="primary" onClick={handleSave} disabled={saved}>
                {saved ? 'Saved!' : 'Save'}
              </Btn>
              <Btn color="secondary" onClick={closeModal}>Close</Btn>
            </Footer>
          </Content>
        </Dialog>
      </Modal>
    </>
  );
};

export default Settings;
