// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IRenderFunction } from '@uifabric/utilities';
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { InstanceTableHeaderType, InstanceTableRow } from 'assessments/types/instance-table-data';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { has } from 'lodash';
import {
    CheckboxVisibility,
    ConstrainMode,
    DetailsList,
    IColumn,
    IDetailsRowProps,
    IObjectWithKey,
} from 'office-ui-fabric-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';

import { ManualTestStatus } from '../../common/types/manual-test-status';
import {
    AssessmentNavState,
    GeneratedAssessmentInstance,
    UserCapturedInstance,
} from '../../common/types/store-data/assessment-result-data';
import { DictionaryStringTo } from '../../types/common-types';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';

export const passUnmarkedInstancesButtonAutomationId =
    'assessment-instance-table-pass-unmarked-instances-button';

export interface AssessmentInstanceTableProps {
    instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>;
    assessmentNavState: AssessmentNavState;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    instanceTableHeaderType: InstanceTableHeaderType;
    getDefaultMessage: Function;
    assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
    hasVisualHelper: boolean;
}

export interface CapturedInstanceRowData extends IObjectWithKey {
    instance: UserCapturedInstance;
    instanceActionButtons: JSX.Element;
}

export class AssessmentInstanceTable extends React.Component<AssessmentInstanceTableProps> {
    public render(): JSX.Element {
        if (this.props.instancesMap == null) {
            return (
                <Spinner
                    className="details-view-spinner"
                    size={SpinnerSize.large}
                    label={'Scanning'}
                />
            );
        }

        const items: InstanceTableRow[] =
            this.props.assessmentInstanceTableHandler.createAssessmentInstanceTableItems(
                this.props.instancesMap,
                this.props.assessmentNavState,
                this.props.hasVisualHelper,
            );

        const columns: IColumn[] = this.props.assessmentInstanceTableHandler.getColumnConfigs(
            this.props.instancesMap,
            this.props.assessmentNavState,
            this.props.hasVisualHelper,
        );

        const getDefaultMessage = this.props.getDefaultMessage(
            this.props.assessmentDefaultMessageGenerator,
        );
        const defaultMessageComponent = getDefaultMessage(
            this.props.instancesMap,
            this.props.assessmentNavState.selectedTestSubview,
        );

        if (defaultMessageComponent) {
            return defaultMessageComponent.message;
        }

        return (
            <div>
                {this.renderInstanceTableHeader(items)}
                <DetailsList
                    ariaLabelForGrid="Use arrow keys to navigate inside the instances grid"
                    items={items}
                    columns={columns}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    constrainMode={ConstrainMode.horizontalConstrained}
                    onRenderRow={this.renderRow}
                    onItemInvoked={this.onItemInvoked}
                />
            </div>
        );
    }

    public onItemInvoked = (item: InstanceTableRow): void => {
        this.updateFocusedTarget(item);
    };

    public renderRow = (
        props: IDetailsRowProps,
        defaultRender: IRenderFunction<IDetailsRowProps>,
    ): JSX.Element => {
        return (
            <div onClick={() => this.updateFocusedTarget(props.item)}>{defaultRender(props)}</div>
        );
    };

    public updateFocusedTarget = (item: InstanceTableRow): void => {
        this.props.assessmentInstanceTableHandler.updateFocusedTarget(item.instance.target);
    };

    private renderInstanceTableHeader(items: InstanceTableRow[]): JSX.Element {
        if (this.props.instanceTableHeaderType === 'none') {
            return null;
        }

        const disabled = !this.isAnyInstanceStatusUnknown(
            items,
            this.props.assessmentNavState.selectedTestSubview,
        );

        return (
            <InsightsCommandButton
                data-automation-id={passUnmarkedInstancesButtonAutomationId}
                iconProps={{ iconName: 'skypeCheck' }}
                onClick={this.onPassUnmarkedInstances}
                disabled={disabled}
            >
                Pass unmarked instances
            </InsightsCommandButton>
        );
    }

    private isAnyInstanceStatusUnknown(items: InstanceTableRow[], step: string): boolean {
        return items.some(
            item =>
                has(item.instance.testStepResults, step) &&
                item.instance.testStepResults[step].status === ManualTestStatus.UNKNOWN,
        );
    }

    protected onPassUnmarkedInstances = (): void => {
        this.props.assessmentInstanceTableHandler.passUnmarkedInstances(
            this.props.assessmentNavState.selectedTestType,
            this.props.assessmentNavState.selectedTestSubview,
        );
    };
}
