// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Spinner, SpinnerSize } from '@fluentui/react';
import * as React from 'react';
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { NewTabLink } from '../../common/components/new-tab-link';
import {
    TelemetryPermissionDialog,
    TelemetryPermissionDialogDeps,
} from '../../common/components/telemetry-permission-dialog';
import {
    withStoreSubscription,
    WithStoreSubscriptionDeps,
} from '../../common/components/with-store-subscription';
import { DisplayableStrings } from '../../common/constants/displayable-strings';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import {
    LaunchPanelStoreData,
    LaunchPanelType,
} from '../../common/types/store-data/launch-panel-store-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { UrlValidator } from '../../common/url-validator';
import { PopupHandlers } from '../handlers/popup-handlers';
import { PopupViewControllerHandler } from '../handlers/popup-view-controller-handler';
import { LaunchPadRowConfigurationFactory } from '../launch-pad-row-configuration-factory';
import { AdHocToolsPanel } from './ad-hoc-tools-panel';
import { DiagnosticViewToggleFactory } from './diagnostic-view-toggle-factory';
import {
    FileUrlUnsupportedMessagePanel,
    FileUrlUnsupportedMessagePanelDeps,
    FileUrlUnsupportedMessagePanelProps,
} from './file-url-unsupported-message-panel';
import { Header } from './header';
import { LaunchPad, LaunchPadDeps, LaunchPadRowConfiguration } from './launch-pad';
import { LaunchPanelHeader, LaunchPanelHeaderDeps } from './launch-panel-header';

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

const demoLink: string = 'https://go.microsoft.com/fwlink/?linkid=2082374';

export class PopupView extends React.Component<PopupViewProps> {
    private handler: PopupViewControllerHandler;
    private openTogglesView: () => void;
    private openAdhocToolsPanel: () => void;
    private versionNumber: string;
    private isInitialRender: boolean = true;

    constructor(props: PopupViewProps) {
        super(props);
        this.handler = props.popupHandlers.popupViewControllerHandler;
        this.versionNumber = props.deps.browserAdapter.getManifest().version;
        this.openTogglesView = () => {
            this.handler.openLaunchPad(this);
        };
        this.openAdhocToolsPanel = () => {
            this.handler.openAdhocToolsPanel(this);
        };
    }

    public render(): JSX.Element {
        if (!this.props.hasAccess) {
            if (UrlValidator.isFileUrl(this.props.targetTabUrl)) {
                return this.renderUnsupportedMsgPanelForFileUrl();
            } else {
                return this.renderUnsupportedMsgPanelForChromeUrl();
            }
        } else if (this.props.deps.storesHub.hasStoreData()) {
            return (
                <React.Fragment>
                    {this.renderLaunchPanel()}
                    <TelemetryPermissionDialog
                        deps={this.props.deps}
                        isFirstTime={this.props.storeState.userConfigurationStoreData.isFirstTime}
                    />
                </React.Fragment>
            );
        }
        return this.renderSpinner();
    }

    private renderLaunchPanel(): JSX.Element {
        const { popupActionMessageCreator } = this.props.deps;

        if (this.isInitialRender) {
            this.isInitialRender = false;
            popupActionMessageCreator.openLaunchPad(
                this.props.storeState.launchPanelStateStoreData.launchPanelType,
            );
        }
        switch (this.props.storeState.launchPanelStateStoreData.launchPanelType) {
            case LaunchPanelType.LaunchPad:
                return this.renderLaunchPad();
            case LaunchPanelType.AdhocToolsPanel:
                return this.renderAdHocToolsPanel();
            default:
                return null;
        }
    }

    private renderAdHocToolsPanel(): JSX.Element {
        return (
            <div className="ms-Fabric ad-hoc-tools-panel">
                <LaunchPanelHeader
                    deps={this.props.deps}
                    title={this.props.title}
                    popupWindow={this.props.popupWindow}
                    openAdhocToolsPanel={this.openAdhocToolsPanel}
                    featureFlags={this.props.storeState.featureFlagStoreData}
                />
                <AdHocToolsPanel
                    backLinkHandler={this.openTogglesView}
                    diagnosticViewToggleFactory={this.props.diagnosticViewToggleFactory}
                />
            </div>
        );
    }

    private renderLaunchPad(): JSX.Element {
        const { popupActionMessageCreator } = this.props.deps;

        const rowConfigs: LaunchPadRowConfiguration[] =
            this.props.launchPadRowConfigurationFactory.createRowConfigs(
                this,
                popupActionMessageCreator,
                this.props.popupHandlers.popupViewControllerHandler,
            );

        const onClickTutorialLink = event => popupActionMessageCreator.openTutorial(event);

        return (
            <div className="ms-Fabric launch-panel" id="new-launch-pad">
                <LaunchPanelHeader
                    deps={this.props.deps}
                    title={this.props.title}
                    subtitle={
                        <>
                            <NewTabLink href={demoLink} onClick={onClickTutorialLink}>
                                Watch 3-minute video introduction
                            </NewTabLink>{' '}
                        </>
                    }
                    popupWindow={this.props.popupWindow}
                    openAdhocToolsPanel={this.openAdhocToolsPanel}
                    featureFlags={this.props.storeState.featureFlagStoreData}
                />
                <LaunchPad
                    deps={this.props.deps}
                    productName={this.props.title}
                    rowConfigs={rowConfigs}
                    version={this.versionNumber}
                />
            </div>
        );
    }

    private renderSpinner(): JSX.Element {
        return <Spinner size={SpinnerSize.large} label="Loading..." className="insights-spinner" />;
    }

    private renderUnsupportedMsgPanelForChromeUrl(): JSX.Element {
        return (
            <div className="ms-Fabric unsupported-url-info-panel">
                {this.renderDefaultHeader()}
                <div className="main-section">
                    <div className="popup-grid">
                        <div className="launch-panel-general-container">
                            <>{this.getUrlNotScannableMessage()}</>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private getUrlNotScannableMessage = () => {
        let keyIndex = 0;
        const messages = [...DisplayableStrings.urlNotScannable];
        const totalMessages = messages.length;

        return messages.reduce((result, currentMessage, currentIndex) => {
            const spanMessage = <span key={keyIndex++}>{currentMessage}</span>;

            const needsBrElement = currentIndex < totalMessages - 1;
            const brElement = needsBrElement ? <br key={keyIndex++}></br> : undefined;

            return result.concat(spanMessage, brElement);
        }, []);
    };

    private renderUnsupportedMsgPanelForFileUrl(): JSX.Element {
        const props: FileUrlUnsupportedMessagePanelProps = {
            title: this.props.title,
            header: this.renderDefaultHeader(),
            deps: this.props.deps,
        };

        return <FileUrlUnsupportedMessagePanel {...props} />;
    }

    private renderDefaultHeader(): JSX.Element {
        return <Header title={this.props.title} />;
    }

    public setlaunchPanelType = (launchPanelType: LaunchPanelType): void => {
        const { popupActionMessageCreator } = this.props.deps;
        popupActionMessageCreator.setLaunchPanelType(launchPanelType);
    };
}

export const PopupViewWithStoreSubscription = withStoreSubscription<
    PopupViewProps,
    PopupViewControllerState
>(PopupView);
