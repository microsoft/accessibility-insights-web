// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind, IRenderFunction } from '@uifabric/utilities';
import { has } from 'lodash';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import {
    CheckboxVisibility,
    ConstrainMode,
    DetailsList,
    IColumn,
    IDetailsRowProps,
    IObjectWithKey,
} from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';

import { AssessmentDefaultMessageGenerator } from '../../assessments/assessment-default-message-generator';
import { ManualTestStatus } from '../../common/types/manual-test-status';
import {
    AssessmentNavState,
    IGeneratedAssessmentInstance,
    IUserCapturedInstance,
} from '../../common/types/store-data/iassessment-result-data';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';

export interface AssessmentInstanceTableProps {
    instancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance>;
    assessmentNavState: AssessmentNavState;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    renderInstanceTableHeader: (table: AssessmentInstanceTable, items: IAssessmentInstanceRowData[]) => JSX.Element;
    getDefaultMessage: Function;
    assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
    hasVisualHelper: boolean;
}

// tslint:disable-next-line:interface-name
export interface IAssessmentInstanceRowData<P = {}> extends IObjectWithKey {
    statusChoiceGroup: JSX.Element;
    visualizationButton?: JSX.Element;
    instance: IGeneratedAssessmentInstance<P>;
}

// tslint:disable-next-line:interface-name
export interface ICapturedInstanceRowData extends IObjectWithKey {
    instance: IUserCapturedInstance;
    instanceActionButtons: JSX.Element;
}

export class AssessmentInstanceTable extends React.Component<AssessmentInstanceTableProps> {
    public render(): JSX.Element {
        if (this.props.instancesMap == null) {
            return <Spinner className="details-view-spinner" size={SpinnerSize.large} label={'Scanning'} />;
        }

        const items: IAssessmentInstanceRowData[] = this.props.assessmentInstanceTableHandler.createAssessmentInstanceTableItems(
            this.props.instancesMap,
            this.props.assessmentNavState,
            this.props.hasVisualHelper,
        );

        const columns: IColumn[] = this.props.assessmentInstanceTableHandler.getColumnConfigs(
            this.props.instancesMap,
            this.props.assessmentNavState,
            this.props.hasVisualHelper,
        );

        const getDefaultMessage = this.props.getDefaultMessage(this.props.assessmentDefaultMessageGenerator);
        const defaultMessageComponent = getDefaultMessage(this.props.instancesMap, this.props.assessmentNavState.selectedTestStep);

        if (defaultMessageComponent) {
            return defaultMessageComponent.message;
        }

        return (
            <div>
                {this.props.renderInstanceTableHeader(this, items)}
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

    @autobind
    public onItemInvoked(item: IAssessmentInstanceRowData) {
        this.updateFocusedTarget(item);
    }

    @autobind
    public renderRow(props: IDetailsRowProps, defaultRender: IRenderFunction<IDetailsRowProps>) {
        return <div onClick={() => this.updateFocusedTarget(props.item)}>{defaultRender(props)}</div>;
    }

    @autobind
    public updateFocusedTarget(item: IAssessmentInstanceRowData) {
        this.props.assessmentInstanceTableHandler.updateFocusedTarget(item.instance.target);
    }

    public renderDefaultInstanceTableHeader(items: IAssessmentInstanceRowData[]): JSX.Element {
        const disabled = !this.isAnyInstanceStatusUnknown(items, this.props.assessmentNavState.selectedTestStep);

        return (
            <ActionButton iconProps={{ iconName: 'skypeCheck' }} onClick={this.onPassUnmarkedInstances} disabled={disabled}>
                Pass unmarked instances
            </ActionButton>
        );
    }

    private isAnyInstanceStatusUnknown(items: IAssessmentInstanceRowData[], step: string): boolean {
        return items.some(
            item => has(item.instance.testStepResults, step) && item.instance.testStepResults[step].status === ManualTestStatus.UNKNOWN,
        );
    }

    @autobind
    protected onPassUnmarkedInstances(): void {
        this.props.assessmentInstanceTableHandler.passUnmarkedInstances(
            this.props.assessmentNavState.selectedTestType,
            this.props.assessmentNavState.selectedTestStep,
        );
    }
}
