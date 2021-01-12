// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MainWindowContext } from './main-window-context';
import { WindowInitializer } from './window-initializer';

declare global {
    interface Window {
        windowInitializer: WindowInitializer;
        mainWindowContext: MainWindowContext;
    }
}
