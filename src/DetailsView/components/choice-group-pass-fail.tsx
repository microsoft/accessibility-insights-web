// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ChoiceGroup,
    IChoiceGroup,
    IChoiceGroupOption,
    IChoiceGroupProps,
    IconButton,
} from '@fluentui/react';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { ManualTestStatus } from 'common/types/manual-test-status';
import { TabStopRequirementStatuses } from 'common/types/store-data/visualization-scan-result-data';
import * as React from 'react';
import styles from './choice-group-pass-fail.scss';

// Support numeric enum and string enum
type OptionKey = ManualTestStatus | keyof typeof TabStopRequirementStatuses;

export interface ChoiceGroupPassFailProps {
    onChange: IChoiceGroupProps['onChange'];
    secondaryControls?: JSX.Element | null;
    onUndoClickedPassThrough: Function;
    options: {
        key: OptionKey;
        // We expect text to be "Pass" or "Fail" so the option can receive
        // `option-fail` or `option-pass` class
        text: 'Pass' | 'Fail';
    }[];
    selectedKey: OptionKey;
    isLabelVisible?: boolean;
    'data-automation-id'?: string;
}

export class ChoiceGroupPassFail extends React.Component<ChoiceGroupPassFailProps> {
    protected choiceGroup: IChoiceGroup;

    public static defaultProps = {
        isLabelVisible: false,
    };

    public render(): JSX.Element {
        // Hide undo button for TabStopsChoiceGroups until selection
        const showUndoButton = this.props.selectedKey !== TabStopRequirementStatuses.unknown;

        return (
            <div className={styles.groupContainer}>
                <ChoiceGroup
                    styles={{
                        flexContainer: styles.radioButtonGroup,
                    }}
                    componentRef={this.setComponentRef}
                    onChange={this.props.onChange}
                    selectedKey={this.props.selectedKey}
                    options={this.props.options.map(this.makeOptions)}
                    isLabelVisible={this.props.isLabelVisible}
                    data-automation-id={this.props['data-automation-id']}
                />
                <div className={styles.secondaryControlsWrapper}>
                    {showUndoButton && (
                        <IconButton
                            onClick={this.onUndoClicked}
                            iconProps={{ iconName: 'undo' }}
                            ariaLabel="undo"
                        />
                    )}
                    {this.props.secondaryControls}
                </div>
            </div>
        );
    }

    protected setComponentRef = (component: IChoiceGroup): void => {
        this.choiceGroup = component;
    };

    protected onUndoClicked = (ev: SupportedMouseEvent): void => {
        this.choiceGroup.focus();
        this.props.onUndoClickedPassThrough(ev);
    };

    private makeOptions = ({ key, text }): IChoiceGroupOption => {
        return {
            key,
            text,
            // When label is not visible, hide the label and provide aria-label
            ...(!this.props.isLabelVisible && {
                onRenderLabel: () => <></>,
                ariaLabel: text,
            }),
            className: `option-${text.toLowerCase()}`,
            styles: {
                root: styles.radioButtonOption,
                field: styles.radioButtonOptionField,
            },
        };
    };
}
