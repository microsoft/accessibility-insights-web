// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createDefaultLogger } from 'common/logging/default-logger';
import { initializeFabricIcons } from '../common/fabric-icons';
import { MainWindowInitializer } from './main-window-initializer';
import { WindowInitializer } from './window-initializer';

if (!window.windowInitializer) {
    const logger = createDefaultLogger();
    initializeFabricIcons();

    if (window.top === window) {
        window.windowInitializer = new MainWindowInitializer();
    } else {
        window.windowInitializer = new WindowInitializer();
    }

    window.windowInitializer.initialize().catch(logger.error);
}
