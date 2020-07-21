// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanningSpinner } from 'common/components/scanning-spinner/scanning-spinner';
import { GetCardSelectionViewData } from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { GetCardViewData } from 'common/rule-based-view-model-provider';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { DetailsViewStoreData } from 'common/types/store-data/details-view-store-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import {
    ScanMetadata,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { CardsView, CardsViewDeps } from 'DetailsView/components/cards-view';
import {
    SettingsPanel,
    SettingsPanelDeps,
} from 'DetailsView/components/details-view-overlay/settings-panel/settings-panel';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { TitleBar, TitleBarDeps } from 'electron/views/automated-checks/components/title-bar';
import { DeviceDisconnectedPopup } from 'electron/views/device-disconnected-popup/device-disconnected-popup';
import { ScreenshotView } from 'electron/views/screenshot/screenshot-view';
import { ScreenshotViewModelProvider } from 'electron/views/screenshot/screenshot-view-model-provider';
import * as React from 'react';

import { AndroidSetupStoreData } from 'electron/flux/types/android-setup-store-data';
import * as styles from './automated-checks-view.scss';
import { CommandBar, CommandBarDeps } from './components/command-bar';
import { HeaderSection } from './components/header-section';

export const automatedChecksViewAutomationId = 'automated-checks-view';

export type AutomatedChecksViewDeps = CommandBarDeps &
    TitleBarDeps &
    CardsViewDeps &
    SettingsPanelDeps & {
        scanActionCreator: ScanActionCreator;
        windowStateActionCreator: WindowStateActionCreator;
        getCardsViewData: GetCardViewData;
        getCardSelectionViewData: GetCardSelectionViewData;
        screenshotViewModelProvider: ScreenshotViewModelProvider;
        isResultHighlightUnavailable: IsResultHighlightUnavailable;
    };

export type AutomatedChecksViewProps = {
    deps: AutomatedChecksViewDeps;
    scanStoreData: ScanStoreData;
    windowStateStoreData: WindowStateStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    cardSelectionStoreData: CardSelectionStoreData;
    detailsViewStoreData: DetailsViewStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    androidSetupStoreData: AndroidSetupStoreData;
};

export class AutomatedChecksView extends React.Component<AutomatedChecksViewProps> {
    public componentDidMount(): void {
        this.props.deps.scanActionCreator.scan(this.getScanPort());
    }

    public render(): JSX.Element {
        const { status } = this.props.scanStoreData;
        if (status === ScanStatus.Failed) {
            return this.renderLayout(null, null, this.renderDeviceDisconnected());
        } else if (status === ScanStatus.Completed) {
            const { unifiedScanResultStoreData, cardSelectionStoreData, deps } = this.props;
            const { rules, results, toolInfo } = unifiedScanResultStoreData;
            const cardSelectionViewData = deps.getCardSelectionViewData(
                cardSelectionStoreData,
                unifiedScanResultStoreData,
                deps.isResultHighlightUnavailable,
            );
            const cardsViewData = deps.getCardsViewData(rules, results, cardSelectionViewData);
            deps.toolData = toolInfo;
            const highlightedResultUids = Object.keys(
                cardSelectionViewData.resultsHighlightStatus,
            ).filter(uid => cardSelectionViewData.resultsHighlightStatus[uid] === 'visible');
            const screenshotViewModel = deps.screenshotViewModelProvider(
                unifiedScanResultStoreData,
                highlightedResultUids,
            );

            const scanMetadata: ScanMetadata = {
                timestamp: unifiedScanResultStoreData.timestamp,
                toolData: unifiedScanResultStoreData.toolInfo,
                targetAppInfo: this.props.unifiedScanResultStoreData.targetAppInfo,
                deviceName: this.props.unifiedScanResultStoreData.platformInfo.deviceName,
            };

            return this.renderLayout(
                cardsViewData,
                scanMetadata,
                this.renderResults(cardsViewData, scanMetadata),
                <ScreenshotView viewModel={screenshotViewModel} />,
            );
        } else {
            return this.renderLayout(null, null, this.renderScanningSpinner());
        }
    }

    private renderLayout(
        cardsViewData: CardsViewModel,
        scanMetadata: ScanMetadata,
        primaryContent: JSX.Element,
        optionalSidePanel?: JSX.Element,
    ): JSX.Element {
        return (
            <div
                className={styles.automatedChecksView}
                data-automation-id={automatedChecksViewAutomationId}
            >
                <TitleBar
                    deps={this.props.deps}
                    pageTitle={'Automated checks'}
                    windowStateStoreData={this.props.windowStateStoreData}
                ></TitleBar>
                <div className={styles.automatedChecksPanelLayout}>
                    <div className={styles.mainContentWrapper}>
                        <CommandBar
                            deps={this.props.deps}
                            scanPort={this.getScanPort()}
                            scanStoreData={this.props.scanStoreData}
                            featureFlagStoreData={this.props.featureFlagStoreData}
                            cardsViewData={cardsViewData}
                            scanMetadata={scanMetadata}
                        />
                        <main>
                            <HeaderSection />
                            {primaryContent}
                        </main>
                    </div>
                    {optionalSidePanel}
                </div>
                <SettingsPanel
                    layerClassName={styles.settingsPanelLayerHost}
                    deps={this.props.deps}
                    isOpen={this.props.detailsViewStoreData.currentPanel.isSettingsOpen}
                    featureFlagData={{}}
                    userConfigStoreState={this.props.userConfigurationStoreData}
                />
            </div>
        );
    }

    private getConnectedDeviceName(): string {
        return this.props.androidSetupStoreData.selectedDevice?.friendlyName;
    }

    private getScanPort(): number {
        return this.props.androidSetupStoreData.scanPort;
    }

    private renderDeviceDisconnected(): JSX.Element {
        return (
            <DeviceDisconnectedPopup
                deviceName={this.getConnectedDeviceName()}
                onConnectNewDevice={() =>
                    this.props.deps.windowStateActionCreator.setRoute({
                        routeId: 'deviceConnectView',
                    })
                }
                onRescanDevice={() => this.props.deps.scanActionCreator.scan(this.getScanPort())}
            />
        );
    }

    private renderScanningSpinner(): JSX.Element {
        return (
            <ScanningSpinner
                isSpinning={this.props.scanStoreData.status === ScanStatus.Scanning}
                label="Scanning..."
                aria-live="assertive"
            />
        );
    }

    private renderResults(cardsViewData: CardsViewModel, scanMetadata: ScanMetadata): JSX.Element {
        return (
            <CardsView
                deps={this.props.deps}
                scanMetadata={scanMetadata}
                userConfigurationStoreData={this.props.userConfigurationStoreData}
                cardsViewData={cardsViewData}
            />
        );
    }
}
