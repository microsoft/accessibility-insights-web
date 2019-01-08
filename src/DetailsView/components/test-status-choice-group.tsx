// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { autobind } from '@uifabric/utilities';
import * as React from 'react';

import { ManualTestStatus } from '../../common/types/manual-test-status';
import { VisualizationType } from '../../common/types/visualization-type';

export interface ITestStatusChoiceGroupProps {
    test: VisualizationType;
    step: string;
    selector?: string;
    status: number;
    originalStatus: number;
    isLabelVisible?: boolean;
    onGroupChoiceChange: (status, test, step, selector?) => void;
    onUndoClicked: (test, step, selector?) => void;
}

export class TestStatusChoiceGroup extends React.Component<ITestStatusChoiceGroupProps> {
    protected _choiceGroup: IChoiceGroup;

    public render(): JSX.Element {
        return (
            <div>
                <div className="radio-button-group">
                    <ChoiceGroup
                        onChange={this.onChange}
                        componentRef={this.compomentRef}
                        selectedKey={ManualTestStatus[this.props.status]}
                        options={[
                            { key: ManualTestStatus[ManualTestStatus.PASS], text: 'Pass', onRenderLabel: this.onRenderLabel },
                            { key: ManualTestStatus[ManualTestStatus.FAIL], text: 'Fail', onRenderLabel: this.onRenderLabel },
                        ]}
                    />
                </div>

                <div>
                    {this.renderUndoButton()}
                </div>
            </div>
        );
    }

    @autobind
    private onRenderLabel(option: IChoiceGroupOption): JSX.Element {
        return (
            <span id={option.labelId} className="ms-Label" aria-label={option.text}>{this.props.isLabelVisible ? option.text : ''}</span>
        );
    }

    private renderUndoButton(): JSX.Element {
        if (this.props.originalStatus == null) {
            return null;
        }

        return (
            <Link className="undo-button"
                onClick={this.onUndoClicked}
            >
                <Icon
                    iconName="undo"
                    ariaLabel={'undo'}
                />
            </Link>
        );
    }

    @autobind
    protected compomentRef(component: IChoiceGroup): void {
        this._choiceGroup = component;
    }

    @autobind
    protected onChange(ev: React.FocusEvent<HTMLElement>, option: IChoiceGroupOption): void {
        this.props.onGroupChoiceChange(ManualTestStatus[option.key], this.props.test, this.props.step, this.props.selector);
    }

    @autobind
    protected onUndoClicked(): void {
        this._choiceGroup.focus();
        this.props.onUndoClicked(this.props.test, this.props.step, this.props.selector);
    }
}
