/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.0
 */

import React from 'react';
import { MDBBtn as Btn } from 'mdb-react-ui-kit';

const Content = ({ activeTab }) => {
  return (
    <>
      {activeTab === 'section-1' && (
        <div className="tab-content" id="tab-content-1">
          <div className="tab-pane fade show active" id="section-1" role="tabpanel" aria-labelledby="section-1-tab">
            <p>Section 1 description.</p>
            <div className="section-container app-scroller">
              <div className="section-wrapper">
                <h3 className="section-title">Sub section 1</h3>
                <p className="section-description">Sub section 1 description.</p>
                <div className="button-wrapper">
                  <Btn>
                    <i className="icon-control-play"></i> Software 1
                  </Btn>
                  <Btn className="archived">
                    <i className="icon-folder"></i> Software 2
                  </Btn>
                  <Btn className="cli">
                    <i className="icon-frame"></i> Software 3
                  </Btn>
                </div>
              </div>
              <div className="section-wrapper">
                <h3 className="section-title">Sub section 2</h3>
                <p className="section-description">Sub section 2 description.</p>
                <div className="button-wrapper">
                    <Btn>
                      <i className="icon-control-play"></i> Software 4
                    </Btn>
                    <Btn className="archived">
                      <i className="icon-folder"></i> Software 5
                    </Btn>
                    <Btn className="cli">
                      <i className="icon-frame"></i> Software 6
                    </Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'section-2' && (
        <div className="tab-content" id="tab-content-2">
          <div className="tab-pane fade show active" id="section-2" role="tabpanel" aria-labelledby="section-2-tab">
            <p>Section 2 description.</p>
            <div className="section-container app-scroller">
              <div className="section-wrapper">
                <h3 className="section-title">Sub section 1</h3>
                <p className="section-description">Sub section 1 description.</p>
                <div className="button-wrapper">
                  <Btn>
                    <i className="icon-control-play"></i> Software 1
                  </Btn>
                  <Btn className="archived">
                    <i className="icon-folder"></i> Software 2
                  </Btn>
                  <Btn className="cli">
                    <i className="icon-frame"></i> Software 3
                  </Btn>
                </div>
              </div>
              <div className="section-wrapper">
                <h3 className="section-title">Sub section 2</h3>
                <p className="section-description">Sub section 2 description.</p>
                <div className="button-wrapper">
                  <Btn>
                    <i className="icon-control-play"></i> Software 4
                  </Btn>
                  <Btn className="archived">
                    <i className="icon-folder"></i> Software 5
                  </Btn>
                  <Btn className="cli">
                    <i className="icon-frame"></i> Software 6
                  </Btn>
                </div>
              </div>
              <div className="section-wrapper">
                <h3 className="section-title">Sub section 3</h3>
                <p className="section-description">Sub section 2 description.</p>
                <div className="button-wrapper">
                  <Btn>
                    <i className="icon-control-play"></i> Software 7
                  </Btn>
                  <Btn className="archived">
                    <i className="icon-folder"></i> Software 8
                  </Btn>
                  <Btn className="cli">
                    <i className="icon-frame"></i> Software 9
                  </Btn>
                </div>
              </div>
              <div className="section-wrapper">
                <h3 className="section-title">Sub section 4</h3>
                <p className="section-description">Sub section 2 description.</p>
                <div className="button-wrapper">
                  <Btn>
                    <i className="icon-control-play"></i> Software 10
                  </Btn>
                  <Btn className="archived">
                    <i className="icon-folder"></i> Software 11
                  </Btn>
                  <Btn className="cli">
                    <i className="icon-frame"></i> Software 12
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
};
  
export default Content;
