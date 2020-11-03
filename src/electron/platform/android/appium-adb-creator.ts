// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';

export type AppiumAdbCreateParameters =
    | {
          sdkRoot: string;
      }
    | undefined;

export interface AppiumAdbCreator {
    createADB(opts: AppiumAdbCreateParameters): Promise<ADB>;
}
