// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IChoiceGroup, IChoiceGroupOption, IconButton } from '@fluentui/react';
import * as React from 'react';
import { ManualTestStatus } from '../../common/types/manual-test-status';
import { VisualizationType } from '../../common/types/visualization-type';
import { ChoiceGroupPassFail } from './choice-group-pass-fail';
export interface TestStatusChoiceGroupProps {
    test: VisualizationType;
    step: string;
    selector?: string;
    status: ManualTestStatus;
    originalStatus: number;
    isLabelVisible?: boolean;
    onGroupChoiceChange: (status, test, step, selector?) => void;
    onUndoClicked: (test, step, selector?) => void;
}

export class TestStatusChoiceGroup extends React.Component<TestStatusChoiceGroupProps> {
    protected choiceGroup: IChoiceGroup;

    public static defaultProps = {
        isLabelVisible: false,
    };

    public render(): JSX.Element {
        return (
            <ChoiceGroupPassFail
                onChange={this.onChange}
                componentRef={this.componentRef}
                selectedKey={ManualTestStatus[this.props.status]}
                options={[
                    { key: ManualTestStatus[ManualTestStatus.PASS], text: 'Pass' },
                    { key: ManualTestStatus[ManualTestStatus.FAIL], text: 'Fail' },
                ]}
                secondaryControls={this.renderUndoButton()}
                isLabelVisible={this.props.isLabelVisible}
            />
        );
    }

    private renderUndoButton(): JSX.Element | null {
        if (this.props.originalStatus == null) {
            return null;
        }

        return (
            <IconButton
                iconProps={{ iconName: 'undo' }}
                ariaLabel="undo"
                onClick={this.onUndoClicked}
            />
        );
    }

    protected componentRef = (component: IChoiceGroup): void => {
        this.choiceGroup = component;
    };

    protected onChange = (ev: React.FocusEvent<HTMLElement>, option: IChoiceGroupOption): void => {
        this.props.onGroupChoiceChange(
            ManualTestStatus[option.key],
            this.props.test,
            this.props.step,
            this.props.selector,
        );
    };

    protected onUndoClicked = (): void => {
        this.choiceGroup.focus();
        this.props.onUndoClicked(this.props.test, this.props.step, this.props.selector);
    };
}
