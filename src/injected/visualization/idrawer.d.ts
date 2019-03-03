// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IHtmlElementAxeResults } from '../scanner-utils';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';

// tslint:disable-next-line:interface-name
interface IDrawer {
    initialize(config: IDrawerInitData<any>);
    isOverlayEnabled: boolean;
    drawLayout();
    eraseLayout();
}

// tslint:disable-next-line:interface-name
interface IDrawerInitData<T> {
    data: T[];
    featureFlagStoreData: FeatureFlagStoreData;
}
