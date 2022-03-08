// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IChoiceGroup, IChoiceGroupOption, Icon, Link } from '@fluentui/react';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { InstanceResultStatus } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import * as styles from './tab-stops-choice-group.scss';

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
            <>
                <div className={styles.tabStopsChoiceGroup}>
                    <ChoiceGroup
                        data-automation-id={tabStopsPassFailChoiceGroupAutomationId}
                        className={this.props.status}
                        onChange={this.onChange}
                        componentRef={this.setComponentRef}
                        selectedKey={this.props.status}
                        options={[this.makeOption('pass', 'Pass'), this.makeOption('fail', 'Fail')]}
                    />
                </div>

                <div>{this.renderOptions()}</div>
            </>
        );
    }

    private makeOption(status: InstanceResultStatus, text: string): ITabStopsChoiceGroup {
        return {
            key: status,
            text: text,
            ariaLabel: text,
            onRenderLabel: this.renderNoLabel,
        };
    }

    private renderNoLabel = (): JSX.Element | null => {
        return null;
    };

    private renderOptions(): JSX.Element | null {
        switch (this.props.status) {
            case 'pass':
                return this.getUndoButton();

            case 'fail':
                return (
                    <>
                        {this.getUndoButton()}
                        <Link
                            data-automation-id={addTabStopsFailureInstanceAutomationId}
                            className={styles.undoButton}
                            onClick={this.props.onAddFailureInstanceClicked}
                        >
                            <Icon iconName="add" ariaLabel={'add failure instance'} />
                        </Link>
                    </>
                );
        }
    }

    private getUndoButton(): JSX.Element {
        return (
            <Link className={styles.undoButton} onClick={this.onUndoClicked}>
                <Icon className={styles.undoButtonIcon} iconName="undo" ariaLabel={'undo'} />
            </Link>
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
