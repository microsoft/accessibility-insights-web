// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEqual } from 'lodash';
import { ChoiceGroup, IChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react';
import { Icon } from 'office-ui-fabric-react';
import { Link } from 'office-ui-fabric-react';
import * as React from 'react';

import { ManualTestStatus } from '../../common/types/manual-test-status';
import { VisualizationType } from '../../common/types/visualization-type';
import * as styles from './test-status-choice-group.scss';

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
            <div>
                <div className={styles.radioButtonGroup}>
                    <ChoiceGroup
                        className={ManualTestStatus[this.props.status]}
                        onChange={this.onChange}
                        componentRef={this.compomentRef}
                        selectedKey={this.state.selectedKey}
                        options={[
                            this.makeOption(ManualTestStatus.PASS, 'Pass'),
                            this.makeOption(ManualTestStatus.FAIL, 'Fail'),
                        ]}
                    />
                </div>

                <div>{this.renderUndoButton()}</div>
            </div>
        );
    }

    private makeOption(manualTestStatus: ManualTestStatus, text: string): IChoiceGroupOption {
        return {
            key: ManualTestStatus[manualTestStatus],
            text: text,
            ariaLabel: this.props.isLabelVisible ? undefined : text,
            onRenderLabel: this.onRenderOptionLabel,
        };
    }

    private onRenderOptionLabel = (option: IChoiceGroupOption): JSX.Element | null => {
        return (
            <span id={option.labelId} className={styles.radioLabel}>
                {this.props.isLabelVisible ? option.text : ''}
            </span>
        );
    };

    private renderUndoButton(): JSX.Element | null {
        if (this.props.originalStatus == null) {
            return null;
        }

        return (
            <Link className={styles.undoButton} onClick={this.onUndoClicked}>
                <Icon className={styles.undoButtonIcon} iconName="undo" ariaLabel={'undo'} />
            </Link>
        );
    }

    protected compomentRef = (component: IChoiceGroup): void => {
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
        this.setState({ selectedKey: ManualTestStatus[ManualTestStatus.UNKNOWN] });
        this.choiceGroup.focus();
        this.props.onUndoClicked(this.props.test, this.props.step, this.props.selector);
    };
}
