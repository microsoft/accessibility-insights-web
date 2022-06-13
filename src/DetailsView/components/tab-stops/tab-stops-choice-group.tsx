// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IChoiceGroup, IChoiceGroupOption, IconButton } from '@fluentui/react';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { InstanceResultStatus } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { ChoiceGroupPassFail } from '../choice-group-pass-fail';

export type onGroupChoiceChange = (ev: SupportedMouseEvent, status: InstanceResultStatus) => void;
export type onUndoClicked = (ev: SupportedMouseEvent) => void;
export type onAddFailureInstanceClicked = (ev: SupportedMouseEvent) => void;

export interface TabStopsChoiceGroupsProps {
    status: InstanceResultStatus;
    onGroupChoiceChange: (ev: SupportedMouseEvent, status: InstanceResultStatus) => void;
    onUndoClicked: (ev: SupportedMouseEvent) => void;
    onAddFailureInstanceClicked: (ev: SupportedMouseEvent) => void;
}

export const addTabStopsFailureInstanceAutomationId = 'addTabStopsFailureInstance';
export const tabStopsPassFailChoiceGroupAutomationId = 'tabStopsPassFailChoiceGroup';

export interface ITabStopsChoiceGroup extends IChoiceGroupOption {
    key: InstanceResultStatus;
}

export class TabStopsChoiceGroup extends React.Component<TabStopsChoiceGroupsProps> {
    protected choiceGroup: IChoiceGroup;

    public render(): JSX.Element {
        return (
            <ChoiceGroupPassFail
                data-automation-id={tabStopsPassFailChoiceGroupAutomationId}
                onChange={this.onChange}
                componentRef={this.setComponentRef}
                selectedKey={this.props.status}
                options={[
                    { text: 'Pass', key: 'pass' },
                    { text: 'Fail', key: 'fail' },
                ]}
                secondaryControls={this.renderOptions()}
            />
        );
    }

    private renderOptions(): JSX.Element | null {
        switch (this.props.status) {
            case 'pass':
                return this.getUndoButton();

            case 'fail':
                return (
                    <>
                        {this.getUndoButton()}
                        <IconButton
                            data-automation-id={addTabStopsFailureInstanceAutomationId}
                            iconProps={{ iconName: 'add' }}
                            ariaLabel="add failure instance"
                            onClick={this.props.onAddFailureInstanceClicked}
                        />
                    </>
                );
            default:
                return null;
        }
    }

    private getUndoButton(): JSX.Element {
        return (
            <IconButton
                onClick={this.onUndoClicked}
                iconProps={{ iconName: 'undo' }}
                ariaLabel="undo"
            />
        );
    }

    protected setComponentRef = (component: IChoiceGroup): void => {
        this.choiceGroup = component;
    };

    protected onChange = (ev: SupportedMouseEvent, option: ITabStopsChoiceGroup): void => {
        this.props.onGroupChoiceChange(ev, option.key);
    };

    protected onUndoClicked = (ev: SupportedMouseEvent): void => {
        this.choiceGroup.focus();
        this.props.onUndoClicked(ev);
    };
}
