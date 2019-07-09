// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { NamedSFC } from '../../common/react/named-sfc';

export type FailureInstancePanelDetailsProps = {
    path: string;
    snippet: string;
    onSelectorChange: (event, value) => void;
    onValidateSelector: (event) => void;
};

export const FailureInstancePanelDetails = NamedSFC<FailureInstancePanelDetailsProps>('FailureInstancePanelDetails', props => {
    return (
        <div>
            <a className="learn-more"> Learn more about adding failure instances </a>
            <TextField
                className="selector-failure-textfield"
                label="CSS Selector"
                multiline={true}
                rows={8}
                value={props.path}
                onChange={props.onSelectorChange}
                resizable={false}
                defaultValue="CSS selector"
            />
            <div>Note: If the CSS selector maps to multiple snippets, the first will be selected.</div>
            <div>
                <DefaultButton text="Validate CSS selector" onClick={props.onValidateSelector} disabled={props.path === ''} />
            </div>
            <div>
                <label>Code Snippet</label>
                <div>{props.snippet}</div>
            </div>
        </div>
    );
});
