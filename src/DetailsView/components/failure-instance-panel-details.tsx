// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon, ILabelStyles, ITextFieldStyles, TextField } from '@fluentui/react';
import { Button, mergeClasses } from '@fluentui/react-components';
import buttonStyles from 'common/styles/button.scss';
import * as React from 'react';
import { NamedFC } from '../../common/react/named-fc';
import styles from './failure-instance-panel.scss';

export type FailureInstancePanelDetailsProps = {
    path?: string;
    snippet?: string;
    onSelectorChange: (event, value) => void;
    onValidateSelector: (event) => void;
};

export const FailureInstancePanelDetails = NamedFC<FailureInstancePanelDetailsProps>(
    'FailureInstancePanelDetails',
    props => {
        const getSnippetInfo = (): JSX.Element => {
            if (!props.snippet) {
                return (
                    <div className={styles.failureInstanceSnippetEmptyBody}>
                        Code snippet will auto-populate based on the CSS selector input.
                    </div>
                );
            } else if (props.snippet.startsWith('No code snippet is map')) {
                return (
                    <div className={styles.failureInstanceSnippetError}>
                        <Icon
                            iconName="statusErrorFull"
                            className={styles.failureInstanceSnippetErrorIcon}
                        />
                        <div>{props.snippet}</div>
                    </div>
                );
            } else {
                return (
                    <div className={styles.failureInstanceSnippetFilledBody}>{props.snippet}</div>
                );
            }
        };
        return (
            <div>
                <TextField
                    label="CSS Selector"
                    styles={getStyles}
                    multiline={true}
                    rows={4}
                    value={props.path}
                    onChange={props.onSelectorChange}
                    resizable={false}
                    placeholder="CSS Selector"
                />
                <div className={styles.failureInstanceSelectorNote}>
                    Note: If the CSS selector maps to multiple snippets, the first will be selected
                </div>
                <div>
                    <div className={buttonStyles.buttonsComponent}>
                        <div className={buttonStyles.buttonCol}>
                            <Button
                                className={mergeClasses(
                                    buttonStyles.defaultButton,
                                    styles.validateCssButton,
                                )}
                                onClick={props.onValidateSelector}
                                disabled={props.path === null}
                            >
                                Validate CSS selector
                            </Button>
                        </div>
                    </div>
                </div>
                <div aria-live="polite" aria-atomic="true">
                    <div className={styles.failureInstanceSnippetTitle}>Code Snippet</div>
                    {getSnippetInfo()}
                </div>
            </div>
        );
    },
);

function getStyles(): Partial<ITextFieldStyles> {
    return {
        subComponentStyles: {
            label: getLabelStyles,
        },
    };
}

function getLabelStyles(): ILabelStyles {
    return {
        root: [
            {
                paddingBottom: 8,
            },
        ],
    };
}
