/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useState, useEffect } from 'react';
import {
    MDBModal as Modal,
    MDBModalDialog as Dialog,
    MDBModalContent as Content,
    MDBModalHeader as Header,
    MDBModalBody as Body,
    MDBModalFooter as Footer,
    MDBBtn as Btn,
    MDBProgress as Progress,
    MDBProgressBar as ProgressBar
} from 'mdb-react-ui-kit';
import appConfig from '../../config/app.json';

const Download = () => {
    const [isOpened, setModalStatus] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState('');
    const [status, setStatus] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    const openModal = () => {
        setModalStatus(true);
        setProgress(0);
        setCurrentFile('');
        setStatus('Preparing download...');
        setIsDownloading(true);
        // Start download automatically when modal is opened from event
        if (window.electron?.downloadPackages) {
            window.electron.downloadPackages();
        }
    };

    const closeModal = () => {
        if (isDownloading && window.electron?.abortDownload) {
            window.electron.abortDownload();
        }
        setModalStatus(false);
        setIsDownloading(false);
    };

    const handleClose = () => {
        setModalStatus(false);
        setIsDownloading(false);
    };

    useEffect(() => {
        const handleDownloadProgress = (data) => {
            setProgress(data.progress);
            setCurrentFile(data.currentFile);
            setStatus(data.status);
            if (data.completed) {
                setIsDownloading(false);
            }
        };

        window.electron.on('open-download', openModal);
        window.electron.onDownloadProgress(handleDownloadProgress);

        return () => {
            window.electron.off('open-download', openModal);
        };
    }, []);

    return (
        <>
            <Modal open={isOpened} setOpen={setModalStatus} className="download-modal" tabIndex="-1" staticBackdrop>
                <Dialog centered>
                    <Content>
                        <Header>Download Packages</Header>
                        <Body>
                            <div className="mb-3">
                                <p className="mb-2">
                                    <strong>Status:</strong> {status}
                                    {!isDownloading && status.toLowerCase().includes('completed') &&
                                        ` Restart ${appConfig.productName || appConfig.name}`
                                    }
                                </p>
                                {currentFile && (
                                    <p className="mb-2"><strong>Current file:</strong> {currentFile}</p>
                                )}
                            </div>
                            <Progress>
                                <ProgressBar
                                    width={progress}
                                    valuemin={0}
                                    valuemax={100}
                                >
                                </ProgressBar>
                            </Progress>
                        </Body>
                        <Footer>
                            <Btn
                                color='danger'
                                onClick={closeModal}
                                disabled={!isDownloading}
                            >
                                Abort
                            </Btn>
                            {!isDownloading && (
                                <Btn color='secondary' onClick={handleClose}>
                                    Close
                                </Btn>
                            )}
                        </Footer>
                    </Content>
                </Dialog>
            </Modal>
        </>
    );
};

export default Download;
