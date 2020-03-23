// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolsChromeAdapterImpl } from 'background/dev-tools-chrome-adapter';
import { TargetPageInspector } from 'Devtools/target-page-inspector';
import { DevToolInitializer } from './dev-tool-initializer';

const browserAdapter = new DevToolsChromeAdapterImpl();
const targetPageInspector = new TargetPageInspector(chrome.devtools.inspectedWindow);

const devToolInitializer: DevToolInitializer = new DevToolInitializer(
    browserAdapter,
    targetPageInspector,
);
devToolInitializer.initialize();
