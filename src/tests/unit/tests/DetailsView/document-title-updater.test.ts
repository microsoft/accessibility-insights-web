// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { ITabStoreData } from '../../../../common/types/store-data/itab-store-data';
import { title } from '../../../../content/strings/application';
import {
    DetailsRightPanelConfiguration,
    GetDetailsRightPanelConfigurationProps,
} from '../../../../DetailsView/components/details-view-right-panel';
import { DocumentTitleUpdater } from '../../../../DetailsView/document-title-updater';
import { GetTestViewTitleProps } from '../../../../DetailsView/handlers/get-document-title';
import { SelectedDetailsViewProvider } from '../../../../DetailsView/handlers/selected-details-view-provider';
import { StoreMocks } from './store-mocks';

describe('DocumentTitleUpdater', () => {
    let storeMocks: StoreMocks;
    let testObject: DocumentTitleUpdater;
    let getPanelConfigMock: IMock<((props: GetDetailsRightPanelConfigurationProps) => DetailsRightPanelConfiguration)>;
    let visualizationConfigFactoryMock: IMock<VisualizationConfigurationFactory>;
    let selectedDetailsViewHelperMock: IMock<SelectedDetailsViewProvider>;
    let doc;
    let onStoreChange: () => void;

    beforeEach(() => {
        storeMocks = new StoreMocks();
        getPanelConfigMock = Mock.ofInstance((props: GetDetailsRightPanelConfigurationProps) => null);
        visualizationConfigFactoryMock = Mock.ofType(VisualizationConfigurationFactory);
        selectedDetailsViewHelperMock = Mock.ofType(SelectedDetailsViewProvider);
        doc = {
            title: null,
        };
        testObject = new DocumentTitleUpdater(
            storeMocks.tabStoreMock.object,
            storeMocks.detailsViewStoreMock.object,
            storeMocks.visualizationStoreMock.object,
            storeMocks.assessmentStoreMock.object,
            getPanelConfigMock.object,
            visualizationConfigFactoryMock.object,
            selectedDetailsViewHelperMock.object,
            doc,
        );
        setupStoreListenersAdded();
    });

    test('initialize', () => {
        expect(testObject).toBeDefined();
        testObject.initialize();
        storeMocks.verifyAll();
    });

    test('no selected view', () => {
        selectedDetailsViewHelperMock
            .setup(s => s.getSelectedDetailsView(It.isAny()))
            .returns(() => null)
            .verifiable(Times.once());
        setupStoreGetState();

        testObject.initialize();
        onStoreChange();

        expect(doc.title).toEqual(title);
        selectedDetailsViewHelperMock.verifyAll();
    });

    test('no detailsViewStore data', () => {
        selectedDetailsViewHelperMock
            .setup(s => s.getSelectedDetailsView(It.isAny()))
            .returns(() => -1)
            .verifiable(Times.once());
        storeMocks.setDetailsViewStoreData(null);
        setupStoreGetState();

        testObject.initialize();
        onStoreChange();

        expect(doc.title).toEqual(title);
        selectedDetailsViewHelperMock.verifyAll();
    });

    test('no tabStore data', () => {
        selectedDetailsViewHelperMock
            .setup(s => s.getSelectedDetailsView(It.isAny()))
            .returns(() => -1)
            .verifiable(Times.once());
        storeMocks.setTabStoreData(null);
        setupStoreGetState();

        testObject.initialize();
        onStoreChange();

        expect(doc.title).toEqual(title);
        selectedDetailsViewHelperMock.verifyAll();
    });

    test('tab is closed', () => {
        selectedDetailsViewHelperMock
            .setup(s => s.getSelectedDetailsView(It.isAny()))
            .returns(() => -1)
            .verifiable(Times.once());
        storeMocks.setTabStoreData({ isClosed: true } as ITabStoreData);
        setupStoreGetState();

        testObject.initialize();
        onStoreChange();

        expect(doc.title).toEqual(title);
        selectedDetailsViewHelperMock.verifyAll();
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
        selectedDetailsViewHelperMock
            .setup(s => s.getSelectedDetailsView(It.isAny()))
            .returns(() => selectedDetailsView)
            .verifiable(Times.once());
        setupStoreGetState();

        getPanelConfigMock
            .setup(g => g(It.isAny()))
            .returns(() => {
                return {GetTitle: getTitleMock.object} as DetailsRightPanelConfiguration;
            });

        testObject.initialize();
        onStoreChange();

        expect(doc.title).toEqual(`Test Title - ${title}`);
        selectedDetailsViewHelperMock.verifyAll();
        getTitleMock.verifyAll();
        getPanelConfigMock.verifyAll();
    });

    function setupStoreListenersAdded() {
        storeMocks.tabStoreMock
            .setup(store => store.addChangedListener(It.isAny()))
            .callback(cb => onStoreChange = cb)
            .verifiable();
        storeMocks.detailsViewStoreMock
            .setup(store => store.addChangedListener(It.isAny()))
            .callback(cb => onStoreChange = cb)
            .verifiable();
        storeMocks.visualizationStoreMock
            .setup(store => store.addChangedListener(It.isAny()))
            .callback(cb => onStoreChange = cb)
            .verifiable();
        storeMocks.assessmentStoreMock
            .setup(store => store.addChangedListener(It.isAny()))
            .callback(cb => onStoreChange = cb)
            .verifiable();
    }

    function setupStoreGetState() {
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
