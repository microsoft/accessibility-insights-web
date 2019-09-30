// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { ContentPanel, ContentPanelDeps, ContentPanelProps } from 'views/content/content-panel';
import { InspectActionMessageCreator } from '../../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../../common/message-creators/scoping-action-message-creator';
import { DetailsViewData } from '../../common/types/store-data/details-view-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { ScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { PreviewFeatureFlagsHandler } from '../handlers/preview-feature-flags-handler';
import { PreviewFeaturesPanel, PreviewFeaturesPanelProps } from './preview-features-panel';
import { ScopingPanel, ScopingPanelProps } from './scoping-panel';
import { SettingsPanel, SettingsPanelDeps, SettingsPanelProps } from './settings-panel/settings-panel';

export type DetailsViewOverlayDeps = ContentPanelDeps & SettingsPanelDeps;

export interface DetailsViewOverlayProps {
    deps: DetailsViewOverlayDeps;
    actionMessageCreator: DetailsViewActionMessageCreator;
    detailsViewStoreData: DetailsViewData;
    featureFlagStoreData: FeatureFlagStoreData;
    previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
    scopingStoreData: ScopingStoreData;
    scopingActionMessageCreator: ScopingActionMessageCreator;
    inspectActionMessageCreator: InspectActionMessageCreator;
    userConfigurationStoreData: UserConfigurationStoreData;
}

export class DetailsViewOverlay extends React.Component<DetailsViewOverlayProps> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                {this.getPreviewFeaturesPanel()}
                {this.getScopingPanel()}
                {this.getContentPanel()}
                {this.getSettingsPanel()}
            </React.Fragment>
        );
    }

    private getSettingsPanel(): JSX.Element {
        const settingsPanelProps: SettingsPanelProps = {
            deps: this.props.deps,
            isOpen: this.props.detailsViewStoreData.currentPanel.isSettingsOpen,
            userConfigStoreState: this.props.userConfigurationStoreData,
            featureFlagData: this.props.featureFlagStoreData,
        };

        return <SettingsPanel {...settingsPanelProps} />;
    }

    private getPreviewFeaturesPanel(): JSX.Element {
        const previewProps: PreviewFeaturesPanelProps = {
            actionMessageCreator: this.props.actionMessageCreator,
            featureFlagData: this.props.featureFlagStoreData,
            isOpen: this.props.detailsViewStoreData.currentPanel.isPreviewFeaturesOpen,
            previewFeatureFlagsHandler: this.props.previewFeatureFlagsHandler,
        };

        return <PreviewFeaturesPanel {...previewProps} />;
    }

    private getContentPanel(): JSX.Element {
        const {
            currentPanel: { isContentOpen },
            contentPath,
        } = this.props.detailsViewStoreData;
        const contentProps: ContentPanelProps = {
            deps: this.props.deps,
            isOpen: isContentOpen,
            content: contentPath,
        };

        return <ContentPanel {...contentProps} />;
    }

    private getScopingPanel(): JSX.Element {
        const scopingProps: ScopingPanelProps = {
            actionMessageCreator: this.props.actionMessageCreator,
            featureFlagData: this.props.featureFlagStoreData,
            isOpen: this.props.detailsViewStoreData.currentPanel.isScopingOpen,
            scopingSelectorsData: this.props.scopingStoreData,
            scopingActionMessageCreator: this.props.scopingActionMessageCreator,
            inspectActionMessageCreator: this.props.inspectActionMessageCreator,
        };
        return <ScopingPanel {...scopingProps} />;
    }
}
