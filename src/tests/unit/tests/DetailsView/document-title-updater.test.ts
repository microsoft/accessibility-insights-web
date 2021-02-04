// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { TabStoreData } from '../../../../common/types/store-data/tab-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import {
    DetailsRightPanelConfiguration,
    GetDetailsRightPanelConfigurationProps,
} from '../../../../DetailsView/components/details-view-right-panel';
import {
    DetailsViewSwitcherNavConfiguration,
    GetDetailsSwitcherNavConfiguration,
} from '../../../../DetailsView/components/details-view-switcher-nav';
import { GetSelectedDetailsViewProps } from '../../../../DetailsView/components/left-nav/get-selected-details-view';
import { DocumentTitleUpdater } from '../../../../DetailsView/document-title-updater';
import { GetTestViewTitleProps } from '../../../../DetailsView/handlers/get-document-title';
import { StoreMocks } from './store-mocks';

describe('DocumentTitleUpdater', () => {
    let storeMocks: StoreMocks;
    let testObject: DocumentTitleUpdater;
    let getPanelConfigMock: IMock<
        (props: GetDetailsRightPanelConfigurationProps) => DetailsRightPanelConfiguration
    >;
    let getSwitcherNavConfigMock: IMock<GetDetailsSwitcherNavConfiguration>;
    let visualizationConfigFactoryMock: IMock<VisualizationConfigurationFactory>;
    let doc;
    let onStoreChange: () => void;
    let switcherNavConfigStub: DetailsViewSwitcherNavConfiguration;
    let getSelectedDetailsViewMock: IMock<
        (props: GetSelectedDetailsViewProps) => VisualizationType
    >;

    beforeEach(() => {
        storeMocks = new StoreMocks();
        getPanelConfigMock = Mock.ofInstance(
            (props: GetDetailsRightPanelConfigurationProps) => null,
        );
        getSelectedDetailsViewMock = Mock.ofInstance(
            (props: GetSelectedDetailsViewProps) => null,
            MockBehavior.Strict,
        );
        getSwitcherNavConfigMock = Mock.ofInstance(_ => null, MockBehavior.Strict);
        visualizationConfigFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();

        switcherNavConfigStub = {
            getSelectedDetailsView: getSelectedDetailsViewMock.object,
        } as DetailsViewSwitcherNavConfiguration;

        doc = {
            title: null,
        };

        testObject = new DocumentTitleUpdater(
            storeMocks.tabStoreMock.object,
            storeMocks.detailsViewStoreMock.object,
            storeMocks.visualizationStoreMock.object,
            storeMocks.assessmentStoreMock.object,
            getPanelConfigMock.object,
            getSwitcherNavConfigMock.object,
            visualizationConfigFactoryMock.object,
            doc,
        );
        setupStoreListenersAdded();
    });

    test('initialize', () => {
        expect(testObject).toBeDefined();
        testObject.initialize();
        storeMocks.verifyAll();
    });

    test('no detailsViewStore data', () => {
        storeMocks.setDetailsViewStoreData(null);
        setupStoreGetState();

        testObject.initialize();
        onStoreChange();

        expect(doc.title).toEqual(title);
    });

    test('no tabStore data', () => {
        storeMocks.setTabStoreData(null);
        setupStoreGetState();

        testObject.initialize();
        onStoreChange();

        expect(doc.title).toEqual(title);
    });

    test('tab is closed', () => {
        storeMocks.setTabStoreData({ isClosed: true } as TabStoreData);
        setupStoreGetState();

        testObject.initialize();
        onStoreChange();

        expect(doc.title).toEqual(title);
    });

    test('get title from configuration', () => {
        const getTitleMock = Mock.ofInstance((props: GetTestViewTitleProps) => {});
        const selectedDetailsView = -1;
        const expectedParam = {
            visualizationConfigurationFactory: visualizationConfigFactoryMock.object,
            selectedDetailsView,
        };

        getTitleMock
            .setup(g => g(It.isValue(expectedParam)))
            .returns(() => 'Test Title')
            .verifiable();

        getSwitcherNavConfigMock
            .setup(mock =>
                mock({
                    selectedDetailsViewPivot:
                        storeMocks.visualizationStoreData.selectedDetailsViewPivot,
                }),
            )
            .returns(() => switcherNavConfigStub);

        getSelectedDetailsViewMock
            .setup(mock =>
                mock({
                    assessmentStoreData: storeMocks.assessmentStoreData,
                    visualizationStoreData: storeMocks.visualizationStoreData,
                }),
            )
            .returns(() => selectedDetailsView);

        setupStoreGetState();

        getPanelConfigMock
            .setup(g => g(It.isAny()))
            .returns(() => {
                return { GetTitle: getTitleMock.object } as DetailsRightPanelConfiguration;
            });

        testObject.initialize();
        onStoreChange();

        expect(doc.title).toEqual(`Test Title - ${title}`);
        getTitleMock.verifyAll();
        getPanelConfigMock.verifyAll();
    });

    function setupStoreListenersAdded(): void {
        storeMocks.tabStoreMock
            .setup(store => store.addChangedListener(It.isAny()))
            .callback(cb => (onStoreChange = cb))
            .verifiable();
        storeMocks.detailsViewStoreMock
            .setup(store => store.addChangedListener(It.isAny()))
            .callback(cb => (onStoreChange = cb))
            .verifiable();
        storeMocks.visualizationStoreMock
            .setup(store => store.addChangedListener(It.isAny()))
            .callback(cb => (onStoreChange = cb))
            .verifiable();
        storeMocks.assessmentStoreMock
            .setup(store => store.addChangedListener(It.isAny()))
            .callback(cb => (onStoreChange = cb))
            .verifiable();
    }

    function setupStoreGetState(): void {
        storeMocks.tabStoreMock
            .setup(store => store.getState())
            .returns(() => storeMocks.tabStoreData);
        storeMocks.detailsViewStoreMock
            .setup(store => store.getState())
            .returns(() => storeMocks.detailsViewStoreData);
        storeMocks.visualizationStoreMock
            .setup(store => store.getState())
            .returns(() => storeMocks.visualizationStoreData);
        storeMocks.assessmentStoreMock
            .setup(store => store.getState())
            .returns(() => storeMocks.assessmentStoreData);
    }
});
