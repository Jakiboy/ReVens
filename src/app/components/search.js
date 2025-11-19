/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useState, useEffect, useRef } from 'react';
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
import iConfig from './../../config/items.json';
import { generateSlug } from '../helper';

const Search = ({ setActiveTab }) => {

    const [isOpened, setModalStatus] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const searchInputRef = useRef(null);

    const openModal = () => setModalStatus(true);
    const closeModal = () => {
        setModalStatus(false);
        setSearchQuery('');
        setFilteredItems([]);
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredItems([]);
            return;
        }

        const filtered = iConfig.items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            (item.desc && item.desc.toLowerCase().includes(query.toLowerCase()))
        );

        setFilteredItems(filtered);
    };

    const handleItemClick = (item) => {
        // Navigate to the section tab
        const sectionSlug = generateSlug(item.section);
        setActiveTab(sectionSlug);

        // Open the item
        window.electron.click(item.path);

        closeModal();
    };

    useEffect(() => {
        window.electron.on('open-search', openModal);
        return () => {
            window.electron.off('open-search', openModal);
        };
    }, []);

    useEffect(() => {
        if (isOpened && searchInputRef.current) {
            // Focus the input when modal opens
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    }, [isOpened]);

    return (
        <>
            <Modal open={isOpened} setOpen={setModalStatus} className="search-modal" tabIndex="-1" staticBackdrop >
                <Dialog centered>
                    <Content>
                        <Body>
                            <Container className="text-center">
                                <Row>
                                    <Col>
                                        <h1 className="mb-4">Search packages</h1>
                                        <Input
                                            label="Type package name..."
                                            id="searchQuery"
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            ref={searchInputRef}
                                        />
                                        <div className="search-results app-scroller">
                                            {filteredItems.length > 0 ? (
                                                filteredItems.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="search-result-item"
                                                        onClick={() => handleItemClick(item)}
                                                    >
                                                        <strong>{item.name}</strong>
                                                        <br />
                                                        <small>{item.desc}</small>
                                                        <br />
                                                        <small className="text-muted">Section: {item.section} / {item.sub}</small>
                                                    </div>
                                                ))
                                            ) : searchQuery.trim() !== '' ? (
                                                <p className="mt-4 text-muted">No packages found</p>
                                            ) : null}
                                        </div>
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

export default Search;
