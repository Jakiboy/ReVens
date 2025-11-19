/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

interface ElectronAPI {
    click: (path: string) => void;
    on: (channel: string, callback: Function) => void;
    off: (channel: string, callback: Function) => void;
    onPackageStatus: (callback: (status: {
        status: string;
        message: string;
        color: string;
        existing: number;
        total: number;
        disabledPaths: string[];
    }) => void) => void;
    onDownloadProgress: (callback: (data: {
        progress: number;
        currentFile: string;
        status: string;
        completed?: boolean;
    }) => void) => void;
    abortDownload: () => void;
}interface Window {
    electron: ElectronAPI;
}
