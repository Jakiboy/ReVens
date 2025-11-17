/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useMemo } from 'react';
import { MDBBtn as Btn } from 'mdb-react-ui-kit';
import { generateSlug } from '../helper';

const Section = ({ section, items, disabledPaths = [] }) => {

  const _section = generateSlug(section.name);
  const _subs = section.sub;

  // Convert array to Set for O(1) lookup performance
  const disabledSet = useMemo(() => new Set(disabledPaths), [disabledPaths]);
  const isDisabled = (path) => disabledSet.has(path);

  return (
    <div className="tab-content" id={`tab-content-${_section}`}>
      <div className="tab-pane fade show active" id={_section} role="tabpanel" aria-labelledby={`${_section}-tab`}>
        <p dangerouslySetInnerHTML={{ __html: section.desc }}></p>
        <div className="section-container app-scroller">
          {_subs.map((sub, index) => {
            const _sub = generateSlug(sub.title);
            return (
              <div className="section-wrapper" key={index}>
                <h3 className="section-title">{sub.title}</h3>
                <p className="section-description" dangerouslySetInnerHTML={{ __html: sub.desc }}></p>
                <div className="button-wrapper">
                  {items.map((item, index) => {
                    const _isection = generateSlug(item.section);
                    const _isub = generateSlug(item.sub);
                    let name = item.name.length > 23 ? item.name.substring(0, 23) : item.name;
                    let icon;
                    switch (item.type) {
                      case 'zip':
                      case 'folder':
                        icon = 'folder';
                        break;
                      case 'doc':
                        icon = 'notebook';
                      case 'sound':
                        icon = 'music-tone';
                        break;
                      case 'cli':
                        icon = 'control-play';
                        name = `${name} (CLI)`;
                        break;
                      default:
                        icon = 'control-play';
                    }
                    if ((_isection === _section) && (_isub === _sub) && !item.extra) {
                      return (
                        <Btn
                          className={`type-${item.type}`}
                          key={index}
                          onClick={() => window.electron.click(item.path)}
                          title={item.desc || ''}
                          disabled={isDisabled(item.path)}
                          data-path={item.path}
                        >
                          <i className={`icon-${icon}`}></i> {name}
                        </Btn>
                      );
                    }
                  })}
                </div>
                {sub.extra && sub.extra.map((extra, index) => {
                  const _extra = generateSlug(extra);
                  return (
                    <div className="extra-wrapper" key={index}>
                      <p className="section-description">{extra}</p>
                      <div className="button-wrapper">
                        {items.map((item, index) => {
                          if (item.extra) {
                            const _isection = generateSlug(item.section);
                            const _isub = generateSlug(item.sub);
                            const _iextra = generateSlug(item.extra);
                            let name = item.name.length > 23 ? item.name.substring(0, 23) : item.name;
                            let icon;
                            switch (item.type) {
                              case 'zip':
                              case 'folder':
                                icon = 'folder';
                                break;
                              case 'doc':
                                icon = 'notebook';
                                break;
                              case 'sound':
                                icon = 'music-tone';
                                break;
                              case 'cli':
                                icon = 'control-play';
                                name = `${name} (CLI)`;
                                break;
                              default:
                                icon = 'control-play';
                            }
                            if ((_isection === _section) && (_isub === _sub) && (_iextra === _extra)) {
                              return (
                                <Btn
                                  className={`type-${item.type}`}
                                  key={index}
                                  onClick={() => window.electron.click(item.path)}
                                  title={item.desc || ''}
                                  disabled={isDisabled(item.path)}
                                  data-path={item.path}
                                >
                                  <i className={`icon-${icon}`}></i> {name}
                                </Btn>
                              );
                            }
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Section;
