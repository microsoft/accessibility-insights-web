// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from 'office-ui-fabric-react';
import { Icon } from 'office-ui-fabric-react';
import { ILabelStyles } from 'office-ui-fabric-react';
import { ITextFieldStyles, TextField } from 'office-ui-fabric-react';
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';
import {
    failureInstanceSelectorNote,
    failureInstanceSnippetEmptyBody,
    failureInstanceSnippetError,
    failureInstanceSnippetErrorIcon,
    failureInstanceSnippetFilledBody,
    failureInstanceSnippetTitle,
} from './failure-instance-panel.scss';

export type FailureInstancePanelDetailsProps = {
    path: string;
    snippet: string;
    onSelectorChange: (event, value) => void;
    onValidateSelector: (event) => void;
};

export const FailureInstancePanelDetails = NamedFC<FailureInstancePanelDetailsProps>(
    'FailureInstancePanelDetails',
    props => {
        const getSnippetInfo = (): JSX.Element => {
            if (!props.snippet) {
                return (
                    <div className={failureInstanceSnippetEmptyBody}>
                        Code snippet will auto-populate based on the CSS selector input.
                    </div>
                );
            } else if (props.snippet.startsWith('No code snippet is map')) {
                return (
                    <div className={failureInstanceSnippetError}>
                        <Icon
                            iconName="statusErrorFull"
                            className={failureInstanceSnippetErrorIcon}
                        />
                        <div>{props.snippet}</div>
                    </div>
                );
            } else {
                return <div className={failureInstanceSnippetFilledBody}>{props.snippet}</div>;
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
                <div className={failureInstanceSelectorNote}>
                    Note: If the CSS selector maps to multiple snippets, the first will be selected
                </div>
                <div>
                    <DefaultButton
                        text="Validate CSS selector"
                        onClick={props.onValidateSelector}
                        disabled={props.path === null}
                    />
                </div>
                <div aria-live="polite" aria-atomic="true">
                    <div className={failureInstanceSnippetTitle}>Code Snippet</div>
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
