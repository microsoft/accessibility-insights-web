// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AppDataAdapter } from 'common/browser-adapters/app-data-adapter';
import { ApplicationProperties } from 'common/types/store-data/unified-data-interface';
import { androidAppTitle } from 'content/strings/application';
export type ApplicationPropertiesDelegate = () => ApplicationProperties;

export const createGetApplicationProperties = (appDataAdapter: AppDataAdapter): ApplicationPropertiesDelegate => {
    return () => {
        return {
            name: androidAppTitle,
            version: appDataAdapter.getVersion(),
        };
    };
};
