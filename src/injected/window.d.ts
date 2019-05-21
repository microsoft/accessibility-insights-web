// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElectronMainWindowInitializer } from './electron-main-window-initializer';
import { ElectronWindowInitializer } from './electron-window-initializer';
import { MainWindowContext } from './main-window-context';
import { WindowInitializer } from './window-initializer';

declare global {
    interface Window {
        windowInitializer: WindowInitializer | ElectronWindowInitializer | ElectronMainWindowInitializer;
        mainWindowContext: MainWindowContext;
    }
}
