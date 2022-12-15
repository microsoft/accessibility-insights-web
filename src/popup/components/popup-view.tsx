// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from '@fluentui/react';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import * as React from 'react';
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { TelemetryPermissionDialogDeps } from '../../common/components/telemetry-permission-dialog';
import {
    withStoreSubscription,
    WithStoreSubscriptionDeps,
} from '../../common/components/with-store-subscription';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { LaunchPanelStoreData } from '../../common/types/store-data/launch-panel-store-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { PopupHandlers } from '../handlers/popup-handlers';
import { LaunchPadRowConfigurationFactory } from '../launch-pad-row-configuration-factory';
import { DiagnosticViewToggleFactory } from './diagnostic-view-toggle-factory';
import { FileUrlUnsupportedMessagePanelDeps } from './file-url-unsupported-message-panel';
import { LaunchPadDeps } from './launch-pad';
import { LaunchPanelHeaderDeps } from './launch-panel-header';

export interface PopupViewProps {
    deps: PopupViewControllerDeps;
    title: string;
    popupHandlers: PopupHandlers;
    popupWindow: Window;
    targetTabUrl: string;
    hasAccess: boolean;
    launchPadRowConfigurationFactory: LaunchPadRowConfigurationFactory;
    diagnosticViewToggleFactory: DiagnosticViewToggleFactory;
    dropdownClickHandler: DropdownClickHandler;
    storeState: PopupViewControllerState;
}

export type PopupViewControllerDeps = LaunchPadDeps &
    LaunchPanelHeaderDeps &
    TelemetryPermissionDialogDeps &
    FileUrlUnsupportedMessagePanelDeps &
    WithStoreSubscriptionDeps<PopupViewControllerState> & {
        browserAdapter: BrowserAdapter;
    };

export interface PopupViewControllerState {
    featureFlagStoreData: FeatureFlagStoreData;
    launchPanelStateStoreData: LaunchPanelStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
}

export class PopupView extends React.Component<PopupViewProps> {
    constructor(props: PopupViewProps) {
        super(props);
    }

    private openAssessment = event =>
        this.props.deps.popupActionMessageCreator.openDetailsView(
            event,
            null,
            TelemetryEventSource.LaunchPadAssessment,
            DetailsViewPivotType.assessment,
        );

    public render(): JSX.Element {
        const openTheAssessmentLink = (
            <Link
                role="link"
                className="insights-link"
                id="open-assessment-link"
                onClick={this.openAssessment}
            >
                open the assessment
            </Link>
        );

        return (
            <div className="ms-Fabric end-of-life-panel">
                <div className="main-section">
                    <div className="popup-grid">
                        <div className="launch-panel-general-container">
                            <p>
                                Thank you for helping the Accessibility Insights team test this
                                preview extension. The "Insider (M3)" build has now been released
                                into production. Please continue using Accessibility Insights for
                                Web by switching to the Production version:
                            </p>
                            <ul>
                                <li>
                                    <Link
                                        role="link"
                                        className="insights-link"
                                        id="install-production-chrome-link"
                                        target="_blank"
                                        href="https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni"
                                    >
                                        Install for Google Chrome
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        role="link"
                                        className="insights-link"
                                        id="install-production-edge-link"
                                        target="_blank"
                                        href="https://microsoftedge.microsoft.com/addons/detail/accessibility-insights-fo/ghbhpcookfemncgoinjblecnilppimih"
                                    >
                                        Install for Microsoft Edge
                                    </Link>
                                </li>
                            </ul>
                            <p>
                                If you have an assessment in progress which you would like to
                                continue working on in the Production version,{' '}
                                {openTheAssessmentLink} and select the "Save Assessment" button to
                                save your assessment in progress to a file, then use the "Load
                                Assessment" button from the Production version to continue where you
                                left off.
                            </p>
                            <p>
                                Once you have switched to the Production version, you can remove the
                                "Accessibility Insights for Web - Insider (M3)" build from your
                                browser's "Extensions" settings page.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export const PopupViewWithStoreSubscription = withStoreSubscription<
    PopupViewProps,
    PopupViewControllerState
>(PopupView);
