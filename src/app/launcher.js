/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.2.1
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useState, useEffect } from 'react';
import Head from './components/head';
import Header from './components/header';
import Tabs from './components/tabs';
import Content from './components/content';
import Footer from './components/footer';
import About from './components/about';
import Doc from './components/doc';
import Settings from './components/settings';

const Launcher = () => {

  const initialTab = localStorage.getItem('activeTab') || 'analyzing';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  return (
    <>
      <Head />
      <div className="container">
        <Header />
        <div className="content-wrapper">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <Content activeTab={activeTab} />
        </div>
        <hr className="separator my-3" />
        <Footer />
        <About />
        <Doc />
        <Settings />
      </div>
    </>
  );
};

export default Launcher;
