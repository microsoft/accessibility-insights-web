// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolsChromeAdapter, DevToolsChromeAdapterImpl } from '../background/dev-tools-chrome-adapter';
import { getCommonIocContainer } from '../common/get-common-ioc-container';
import { interfaceNames } from './interface-names';

export const container = getCommonIocContainer();
container.bind<DevToolsChromeAdapter>(interfaceNames.DevToolsChromeAdapter).to(DevToolsChromeAdapterImpl);
