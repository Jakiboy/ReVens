/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useMemo, useState, useEffect } from 'react';
import { MDBBtn as Btn } from 'mdb-react-ui-kit';
import { generateSlug } from '../helper';

// Helper function to get icon based on item type
const getItemIcon = (type) => {
  switch (type) {
    case 'zip':
    case 'folder':
      return 'folder';
    case 'doc':
    case 'pdf':
    case 'md':
      return 'notebook';
    case 'sound':
    case 'mx':
    case 'mp3':
      return 'music-tone';
    case 'exe':
    case 'cli':
    case 'sh':
    case 'ps1':
      return 'control-play';
    default:
      return 'flag';
  }
};

// Helper function to format item name
const formatItemName = (name, type) => {
  const truncatedName = name.length > 23 ? name.substring(0, 23) : name;
  return type === 'cli' ? `${truncatedName} (CLI)` : truncatedName;
};

// Context menu component
const ContextMenu = ({ item, position, onClose, isDisabled }) => {
  useEffect(() => {
    const handleClick = () => onClose();
    const handleContextMenu = (e) => {
      e.preventDefault();
      onClose();
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onClose]);

  const handleExplore = (e) => {
    e.stopPropagation();
    window.electron.exploreItem(item.path);
    onClose();
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    window.electron.downloadItem(item);
    onClose();
  };

  const handleHomepage = (e) => {
    e.stopPropagation();
    window.electron.openUrl(item.url);
    onClose();
  };

  const showExplore = item.path && !item.remove && !isDisabled;
  const showDownload = item.download && item.download !== false;
  const showHomepage = item.url && item.url !== false && (item.type === 'exe' || item.type === 'zip');
  const showHeader = item.type !== 'doc' && item.type !== 'pdf' && item.type !== 'md';
  const hasMenuItems = showExplore || showDownload || showHomepage;

  // Always show context menu with at least the header
  if (!showHeader && !hasMenuItems) {
    return null;
  }

  return (
    <div
      className="context-menu"
      style={{ top: position.y, left: position.x }}
      onClick={(e) => e.stopPropagation()}
    >
      {showHeader && (
        <div className="context-menu-header">
          {item.name}
        </div>
      )}
      {showExplore && (
        <div className="context-menu-item" onClick={handleExplore}>
          <i className="icon-folder"></i> Explore Item
        </div>
      )}
      {showHomepage && (
        <div className="context-menu-item" onClick={handleHomepage}>
          <i className="icon-link"></i> Homepage
        </div>
      )}
      {showDownload && (
        <div className="context-menu-item" onClick={handleDownload}>
          <i className="icon-cloud-download"></i> Download Item
        </div>
      )}
    </div>
  );
};

// ItemButton component to reduce duplication
const ItemButton = ({ item, isDisabled, onContextMenu }) => {
  const icon = getItemIcon(item.type);
  const name = formatItemName(item.name, item.type);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(item, {
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleClick = () => {
    if (!isDisabled(item)) {
      window.electron.click(item.path);
    }
  };

  return (
    <div
      className="item-button-wrapper"
      onContextMenu={handleContextMenu}
      style={{ display: 'inline-block' }}
    >
      <Btn
        className={`type-${item.type}`}
        onClick={handleClick}
        title={item.desc || ''}
        disabled={isDisabled(item)}
        data-id={item.slug}
      >
        <i className={`icon-${icon}`}></i> {name}
      </Btn>
    </div>
  );
};

const Section = ({ section, items, disabledSlugs = [] }) => {
  const [contextMenu, setContextMenu] = useState(null);
  const _section = generateSlug(section.name);
  const _subs = section.sub;

  // Convert array to Set for O(1) lookup performance
  const disabledSet = useMemo(() => new Set(disabledSlugs), [disabledSlugs]);
  const isDisabled = (item) => disabledSet.has(item.slug);

  const handleContextMenu = (item, position) => {
    setContextMenu({ item, position });
  };

  return (
    <div className="tab-content" id={`tab-content-${_section}`}>
      <div className="tab-pane fade show active" id={_section} role="tabpanel" aria-labelledby={`${_section}-tab`}>
        <p dangerouslySetInnerHTML={{ __html: section.desc }}></p>
        <div className="section-container app-scroller">
          {_subs.map((sub, index) => {
            const _sub = generateSlug(sub.name);
            return (
              <div className="section-wrapper" key={index}>
                <h3 className="section-title">{sub.title}</h3>
                <p className="section-description" dangerouslySetInnerHTML={{ __html: sub.desc }}></p>
                <div className="button-wrapper">
                  {items.map((item, itemIndex) => {
                    if (typeof item.sub !== 'string') return null;

                    const _isection = generateSlug(item.section);
                    const _isub = generateSlug(item.sub);

                    if ((_isection === _section) && (_isub === _sub) && !item.extra) {
                      return <ItemButton key={itemIndex} item={item} isDisabled={isDisabled} onContextMenu={handleContextMenu} />;
                    }
                    return null;
                  })}
                </div>
                {sub.extra && sub.extra.map((extra, extraIndex) => {
                  const _extra = generateSlug(extra.name || extra);
                  const extraTitle = extra.title || extra;
                  return (
                    <div className="extra-wrapper" key={extraIndex}>
                      <p className="section-description">{extraTitle}</p>
                      <div className="button-wrapper">
                        {items.map((item, itemIndex) => {
                          if (typeof item.extra !== 'string') return null;
                          if (typeof item.sub !== 'string') return null;

                          const _isection = generateSlug(item.section);
                          const _isub = generateSlug(item.sub);
                          const _iextra = generateSlug(item.extra);

                          if ((_isection === _section) && (_isub === _sub) && (_iextra === _extra)) {
                            return <ItemButton key={itemIndex} item={item} isDisabled={isDisabled} onContextMenu={handleContextMenu} />;
                          }
                          return null;
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
      {contextMenu && (
        <ContextMenu
          item={contextMenu.item}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
          isDisabled={isDisabled(contextMenu.item)}
        />
      )}
    </div>
  );
};

export default Section;
