// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnActionsMode, IColumn } from '@fluentui/react';
import { forEach } from 'lodash';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { AssessmentNavState } from '../../../../../common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../../../../DetailsView/components/assessment-instance-details-column';
import { CapturedInstanceRowData } from '../../../../../DetailsView/components/assessment-instance-table';
import { AssessmentTableColumnConfigHandler } from '../../../../../DetailsView/components/assessment-table-column-config-handler';
import { MasterCheckBoxConfigProvider } from '../../../../../DetailsView/handlers/master-checkbox-config-provider';
import {
    CreateTestAssessmentProvider,
    CreateTestAssessmentProviderAutomated,
    TestStatusChoiceColumn,
} from '../../../common/test-assessment-provider';

describe('AssessmentTableColumnConfigHandlerTest', () => {
    let masterCheckboxConfigProviderMock: IMock<MasterCheckBoxConfigProvider>;
    beforeEach(() => {
        masterCheckboxConfigProviderMock = Mock.ofType(MasterCheckBoxConfigProvider);
    });

    test('verify configurations for generated instances', () => {
        const provider = CreateTestAssessmentProvider();
        const assessment = provider.all()[0];
        const step = assessment.requirements[0];
        const navState: AssessmentNavState = {
            selectedTestType: assessment.visualizationType,
            selectedTestSubview: step.key,
        };

        const baseConfig = {
            iconName: 'iconName',
            name: 'toggle all visualization',
            ariaLabel: 'toggle all visualization',
            onColumnClick: () => null,
        };

        setConfigProvider(navState, baseConfig);

        const testObject = new AssessmentTableColumnConfigHandler(
            masterCheckboxConfigProviderMock.object,
            provider,
        );
        const actualColumns = testObject.getColumnConfigs(navState, true, true);

        assertMasterCheckBox(baseConfig, actualColumns);

        step.columnsConfig.forEach(columnConfig => {
            const actualColumnConfig = actualColumns.find(col => col.key === columnConfig.key);
            expect(actualColumnConfig).toBeDefined();
            expect(actualColumnConfig.name).toEqual(columnConfig.name);
            expect(actualColumnConfig.onRender).toEqual(columnConfig.onRender);
        });

        assertStatusChoiceGroup(actualColumns);
    });

    test('verify configurations for automated instances', () => {
        const provider = CreateTestAssessmentProviderAutomated();
        const assessment = provider.all()[0];
        const step = assessment.requirements[0];
        const navState: AssessmentNavState = {
            selectedTestType: assessment.visualizationType,
            selectedTestSubview: step.key,
        };

        const baseConfig = {
            iconName: 'iconName',
            name: 'toggle all visualization',
            ariaLabel: 'toggle all visualization',
            onColumnClick: () => null,
        };

        setConfigProvider(navState, baseConfig);

        const testObject = new AssessmentTableColumnConfigHandler(
            masterCheckboxConfigProviderMock.object,
            provider,
        );
        const actualColumns = testObject.getColumnConfigs(navState, true, true);

        expect(actualColumns.length).toBe(1);
        assertMasterCheckBox(baseConfig, actualColumns);
    });

    test('verify configurations for generated instances without visual helper', () => {
        const provider = CreateTestAssessmentProvider();
        const assessment = provider.all()[0];
        const step = assessment.requirements[0];
        const navState: AssessmentNavState = {
            selectedTestType: assessment.visualizationType,
            selectedTestSubview: step.key,
        };

        masterCheckboxConfigProviderMock
            .setup(m => m.getMasterCheckBoxProperty(It.isAny(), It.isAny()))
            .verifiable(Times.never());

        const testObject = new AssessmentTableColumnConfigHandler(
            masterCheckboxConfigProviderMock.object,
            provider,
        );
        const actualColumns = testObject.getColumnConfigs(navState, true, false);

        assertNoMasterCheckBox(actualColumns);

        step.columnsConfig.forEach(columnConfig => {
            const actualColumnConfig = actualColumns.find(col => col.key === columnConfig.key);
            expect(actualColumnConfig).toBeDefined();
            expect(actualColumnConfig.name).toEqual(columnConfig.name);
            expect(actualColumnConfig.onRender).toEqual(columnConfig.onRender);
        });

        assertStatusChoiceGroup(actualColumns);
        masterCheckboxConfigProviderMock.verifyAll();
    });

    test('verify CapturedInstancesTableConfigurations: headings static configs', () => {
        const config = new AssessmentTableColumnConfigHandler(
            null,
            null,
        ).getColumnConfigsForCapturedInstances();
        compareStaticPropertiesForCaptured(
            getExpectedCapturedHeadingInstanceTableConfigs(),
            config,
        );
    });

    test('onRenderCapturedHeadingsInstanceDetailsColumn', () => {
        const col = new AssessmentTableColumnConfigHandler(
            null,
            null,
        ).getColumnConfigsForCapturedInstances()[0];
        const onRender = col.onRender;
        const item: CapturedInstanceRowData = {
            instance: {
                id: 'id',
                description: 'comment',
            },
            instanceActionButtons: null,
        };
        const expected = (
            <AssessmentInstanceDetailsColumn
                background={'#767676'}
                headerText={'Comment:'}
                textContent={item.instance.description}
                customClassName="not-applicable"
            />
        );

        expect(onRender(item)).toEqual(expected);
    });

    function setConfigProvider(navState: AssessmentNavState, config: Partial<IColumn>): void {
        masterCheckboxConfigProviderMock
            .setup(m => m.getMasterCheckBoxProperty(navState, true))
            .returns(() => config)
            .verifiable();
    }

    function getExpectedCapturedHeadingInstanceTableConfigs(): IColumn[] {
        return [
            {
                key: 'failureDescription',
                name: 'Failure description',
                fieldName: 'description',
                minWidth: 200,
                maxWidth: 400,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.disabled,
            },
            {
                key: 'instanceActionButtons',
                name: 'instance actions',
                fieldName: 'instanceActionButtons',
                minWidth: 100,
                maxWidth: 100,
                isResizable: false,
                columnActionsMode: ColumnActionsMode.disabled,
            },
        ];
    }

    function compareStaticPropertiesForCaptured(expected: IColumn[], actual: IColumn[]): void {
        expect(actual.length).toBe(expected.length);
        expected.forEach((col: IColumn, index: number) => {
            expect(actual[index].key).toBe(col.key);
            expect(actual[index].fieldName).toBe(col.fieldName);
            expect(actual[index].minWidth).toBe(col.minWidth);
            expect(actual[index].maxWidth).toBe(col.maxWidth);
            expect(actual[index].isResizable).toBe(col.isResizable);

            if (col.key !== 'visualizationButton' && col.key !== 'instanceDetails') {
                expect(actual[index].name).toBe(col.name);
                expect(actual[index].columnActionsMode).toBe(col.columnActionsMode);
            }
        });
    }

    function assertMasterCheckBox(baseConfig: Partial<IColumn>, config: IColumn[]): void {
        const expectedConfig = {
            ...AssessmentTableColumnConfigHandler.baseMasterCheckboxColumn,
            ...baseConfig,
        };

        const masterCheckboxConfig = config.find(
            col => col.key === AssessmentTableColumnConfigHandler.MASTER_CHECKBOX_KEY,
        );
        assertColumn(expectedConfig, masterCheckboxConfig, 'master checkbox config');
    }

    function assertNoMasterCheckBox(config: IColumn[]): void {
        const masterCheckboxConfig = config.find(
            col => col.key === AssessmentTableColumnConfigHandler.MASTER_CHECKBOX_KEY,
        );
        expect(masterCheckboxConfig).toBeUndefined();
    }

    function assertColumn(
        expectedColumn: Partial<IColumn>,
        actualColumn: Partial<IColumn>,
        messagePrefix?: string,
    ): void {
        forEach(expectedColumn, (expectedValue, expectedName) => {
            expect(actualColumn[expectedName]).toBe(expectedValue);
        });
    }

    function assertStatusChoiceGroup(actualColumns: IColumn[]): void {
        const expectedColumn = TestStatusChoiceColumn;

        const actualColumn = actualColumns.find(col => col.key === expectedColumn.key);

        assertColumn(expectedColumn, actualColumn, 'status choice group');
    }
});
