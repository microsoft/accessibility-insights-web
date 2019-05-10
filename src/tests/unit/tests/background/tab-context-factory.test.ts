// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { AssessmentsProviderImpl } from '../../../../assessments/assessments-provider';
import { BrowserAdapter } from '../../../../background/browser-adapters/browser-adapter';
import { InjectorAdapter } from '../../../../background/browser-adapters/injector-adapter';
import { NotificationAdapter } from '../../../../background/browser-adapters/notification-adapter';
import { DetailsViewController } from '../../../../background/details-view-controller';
import { Interpreter } from '../../../../background/interpreter';
import { AssessmentStore } from '../../../../background/stores/assessment-store';
import { DetailsViewStore } from '../../../../background/stores/details-view-store';
import { DevToolStore } from '../../../../background/stores/dev-tools-store';
import { InspectStore } from '../../../../background/stores/inspect-store';
import { TabStore } from '../../../../background/stores/tab-store';
import { VisualizationScanResultStore } from '../../../../background/stores/visualization-scan-result-store';
import { VisualizationStore } from '../../../../background/stores/visualization-store';
import { TabContext } from '../../../../background/tab-context';
import { TabContextFactory } from '../../../../background/tab-context-factory';
import { TargetTabController } from '../../../../background/target-tab-controller';
import { TelemetryEventHandler } from '../../../../background/telemetry/telemetry-event-handler';
import {
    VisualizationConfiguration,
    VisualizationConfigurationFactory,
} from '../../../../common/configs/visualization-configuration-factory';
import { Messages } from '../../../../common/messages';
import { StoreNames } from '../../../../common/stores/store-names';
import { StoreUpdateMessage } from '../../../../common/types/store-update-message';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { WindowUtils } from '../../../../common/window-utils';

function getConfigs(visualizationType: VisualizationType): VisualizationConfiguration {
    return new VisualizationConfigurationFactory().getConfiguration(visualizationType);
}

describe('TabContextFactoryTest', () => {
    let detailsViewControllerMock: IMock<DetailsViewController>;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let injectorAdapterMock: IMock<InjectorAdapter>;
    let notificationAdapterMock: IMock<NotificationAdapter>;

    beforeAll(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        injectorAdapterMock = Mock.ofType<InjectorAdapter>();
        notificationAdapterMock = Mock.ofType<NotificationAdapter>();

        detailsViewControllerMock = Mock.ofType<DetailsViewController>();
        browserAdapterMock.reset();
    });

    it('createInterpreter', () => {
        const tabId = -1;
        const windowUtilsStub = Mock.ofType(WindowUtils);
        const broadcastMock = Mock.ofInstance(message => {}, MockBehavior.Strict);
        const telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler);
        const targetTabControllerMock = Mock.ofType(TargetTabController);
        const assessmentStore = Mock.ofType(AssessmentStore);
        const assessmentProvider = Mock.ofType(AssessmentsProviderImpl);

        const storeNames: StoreNames[] = [
            StoreNames.VisualizationScanResultStore,
            StoreNames.VisualizationStore,
            StoreNames.TabStore,
            StoreNames.DevToolsStore,
            StoreNames.DetailsViewStore,
            StoreNames.InspectStore,
        ];

        storeNames.forEach(storeName => {
            broadcastMock
                .setup(bm => bm(It.isObjectWith({ storeId: StoreNames[storeName] } as StoreUpdateMessage<any>)))
                .verifiable(Times.once());
        });

        browserAdapterMock.setup(ba => ba.addListenerToTabsOnRemoved(It.isAny())).verifiable();
        browserAdapterMock.setup(ba => ba.addListenerToTabsOnUpdated(It.isAny())).verifiable();

        const visualizationConfigurationFactoryMock = Mock.ofType(VisualizationConfigurationFactory);
        visualizationConfigurationFactoryMock.setup(vcfm => vcfm.getConfiguration(It.isAny())).returns(theType => getConfigs(theType));

        const testObject = new TabContextFactory(
            visualizationConfigurationFactoryMock.object,
            telemetryEventHandlerMock.object,
            windowUtilsStub.object,
            targetTabControllerMock.object,
            assessmentStore.object,
            assessmentProvider.object,
        );

        const tabContext = testObject.createTabContext(
            broadcastMock.object,
            browserAdapterMock.object,
            injectorAdapterMock.object,
            notificationAdapterMock.object,
            detailsViewControllerMock.object,
            tabId,
        );

        broadcastMock.verifyAll();
        broadcastMock.reset();

        broadcastMock
            .setup(bm => bm(It.isObjectWith({ storeId: StoreNames[StoreNames.VisualizationScanResultStore] } as StoreUpdateMessage<any>)))
            .verifiable(Times.once());

        tabContext.interpreter.interpret({
            messageType: Messages.Visualizations.State.GetCurrentVisualizationResultState,
            tabId: null,
        });

        broadcastMock.verifyAll();
        expect(tabContext).toBeInstanceOf(TabContext);
        expect(tabContext.interpreter).toBeInstanceOf(Interpreter);
        expect(tabContext.stores.visualizationStore).toBeInstanceOf(VisualizationStore);
        expect(tabContext.stores.tabStore).toBeInstanceOf(TabStore);
        expect(tabContext.stores.visualizationScanResultStore).toBeInstanceOf(VisualizationScanResultStore);
        expect(tabContext.stores.devToolStore).toBeInstanceOf(DevToolStore);
        expect(tabContext.stores.detailsViewStore).toBeInstanceOf(DetailsViewStore);
        expect(tabContext.stores.inspectStore).toBeInstanceOf(InspectStore);

        broadcastMock.verifyAll();
    });
});
