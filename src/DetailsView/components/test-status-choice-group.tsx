// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IChoiceGroup, IChoiceGroupOption, IconButton } from '@fluentui/react';
import { isEqual } from 'lodash';
import * as React from 'react';

import { ManualTestStatus } from '../../common/types/manual-test-status';
import { VisualizationType } from '../../common/types/visualization-type';
import styles from './test-status-choice-group.scss';

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

interface ChoiceGroupState {
    selectedKey: string;
}

export class TestStatusChoiceGroup extends React.Component<
    TestStatusChoiceGroupProps,
    ChoiceGroupState
> {
    protected choiceGroup: IChoiceGroup;

    public static defaultProps = {
        isLabelVisible: false,
    };

    constructor(props) {
        super(props);
        this.state = { selectedKey: ManualTestStatus[this.props.status] };
    }

    public componentDidUpdate(prevProps: Readonly<TestStatusChoiceGroupProps>): void {
        if (isEqual(prevProps, this.props) === false) {
            this.setState(() => ({ selectedKey: ManualTestStatus[this.props.status] }));
        }
    }

    public render(): JSX.Element {
        return (
            <div className={styles.groupContainer}>
                <ChoiceGroup
                    styles={{
                        flexContainer: styles.radioButtonGroup,
                    }}
                    onChange={this.onChange}
                    componentRef={this.componentRef}
                    selectedKey={this.state.selectedKey}
                    options={[
                        this.makeOption(ManualTestStatus.PASS, 'Pass'),
                        this.makeOption(ManualTestStatus.FAIL, 'Fail'),
                    ]}
                />
                {this.renderUndoButton()}
            </div>
        );
    }

    private makeOption(manualTestStatus: ManualTestStatus, text: string): IChoiceGroupOption {
        return {
            key: ManualTestStatus[manualTestStatus],
            text: this.props.isLabelVisible ? text : '',
            ariaLabel: this.props.isLabelVisible ? undefined : text,
            className: `option-${ManualTestStatus[manualTestStatus].toLowerCase()}`,
            styles: {
                root: styles.radioButtonOption,
                field: styles.radioButtonOptionField,
            },
        };
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
        this.setState({ selectedKey: option.key });
        this.props.onGroupChoiceChange(
            ManualTestStatus[option.key],
            this.props.test,
            this.props.step,
            this.props.selector,
        );
    };

    protected onUndoClicked = (): void => {
        this.choiceGroup.focus();
        this.setState({ selectedKey: ManualTestStatus[ManualTestStatus.UNKNOWN] });
        this.props.onUndoClicked(this.props.test, this.props.step, this.props.selector);
    };
}
