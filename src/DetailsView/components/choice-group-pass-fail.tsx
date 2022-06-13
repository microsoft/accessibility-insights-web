// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ChoiceGroup,
    IChoiceGroup,
    IChoiceGroupOption,
    IChoiceGroupProps,
    IRefObject,
} from '@fluentui/react';
import { ManualTestStatus } from 'common/types/manual-test-status';
import * as React from 'react';
import styles from './choice-group-pass-fail.scss';

export interface ChoiceGroupPassFailProps {
    onChange: IChoiceGroupProps['onChange'];
    secondaryControls: JSX.Element | null;
    componentRef: IRefObject<IChoiceGroup>;
    // We expect text to be "Pass" or "Fail" so the option can receive
    // `option-fail` or `option-pass` class
    options: { key: string | ManualTestStatus; text: 'Pass' | 'Fail' }[];
    selectedKey?: string;
    isLabelVisible?: boolean;
    'data-automation-id'?: string;
}

export class ChoiceGroupPassFail extends React.Component<ChoiceGroupPassFailProps> {
    public static defaultProps = {
        isLabelVisible: false,
    };

    public render(): JSX.Element {
        return (
            <div className={styles.groupContainer}>
                <ChoiceGroup
                    styles={{
                        flexContainer: styles.radioButtonGroup,
                    }}
                    onChange={this.props.onChange}
                    componentRef={this.props.componentRef}
                    selectedKey={this.props.selectedKey}
                    options={this.props.options.map(this.makeOptions)}
                    isLabelVisible={this.props.isLabelVisible}
                    data-automation-id={this.props['data-automation-id']}
                />
                <div className={styles.secondaryControlsWrapper}>
                    {this.props.secondaryControls}
                </div>
            </div>
        );
    }

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
