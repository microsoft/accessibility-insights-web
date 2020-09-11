// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { FeatureFlagStoreData } from '../types/store-data/feature-flag-store-data';

export interface FlaggedComponentProps {
    featureFlagStoreData: FeatureFlagStoreData;
    featureFlag: string;
    enableJSXElement: JSX.Element;
    disableJSXElement?: JSX.Element;
}

export class FlaggedComponent extends React.Component<FlaggedComponentProps> {
    public render(): JSX.Element | null {
        const flagName = this.props.featureFlag;

        if (this.props.featureFlagStoreData != null && this.props.featureFlagStoreData[flagName]) {
            return this.props.enableJSXElement;
        }

        return this.props.disableJSXElement || null;
    }
}
