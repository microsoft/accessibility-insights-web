// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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

    public render(): JSX.Element {
        return (
            <div className="ms-Fabric end-of-life-panel">
                <div className="main-section">
                    <div className="popup-grid">
                        <div className="launch-panel-general-container">
                            <>
                                <div>
                                    Thank you for helping the Accessibility Insights team test. This
                                    extension has now reached its end of life, please return to
                                    using our mainline extensions:
                                </div>
                                <br />
                                <a href="https://chrome.google.com/webstore/detail/accessibility-insights-fo/hbcplehnakffdldhldncjlnbpfgogbem">
                                    Canary (released continuously)
                                </a>
                                <br />
                                <a href="https://chrome.google.com/webstore/detail/accessibility-insights-fo/nnmjfbmebeckhpejobgjjjnchlljiagp">
                                    Insider (on feature completion)
                                </a>
                                <br />
                                <a href="https://chrome.google.com/webstore/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni">
                                    Production (after validation in insider)
                                </a>
                            </>
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
