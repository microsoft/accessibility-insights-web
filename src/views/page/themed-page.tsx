// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreProxy } from '../../common/store-proxy';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { StoreNames } from '../../common/stores/store-names';
import { ChromeAdapter } from '../../background/browser-adapter';
import { Page } from './page';
import { withThemedBody3 } from '../../common/components/theme-switcher';
import { Messages } from '../../common/messages';

const chromeAdapter = new ChromeAdapter();
const userConfigStore = new StoreProxy<UserConfigurationStoreData>(
    StoreNames[StoreNames.UserConfigurationStore],
    chromeAdapter,
);
chromeAdapter.sendMessageToFrames({ type: Messages.UserConfig.GetCurrentState });

export const ThemedPage = withThemedBody3(Page, userConfigStore);
