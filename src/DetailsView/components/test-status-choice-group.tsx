// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IChoiceGroup, IChoiceGroupOption } from '@fluentui/react';
import * as React from 'react';
import { ManualTestStatus } from '../../common/types/store-data/manual-test-status';
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
                selectedKey={this.props.status}
                options={[
                    { key: ManualTestStatus.PASS, text: 'Pass' },
                    { key: ManualTestStatus.FAIL, text: 'Fail' },
                ]}
                isLabelVisible={this.props.isLabelVisible}
                onUndoClickedPassThrough={() => {
                    this.props.onUndoClicked(this.props.test, this.props.step, this.props.selector);
                }}
            />
        );
    }

    protected onChange = (ev: React.FocusEvent<HTMLElement>, option: IChoiceGroupOption): void => {
        this.props.onGroupChoiceChange(
            option.key,
            this.props.test,
            this.props.step,
            this.props.selector,
        );
    };
}
