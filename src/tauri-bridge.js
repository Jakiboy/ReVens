/**
 * Author  : Jakiboy (Jihad Sinnaour)
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 2.0.0
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import { invoke } from '@tauri-apps/api/core';

// Create a window.electron compatible API for minimal changes to existing code
window.electron = {
    click: async (path) => {
        try {
            // Get config from localStorage or use defaults
            const configStr = localStorage.getItem('app-config');
            const config = configStr ? JSON.parse(configStr) : {};

            await invoke('open_item', {
                path: path,
                baseDir: config.baseDir || null,
                playerPath: config.player || null
            });
        } catch (error) {
            console.error('Error opening item:', error);
        }
    },
    openUrl: async (url) => {
        try {
            await invoke('open_url', { url });
        } catch (error) {
            console.error('Error opening URL:', error);
        }
    },
    reload: async () => {
        try {
            window.location.reload();
        } catch (error) {
            console.error('Error reloading:', error);
        }
    },
    // Placeholder for event listeners (if needed in the future)
    on: (channel, func) => {
        console.warn('Event listeners not yet implemented in Tauri version');
    },
    off: (channel, func) => {
        console.warn('Event listeners not yet implemented in Tauri version');
    }
};
