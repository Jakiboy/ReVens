/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.4.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useState, useEffect, useMemo } from 'react';
import Head from './components/head';
import Header from './components/header';
import Tabs from './components/tabs';
import Content from './components/content';
import Footer from './components/footer';
import About from './components/about';
import Doc from './components/doc';
import Settings from './components/settings';
import Search from './components/search';
import Download from './components/download';
import iConfig from '../config/items.json';

const Launcher = () => {
  const initialTab = localStorage.getItem('activeTab') || 'analyzing';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [disabledPaths, setDisabledPaths] = useState([]);

  // Memoize all paths for empty status fallback
  const allPaths = useMemo(
    () => iConfig.items.map(item => item.path).filter(Boolean),
    []
  );

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handlePackageStatus = (status) => {
      if (status.disabledPaths && Array.isArray(status.disabledPaths)) {
        setDisabledPaths(status.disabledPaths);
      } else if (status.status === 'empty') {
        setDisabledPaths(allPaths);
      } else {
        setDisabledPaths([]);
      }
    };

    window.electron.onPackageStatus(handlePackageStatus);
  }, [allPaths]);

  return (
    <>
      <Head />
      <div className="container">
        <Header />
        <div className="content-wrapper">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <Content activeTab={activeTab} disabledPaths={disabledPaths} />
        </div>
        <hr className="separator my-3" />
        <Footer />
        <About />
        <Doc />
        <Settings />
        <Search setActiveTab={setActiveTab} />
        <Download />
      </div>
    </>
  );
};

export default Launcher;
