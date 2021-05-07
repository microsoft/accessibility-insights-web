// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { getDevicesByModel } from 'android-device-list';

interface MarketingInfo {
    brand: string;
    name: string;
}

export class AndroidFriendlyDeviceNameProvider {
    public getFriendlyName(model: string): string {
        if (model) {
            const names: MarketingInfo[] = getDevicesByModel(model);

            if (names.length > 0) {
                return `${model} [${names[0].brand} ${names[0].name}]`;
            }
        }

        return model;
    }
}
