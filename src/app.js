import React from 'react';
import { createRoot } from 'react-dom/client';
import Launcher from './app/launcher';

const root = document.getElementById('root');
createRoot(root).render(<Launcher />);
