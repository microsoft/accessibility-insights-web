// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DisplayableStrings } from 'common/constants/displayable-strings';
import { NamedFC } from 'common/react/named-fc';
import { DisplayableFeatureFlag } from 'common/types/store-data/displayable-feature-flag';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';

import { DetailsViewActionMessageCreator } from '../../../actions/details-view-action-message-creator';
import { PreviewFeatureFlagsHandler } from '../../../handlers/preview-feature-flags-handler';
import { NoDisplayableFeatureFlagMessage } from '../../no-displayable-preview-features-message';
import { PreviewFeaturesToggleList } from '../../preview-features-toggle-list';

export const previewFeaturesAutomationId = 'preview-features-container';

export type PreviewFeaturesContainerDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface PreviewFeaturesContainerProps {
    deps: PreviewFeaturesContainerDeps;
    featureFlagData: FeatureFlagStoreData;
    previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
}

export const PreviewFeaturesContainer = NamedFC<PreviewFeaturesContainerProps>(
    'PreviewFeaturesContainer',
    props => {
        const displayableFeatureFlags: DisplayableFeatureFlag[] =
            props.previewFeatureFlagsHandler.getDisplayableFeatureFlags(props.featureFlagData);

        if (displayableFeatureFlags.length === 0) {
            return (
                <div data-automation-id={previewFeaturesAutomationId}>
                    <NoDisplayableFeatureFlagMessage />
                </div>
            );
        }

        return (
            <div data-automation-id={previewFeaturesAutomationId}>
                <div className="preview-features-description">
                    {DisplayableStrings.previewFeaturesDescription}
                </div>
                <PreviewFeaturesToggleList
                    deps={props.deps}
                    displayedFeatureFlags={displayableFeatureFlags}
                />
            </div>
        );
    },
);
