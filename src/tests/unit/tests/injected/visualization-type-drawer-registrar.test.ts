// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { VisualizationType } from 'common/types/visualization-type';
import {
    RegisterDrawer,
    VisualizationTypeDrawerRegistrar,
} from 'injected/visualization-type-drawer-registrar';
import { Drawer } from 'injected/visualization/drawer';
import { DrawerProvider } from 'injected/visualization/drawer-provider';
import { IMock, Mock } from 'typemoq';

describe('VisualizationTypeDrawerRegistrar', () => {
    let registerDrawerMock: IMock<RegisterDrawer>;
    let visualizationConfigFactoryMock: IMock<VisualizationConfigurationFactory>;
    let assessmentProviderMock: IMock<AssessmentsProvider>;
    let drawerProviderMock: IMock<DrawerProvider>;
    let testSubject: VisualizationTypeDrawerRegistrar;
    let typeStub: VisualizationType;
    let configMock: IMock<VisualizationConfiguration>;
    let identifierStub: string;
    let drawerStub: Drawer;

    beforeEach(() => {
        registerDrawerMock = Mock.ofType<RegisterDrawer>();
        visualizationConfigFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        assessmentProviderMock = Mock.ofType<AssessmentsProvider>();
        drawerProviderMock = Mock.ofType<DrawerProvider>();
        typeStub = -1;
        configMock = Mock.ofType<VisualizationConfiguration>();
        identifierStub = 'some id';
        drawerStub = {} as Drawer;

        testSubject = new VisualizationTypeDrawerRegistrar(
            registerDrawerMock.object,
            visualizationConfigFactoryMock.object,
            assessmentProviderMock.object,
            drawerProviderMock.object,
        );
    });

    test('registerDrawer: non-assessment type', () => {
        visualizationConfigFactoryMock
            .setup(mock => mock.getConfiguration(typeStub))
            .returns(() => configMock.object);
        assessmentProviderMock.setup(mock => mock.isValidType(typeStub)).returns(() => false);
        configMock.setup(mock => mock.getIdentifier()).returns(() => identifierStub);
        configMock
            .setup(mock => mock.getDrawer(drawerProviderMock.object))
            .returns(() => drawerStub);
        registerDrawerMock.setup(mock => mock(identifierStub, drawerStub)).verifiable();

        testSubject.registerType(typeStub);

        registerDrawerMock.verifyAll();
    });

    test('registerDrawer: assessment type', () => {
        const requirementStub = {
            key: 'some key',
        } as Requirement;
        const requirementStubTwo = {
            key: 'some other key',
        } as Requirement;
        const stepMapStub = {
            [requirementStub.key]: requirementStub,
            [requirementStubTwo.key]: requirementStubTwo,
        };
        const secondIdentifierStub = 'some other id';

        visualizationConfigFactoryMock
            .setup(mock => mock.getConfiguration(typeStub))
            .returns(() => configMock.object);
        assessmentProviderMock.setup(mock => mock.isValidType(typeStub)).returns(() => true);
        assessmentProviderMock.setup(mock => mock.getStepMap(typeStub)).returns(() => stepMapStub);
        configMock
            .setup(mock => mock.getIdentifier(requirementStub.key))
            .returns(() => identifierStub);
        configMock
            .setup(mock => mock.getIdentifier(requirementStubTwo.key))
            .returns(() => secondIdentifierStub);
        configMock
            .setup(mock => mock.getDrawer(drawerProviderMock.object, identifierStub))
            .returns(() => drawerStub);
        configMock
            .setup(mock => mock.getDrawer(drawerProviderMock.object, secondIdentifierStub))
            .returns(() => drawerStub);
        registerDrawerMock.setup(mock => mock(identifierStub, drawerStub)).verifiable();
        registerDrawerMock.setup(mock => mock(secondIdentifierStub, drawerStub)).verifiable();

        testSubject.registerType(typeStub);

        registerDrawerMock.verifyAll();
    });
});
