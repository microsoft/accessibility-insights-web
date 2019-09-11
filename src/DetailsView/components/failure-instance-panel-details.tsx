// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { ILabelStyles } from 'office-ui-fabric-react/lib/Label';
import { ITextFieldStyles, TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { NamedFC } from '../../common/react/named-fc';

export type FailureInstancePanelDetailsProps = {
    path: string;
    snippet: string;
    onSelectorChange: (event, value) => void;
    onValidateSelector: (event) => void;
};

export const FailureInstancePanelDetails = NamedFC<FailureInstancePanelDetailsProps>('FailureInstancePanelDetails', props => {
    const getSnippetInfo = (): JSX.Element => {
        if (!props.snippet) {
            return (
                <div className="failure-instance-snippet-empty-body">Code snippet will auto-populate based on the CSS selector input.</div>
            );
        } else if (props.snippet.startsWith('No code snippet is map')) {
            return (
                <div className="failure-instance-snippet-error">
                    <Icon iconName="statusErrorFull" className="failure-instance-snippet-error-icon" />
                    <div>{props.snippet}</div>
                </div>
            );
        } else {
            return <div className="failure-instance-snippet-filled-body">{props.snippet}</div>;
        }
    };
    return (
        <div>
            <a href="#" className="learn-more">
                Learn more about adding failure instances
            </a>
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
            <div className="failure-instance-selector-note">
                Note: If the CSS selector maps to multiple snippets, the first will be selected
            </div>
            <div>
                <DefaultButton text="Validate CSS selector" onClick={props.onValidateSelector} disabled={props.path === null} />
            </div>
            <div aria-live="polite" aria-atomic="true">
                <div className="failure-instance-snippet-title">Code Snippet</div>
                {getSnippetInfo()}
            </div>
        </div>
    );
});

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
