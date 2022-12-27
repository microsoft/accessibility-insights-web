// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InitialVisualizationStoreDataGenerator } from 'background/initial-visualization-store-data-generator';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';

import { EnumHelper } from 'common/enum-helper';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { IMock, Mock } from 'typemoq';

describe('InitialVisualizationStoreDataGenerator.generateInitialState', () => {
    let defaultState: VisualizationStoreData;
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let generator: InitialVisualizationStoreDataGenerator;
    const visualizationTypes = EnumHelper.getNumericValues(VisualizationType);
    const visualizationConfigurationStub = (test: number, testMode: string) => {
        return {
            key: `type-${test}`,
            testMode: testMode,
        } as VisualizationConfiguration;
    };
    const typeToTestModeMap = visualizationTypes.map(vt =>
        vt < 5 ? 'adhoc' : vt > 10 ? 'assessments' : 'mediumPass',
    );

    beforeEach(() => {
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        visualizationTypes.forEach((type: VisualizationType, index: number) => {
            visualizationConfigurationFactoryMock
                .setup(vcf => vcf.getConfiguration(type))
                .returns(() => visualizationConfigurationStub(type, typeToTestModeMap[index]));
        });

        generator = new InitialVisualizationStoreDataGenerator(
            visualizationConfigurationFactoryMock.object,
        );
        defaultState = generator.generateInitialState();
    });

    it('generates the pinned default state when no persistedData is provided', () => {
        expect(defaultState).toMatchSnapshot();
    });

    it.each([true, false])(
        'overwrites empty state.tests if persistedState.tests has data when persistedState.tests.mediumPass has data is %s',
        (hasMediumPassData: boolean) => {
            const persistedTests = hasMediumPassData
                ? {
                      adhoc: {},
                      assessments: {},
                      mediumPass: {},
                  }
                : { adhoc: {}, assessments: {} };
            const generatedState = generator.generateInitialState({
                tests: persistedTests,
            } as VisualizationStoreData);
            expect(generatedState.tests).toMatchSnapshot();
        },
    );

    it.each([[undefined], [null]])(
        'returns default state.tests when persistedState is %p',
        persistedTests => {
            const generatedState = generator.generateInitialState(persistedTests);

            expect(generatedState.tests).toEqual(defaultState.tests);
        },
    );

    it('does not overwrite other persisted data', () => {
        const generatedState = generator.generateInitialState({
            injectingStarted: true,
        } as VisualizationStoreData);

        expect(generatedState.injectingStarted).toEqual(true);
    });
});
