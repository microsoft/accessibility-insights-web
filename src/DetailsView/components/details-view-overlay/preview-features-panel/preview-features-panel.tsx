// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import { DetailsViewActionMessageCreator } from '../../../actions/details-view-action-message-creator';
import { PreviewFeatureFlagsHandler } from '../../../handlers/preview-feature-flags-handler';
import { GenericPanel } from '../../generic-panel';
import { PreviewFeaturesContainer } from './preview-features-container';

export type PreviewFeaturesPanelDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface PreviewFeaturesPanelProps {
    deps: PreviewFeaturesPanelDeps;
    isOpen: boolean;
    featureFlagData: FeatureFlagStoreData;
    previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
}

export class PreviewFeaturesPanel extends React.Component<PreviewFeaturesPanelProps> {
    public render(): any {
        return (
            <GenericPanel
                headerText="Preview features"
                isOpen={this.props.isOpen}
                className="preview-features-panel"
                onDismiss={
                    this.props.deps.detailsViewActionMessageCreator.closePreviewFeaturesPanel
                }
                closeButtonAriaLabel="Close preview features panel"
                hasCloseButton={true}
            >
                <PreviewFeaturesContainer
                    deps={this.props.deps}
                    featureFlagData={this.props.featureFlagData}
                    previewFeatureFlagsHandler={this.props.previewFeatureFlagsHandler}
                />
            </GenericPanel>
        );
    }
}
