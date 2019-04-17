// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../react/named-sfc';

export type IssueFilingNeedsSettingsHelpTextProps = {
    isOpen: boolean;
};

export const IssueFilingNeedsSettingsHelpText = NamedSFC<IssueFilingNeedsSettingsHelpTextProps>('IssueFilingDialog', props => {
    if (props.isOpen) {
        return (
            <div role="alert" aria-live="polite" className="create-bug-button-help">
                Go to Settings to configure issue filing.
            </div>
        );
    }
});
