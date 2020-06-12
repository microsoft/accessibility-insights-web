// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ADB from 'appium-adb';
import {
    AppiumAdbCreateParameters,
    AppiumAdbCreator,
} from 'electron/platform/android/appium-adb-creator';

export class LiveAppiumAdbCreator implements AppiumAdbCreator {
    public createADB = async (parameters: AppiumAdbCreateParameters): Promise<ADB> => {
        return ADB.createADB(parameters);
    };
}
