// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { DisplayableStrings } from '../../common/constants/displayable-strings';
import { DisplayableFeatureFlag } from '../../common/types/store-data/displayable-feature-flag';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { PreviewFeatureFlagsHandler } from '../handlers/preview-feature-flags-handler';
import { NoDisplayableFeatureFlagMessage } from './no-displayable-preview-features-message';
import { PreviewFeaturesToggleList } from './preview-features-toggle-list';

export interface PreviewFeaturesContainerProps {
    actionMessageCreator: DetailsViewActionMessageCreator;
    featureFlagData: FeatureFlagStoreData;
    previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
}

export class PreviewFeaturesContainer extends React.Component<
    PreviewFeaturesContainerProps
> {
    public render(): JSX.Element {
        const displayableFeatureFlags: DisplayableFeatureFlag[] = this.props.previewFeatureFlagsHandler.getDisplayableFeatureFlags(
            this.props.featureFlagData,
        );
        if (displayableFeatureFlags.length === 0) {
            return <NoDisplayableFeatureFlagMessage />;
        }
        return (
            <div>
                <div className="preview-features-description">
                    {DisplayableStrings.previewFeaturesDescription}
                </div>
                <PreviewFeaturesToggleList
                    displayedFeatureFlags={displayableFeatureFlags}
                    actionMessageCreator={this.props.actionMessageCreator}
                />
            </div>
        );
    }
}
