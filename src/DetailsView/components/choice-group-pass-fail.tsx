// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ChoiceGroup,
    IChoiceGroup,
    IChoiceGroupOption,
    IChoiceGroupProps,
    IconButton,
    mergeStyles,
} from '@fluentui/react';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
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
        // its respective class name to style the option green or red
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
        // Show undo button when selectedKey is not unknown
        const showUndoButton =
            this.props.selectedKey !== TabStopRequirementStatuses.unknown &&
            this.props.selectedKey !== ManualTestStatus.UNKNOWN;

        return (
            <div className={styles.choiceGroupContainer}>
                <ChoiceGroup
                    styles={{
                        flexContainer: styles.radioButtonGroup,
                    }}
                    componentRef={this.setComponentRef}
                    onChange={this.props.onChange}
                    selectedKey={this.props.selectedKey}
                    options={this.props.options.map(this.makeOptions)}
                    data-automation-id={this.props['data-automation-id']}
                />
                <div className={styles.secondaryControlsWrapper}>
                    {showUndoButton && (
                        <IconButton
                            onClick={this.onUndoClicked}
                            iconProps={{ iconName: 'undo' }}
                            aria-label="undo"
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
        let styledOption: string;
        switch (text) {
            case 'Pass':
                styledOption = styles.radioButtonOptionPass;
                break;
            case 'Fail':
                styledOption = styles.radioButtonOptionFail;
                break;
            default:
                styledOption = '';
                break;
        }
        return {
            key,
            text,
            // When label is not visible, hide the label and provide aria-label
            ...(!this.props.isLabelVisible && {
                onRenderLabel: () => <></>,
                ['aria-label']: text,
            }),
            styles: {
                root: styles.radioButtonOption,
                field: mergeStyles(styles.radioButtonOptionField, styledOption),
            },
        };
    };
}
