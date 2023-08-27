// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { VisualizationType } from 'common/types/visualization-type';
import { Drawer } from 'injected/visualization/drawer';
import { DrawerProvider } from 'injected/visualization/drawer-provider';
import {
    RegisterDrawer,
    VisualizationTypeDrawerRegistrar,
} from 'injected/visualization-type-drawer-registrar';
import { IMock, It, Mock } from 'typemoq';

describe('VisualizationTypeDrawerRegistrar', () => {
    let registerDrawerMock: IMock<RegisterDrawer>;
    let visualizationConfigFactoryMock: IMock<VisualizationConfigurationFactory>;
    let drawerProviderMock: IMock<DrawerProvider>;
    let testSubject: VisualizationTypeDrawerRegistrar;
    let typeStub: VisualizationType;
    let configMock: IMock<VisualizationConfiguration>;
    let identifierStub: string;
    let drawerStub: Drawer;
    let requirementStub: Requirement;

    beforeEach(() => {
        registerDrawerMock = Mock.ofType<RegisterDrawer>();
        visualizationConfigFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        drawerProviderMock = Mock.ofType<DrawerProvider>();
        typeStub = -1;
        configMock = Mock.ofType<VisualizationConfiguration>();
        identifierStub = 'some id';
        drawerStub = {} as Drawer;
        requirementStub = {
            key: 'some requirement',
        } as Requirement;

        testSubject = new VisualizationTypeDrawerRegistrar(
            registerDrawerMock.object,
            visualizationConfigFactoryMock.object,
            drawerProviderMock.object,
        );
    });

    test('registerAllVisualizations: with requirement', () => {
        visualizationConfigFactoryMock
            .setup(m => m.forEachConfig(It.isAny()))
            .callback(cb => {
                cb(configMock.object, typeStub, requirementStub);
            });
        configMock
            .setup(mock => mock.getIdentifier(requirementStub.key))
            .returns(() => identifierStub);
        configMock
            .setup(mock => mock.getDrawer(drawerProviderMock.object, requirementStub.key))
            .returns(() => drawerStub);
        registerDrawerMock.setup(mock => mock(identifierStub, drawerStub)).verifiable();
        testSubject.registerAllVisualizations();

        registerDrawerMock.verifyAll();
    });

    test('registerAllVisualizations: with no requirement', () => {
        visualizationConfigFactoryMock
            .setup(m => m.forEachConfig(It.isAny()))
            .callback(cb => {
                cb(configMock.object, typeStub);
            });
        configMock.setup(mock => mock.getIdentifier(undefined)).returns(() => identifierStub);
        configMock
            .setup(mock => mock.getDrawer(drawerProviderMock.object, undefined))
            .returns(() => drawerStub);
        registerDrawerMock.setup(mock => mock(identifierStub, drawerStub)).verifiable();
        testSubject.registerAllVisualizations();

        registerDrawerMock.verifyAll();
    });
});
