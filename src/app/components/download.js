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
    const [downloadType, setDownloadType] = useState('packages'); // 'packages' or 'item'
    const [title, setTitle] = useState('Download');
    const [description, setDescription] = useState('');

    const openPackagesModal = () => {
        setDownloadType('packages');
        setTitle('Download Packages');
        setDescription('');
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

    const openItemModal = (data) => {
        setDownloadType('item');
        setTitle('Download Item');
        setDescription(data.name || '');
        setModalStatus(true);
        setProgress(0);
        setCurrentFile('');
        setStatus('Preparing download...');
        setIsDownloading(true);
    };

    const closeModal = () => {
        if (isDownloading) {
            if (downloadType === 'packages' && window.electron?.abortDownload) {
                window.electron.abortDownload();
            } else if (downloadType === 'item' && window.electron?.abortItemDownload) {
                window.electron.abortItemDownload();
            }
        }
        setModalStatus(false);
        setIsDownloading(false);
    };

    const handleClose = () => {
        setModalStatus(false);
        setIsDownloading(false);
    };

    useEffect(() => {
        const handlePackagesProgress = (data) => {
            setProgress(data.progress);
            setCurrentFile(data.currentFile);
            setStatus(data.status);
            if (data.completed) {
                setIsDownloading(false);
            }
        };

        const handleItemProgress = (data) => {
            setProgress(data.progress);
            setStatus(data.status);
            if (data.completed) {
                setIsDownloading(false);
            }
        };

        window.electron.on('open-download', openPackagesModal);
        window.electron.on('open-item-download', openItemModal);
        window.electron.onDownloadProgress(handlePackagesProgress);
        window.electron.onItemDownloadProgress(handleItemProgress);

        return () => {
            window.electron.off('open-download', openPackagesModal);
            window.electron.off('open-item-download', openItemModal);
        };
    }, []);

    return (
        <>
            <Modal open={isOpened} setOpen={setModalStatus} className="download-modal" tabIndex="-1" staticBackdrop>
                <Dialog centered>
                    <Content>
                        <Header>{title}</Header>
                        <Body>
                            <div className="mb-3">
                                {description && (
                                    <p className="mb-2">
                                        <strong>Item:</strong> {description}
                                    </p>
                                )}
                                <p className="mb-2">
                                    <strong>Status:</strong> {status}
                                </p>
                                {currentFile && downloadType === 'packages' && (
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
