// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { initializeFabricIcons } from '../common/fabric-icons';
import { ElectronMainWindowInitializer } from './electron-main-window-initializer';
import { ElectronWindowInitializer } from './electron-window-initializer';

if (!window.windowInitializer) {
    initializeFabricIcons();

    if (window.top === window) {
        window.windowInitializer = new ElectronMainWindowInitializer();
    } else {
        window.windowInitializer = new ElectronWindowInitializer();
    }

    // tslint:disable-next-line:no-floating-promises - top-level entry points are intentionally floating promises
    window.windowInitializer.initialize();
}
