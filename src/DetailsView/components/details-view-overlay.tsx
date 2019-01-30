// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { InspectActionMessageCreator } from '../../common/message-creators/inspect-action-message-creator';
import { ScopingActionMessageCreator } from '../../common/message-creators/scoping-action-message-creator';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { IDetailsViewData } from '../../common/types/store-data/idetails-view-data';
import { IScopingStoreData } from '../../common/types/store-data/scoping-store-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from '../../DetailsView/actions/details-view-action-message-creator';
import { PreviewFeaturesPanel, PreviewFeaturesPanelProps } from '../../DetailsView/components/preview-features-panel';
import { IScopingPanelProps, ScopingPanel } from '../../DetailsView/components/scoping-panel';
import { PreviewFeatureFlagsHandler } from '../../DetailsView/handlers/preview-feature-flags-handler';
import { ContentPanel, ContentPanelDeps, ContentPanelProps } from '../../views/content/content-panel';
import { SettingsPanel, SettingsPanelDeps, SettingsPanelProps } from './settings-panel';

export type DetailsViewOverlayDeps = ContentPanelDeps & SettingsPanelDeps;

export interface IDetailsViewOverlayProps {
    deps: DetailsViewOverlayDeps;
    actionMessageCreator: DetailsViewActionMessageCreator;
    detailsViewStoreData: IDetailsViewData;
    featureFlagStoreData: FeatureFlagStoreData;
    previewFeatureFlagsHandler: PreviewFeatureFlagsHandler;
    scopingStoreData: IScopingStoreData;
    scopingActionMessageCreator: ScopingActionMessageCreator;
    inspectActionMessageCreator: InspectActionMessageCreator;
    userConfigurationStoreData: UserConfigurationStoreData;
}

export class DetailsViewOverlay extends React.Component<IDetailsViewOverlayProps> {
    public render() {
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
        const scopingProps: IScopingPanelProps = {
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
