// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { DisplayableStrings } from '../../common/constants/displayable-strings';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { IDisplayableFeatureFlag } from '../../common/types/store-data/idisplayable-feature-flag';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { PreviewFeatureFlagsHandler } from '../handlers/preview-feature-flags-handler';
import { PreviewFeaturesToggleList } from './preview-features-toggle-list';

export interface IPreviewFeaturesContainerProps {
    actionMessageCreator: DetailsViewActionMessageCreator;
    featureFlagData: FeatureFlagStoreData;
    previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
}

export class PreviewFeaturesContainer extends React.Component<IPreviewFeaturesContainerProps> {
    public render(): JSX.Element {
        const displayableFeatureFlags: IDisplayableFeatureFlag[] = this.props.previewFeatureFlagsHandler.getDisplayableFeatureFlags(this.props.featureFlagData);

        return (
            <div>
                <div className="preview-features-description">{DisplayableStrings.previewFeaturesDescription}</div>
                <PreviewFeaturesToggleList
                    displayedFeatureFlags={displayableFeatureFlags}
                    actionMessageCreator={this.props.actionMessageCreator}
                />
            </div>
        );
    }
}
