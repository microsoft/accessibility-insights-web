// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowInitializer } from "./window-initializer";
import { MainWindowContext } from "./main-window-context";

declare global {
    interface Window {
        windowInitializer: WindowInitializer;
        mainWindowContext: MainWindowContext;
    }
}
