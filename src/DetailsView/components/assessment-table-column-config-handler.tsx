// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColumnActionsMode, IColumn } from '@fluentui/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import * as React from 'react';
import { AssessmentNavState } from '../../common/types/store-data/assessment-result-data';
import { MasterCheckBoxConfigProvider } from '../handlers/master-checkbox-config-provider';
import { AssessmentInstanceDetailsColumn } from './assessment-instance-details-column';
import { CapturedInstanceRowData } from './assessment-instance-table';

export class AssessmentTableColumnConfigHandler {
    public static readonly MASTER_CHECKBOX_KEY: string = 'visualizationButton';
    public static readonly baseMasterCheckboxColumn: Readonly<IColumn> = {
        key: AssessmentTableColumnConfigHandler.MASTER_CHECKBOX_KEY,
        isIconOnly: true,
        fieldName: AssessmentTableColumnConfigHandler.MASTER_CHECKBOX_KEY,
        minWidth: 20,
        maxWidth: 20,
        isResizable: false,
        iconName: undefined,
        name: '',
        ariaLabel: undefined,
        onColumnClick: () => undefined,
    };

    private masterCheckBoxConfigProvider: MasterCheckBoxConfigProvider;
    private assessmentProvider: AssessmentsProvider;

    private readonly defaultCapturedInstanceTableColumnConfigs: IColumn[] = [
        {
            key: 'failureDescription',
            name: 'Failure description',
            fieldName: 'description',
            minWidth: 200,
            maxWidth: 400,
            isResizable: true,
            onRender: this.onRenderCapturedInstanceDetailsColumn,
            columnActionsMode: ColumnActionsMode.disabled,
        },
        {
            key: 'instanceActionButtons',
            name: 'instance actions',
            isIconOnly: true,
            fieldName: 'instanceActionButtons',
            minWidth: 100,
            maxWidth: 100,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
        },
    ];

    constructor(
        masterCheckBoxConfigProvider: MasterCheckBoxConfigProvider,
        assessmentProvider: AssessmentsProvider,
    ) {
        this.masterCheckBoxConfigProvider = masterCheckBoxConfigProvider;
        this.assessmentProvider = assessmentProvider;
    }

    public getColumnConfigs(
        assessmentNavState: AssessmentNavState,
        allEnabled: boolean,
        hasVisualHelper: boolean,
    ): IColumn[] {
        let allColumns: IColumn[] = [];
        const stepConfig = this.assessmentProvider.getStep(
            assessmentNavState.selectedTestType,
            assessmentNavState.selectedTestSubview,
        )!;

        if (hasVisualHelper) {
            const masterCheckbox = this.getMasterCheckboxColumn(assessmentNavState, allEnabled);
            allColumns.push(masterCheckbox);
        }

        const customColumns = this.getCustomColumns(assessmentNavState);
        allColumns = allColumns.concat(customColumns);

        const statusColumns = stepConfig.getInstanceStatusColumns!();
        allColumns = allColumns.concat(statusColumns);

        return allColumns;
    }

    public getColumnConfigsForCapturedInstances(): IColumn[] {
        return this.defaultCapturedInstanceTableColumnConfigs;
    }

    private getCustomColumns(assessmentNavState: AssessmentNavState): IColumn[] {
        const stepConfig = this.assessmentProvider.getStep(
            assessmentNavState.selectedTestType,
            assessmentNavState.selectedTestSubview,
        )!;

        const customColumns =
            stepConfig.columnsConfig?.map(columnConfig => {
                const column: IColumn = {
                    key: columnConfig.key,
                    name: columnConfig.name,
                    onRender: columnConfig.onRender,
                    fieldName: 'this does not matter as we are using onRender function',
                    minWidth: 200,
                    maxWidth: 400,
                    isResizable: true,
                };

                return column;
            }) ?? [];

        return customColumns;
    }

    private getMasterCheckboxColumn(
        assessmentNavState: AssessmentNavState,
        allEnabled: boolean,
    ): IColumn {
        const masterCheckBoxConfig = this.masterCheckBoxConfigProvider.getMasterCheckBoxProperty(
            assessmentNavState,
            allEnabled,
        );

        const buttonConfig: IColumn = {
            ...AssessmentTableColumnConfigHandler.baseMasterCheckboxColumn,
            ...masterCheckBoxConfig,
        };

        return buttonConfig;
    }

    private onRenderCapturedInstanceDetailsColumn(item: CapturedInstanceRowData): JSX.Element {
        const headerText = item.instance.description ? 'Comment:' : 'Path:';
        const textContent = item.instance.description
            ? item.instance.description
            : item.instance.selector!;
        return (
            <AssessmentInstanceDetailsColumn
                background={'#767676'}
                textContent={textContent}
                headerText={headerText}
                tooltipId={item.instance.id!}
                customClassName="not-applicable"
            />
        );
    }
}
