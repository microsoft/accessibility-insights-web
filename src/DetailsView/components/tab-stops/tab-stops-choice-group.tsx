// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IChoiceGroup, IChoiceGroupOption, IconButton } from '@fluentui/react';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { TabStopRequirementStatuses } from 'common/types/store-data/visualization-scan-result-data';
import * as React from 'react';
import { ChoiceGroupPassFail } from '../choice-group-pass-fail';

export type onGroupChoiceChange = (
    ev: SupportedMouseEvent,
    status: TabStopRequirementStatuses,
) => void;
export type onUndoClicked = (ev: SupportedMouseEvent) => void;
export type onAddFailureInstanceClicked = (ev: SupportedMouseEvent) => void;

export interface TabStopsChoiceGroupsProps {
    status: TabStopRequirementStatuses;
    onGroupChoiceChange: (ev: SupportedMouseEvent, status: TabStopRequirementStatuses) => void;
    onUndoClicked: (ev: SupportedMouseEvent) => void;
    onAddFailureInstanceClicked: (ev: SupportedMouseEvent) => void;
}

export const addTabStopsFailureInstanceAutomationId = 'addTabStopsFailureInstance';
export const tabStopsPassFailChoiceGroupAutomationId = 'tabStopsPassFailChoiceGroup';

export interface ITabStopsChoiceGroup extends IChoiceGroupOption {
    key: TabStopRequirementStatuses;
}

export class TabStopsChoiceGroup extends React.Component<TabStopsChoiceGroupsProps> {
    protected choiceGroup: IChoiceGroup;

    public render(): JSX.Element {
        console.log("jsx--->", this.props)
        return (
            <ChoiceGroupPassFail
                data-automation-id={tabStopsPassFailChoiceGroupAutomationId}
                onChange={this.onChange}
                selectedKey={TabStopRequirementStatuses[this.props.status]}
                options={[
                    { text: 'Pass', key: 'pass' },
                    { text: 'Fail', key: 'fail' },
                ]}
                onUndoClickedPassThrough={(ev: SupportedMouseEvent): void => {
                    this.props.onUndoClicked(ev);
                }}
                secondaryControls={this.renderAddFailureInstance()}
            />
        );
    }

    private renderAddFailureInstance(): JSX.Element | null {
        return this.props.status === 'fail' ? (
            <IconButton
                data-automation-id={addTabStopsFailureInstanceAutomationId}
                iconProps={{ iconName: 'add' }}
                ariaLabel="add failure instance"
                onClick={this.props.onAddFailureInstanceClicked}
            />
        ) : null;
    }

    protected onChange = (ev: SupportedMouseEvent, option: ITabStopsChoiceGroup): void => {
        this.props.onGroupChoiceChange(ev, option.key);
    };
}
