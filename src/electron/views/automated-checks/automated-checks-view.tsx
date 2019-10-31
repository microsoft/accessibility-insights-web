// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanningSpinner } from 'common/components/scanning-spinner/scanning-spinner';
import { GetCardSelectionViewData } from 'common/get-card-selection-view-data';
import { GetUnifiedRuleResultsDelegate } from 'common/rule-based-view-model-provider';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { CardsView, CardsViewDeps } from 'DetailsView/components/cards-view';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { TitleBar, TitleBarDeps } from 'electron/views/automated-checks/components/title-bar';
import { mainContentWrapper } from 'electron/views/device-connect-view/device-connect-view.scss';
import { DeviceDisconnectedPopup } from 'electron/views/device-disconnected-popup/device-disconnected-popup';
import { ScreenshotView } from 'electron/views/screenshot/screenshot-view';
import * as React from 'react';

import { automatedChecksView, resultsAndScreenshot, screenshotView } from './automated-checks-view.scss';
import { CommandBar, CommandBarDeps } from './components/command-bar';
import { HeaderSection } from './components/header-section';

export type AutomatedChecksViewDeps = CommandBarDeps &
    TitleBarDeps &
    CardsViewDeps & {
        scanActionCreator: ScanActionCreator;
        windowStateActionCreator: WindowStateActionCreator;
        getUnifiedRuleResultsDelegate: GetUnifiedRuleResultsDelegate;
        getCardSelectionViewData: GetCardSelectionViewData;
    };

export type AutomatedChecksViewProps = {
    deps: AutomatedChecksViewDeps;
    scanStoreData: ScanStoreData;
    deviceStoreData: DeviceStoreData;
    windowStateStoreData: WindowStateStoreData;
    userConfigurationStoreData: UserConfigurationStoreData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    cardSelectionStoreData: CardSelectionStoreData;
};

export class AutomatedChecksView extends React.Component<AutomatedChecksViewProps> {
    public componentDidMount(): void {
        this.props.deps.scanActionCreator.scan(this.props.deviceStoreData.port);
    }

    public render(): JSX.Element {
        return (
            <div className={automatedChecksView}>
                <TitleBar deps={this.props.deps} windowStateStoreData={this.props.windowStateStoreData}></TitleBar>
                <div className={resultsAndScreenshot}>
                    <div className={mainContentWrapper}>
                        <CommandBar
                            deps={this.props.deps}
                            deviceStoreData={this.props.deviceStoreData}
                            scanStoreData={this.props.scanStoreData}
                        />
                        <main>
                            <HeaderSection />
                            {this.renderScanning()}
                            {this.renderDeviceDisconnected()}
                            {this.renderResults()}
                        </main>
                    </div>
                    <div className={screenshotView}>
                        <ScreenshotView />
                    </div>
                </div>
            </div>
        );
    }

    private renderDeviceDisconnected(): JSX.Element {
        if (this.props.scanStoreData.status !== ScanStatus.Failed) {
            return null;
        }

        return (
            <DeviceDisconnectedPopup
                deviceName={this.props.deviceStoreData.connectedDevice}
                onConnectNewDevice={() => this.props.deps.windowStateActionCreator.setRoute({ routeId: 'deviceConnectView' })}
                onRescanDevice={() => this.props.deps.scanActionCreator.scan(this.props.deviceStoreData.port)}
            />
        );
    }

    private renderScanning(): JSX.Element {
        return (
            <ScanningSpinner
                isSpinning={this.props.scanStoreData.status === ScanStatus.Scanning}
                label="Scanning..."
                aria-live="assertive"
            />
        );
    }

    private renderResults(): JSX.Element {
        if (this.props.scanStoreData.status !== ScanStatus.Completed) {
            return null;
        }

        const { rules, results } = this.props.unifiedScanResultStoreData;
        const ruleResultsByStatus = this.props.deps.getUnifiedRuleResultsDelegate(
            rules,
            results,
            this.props.deps.getCardSelectionViewData(this.props.cardSelectionStoreData),
        );

        return (
            <CardsView
                deps={this.props.deps}
                targetAppInfo={this.props.unifiedScanResultStoreData.targetAppInfo}
                ruleResultsByStatus={ruleResultsByStatus}
                userConfigurationStoreData={this.props.userConfigurationStoreData}
            />
        );
    }
}
