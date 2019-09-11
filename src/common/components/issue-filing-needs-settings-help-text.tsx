// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

export type IssueFilingNeedsSettingsHelpTextProps = {
    isOpen: boolean;
};

export const IssueFilingNeedsSettingsHelpText = NamedFC<IssueFilingNeedsSettingsHelpTextProps>(
    'IssueFilingNeedsSettingsHelpText',
    props => {
        if (props.isOpen) {
            return (
                <div role="alert" aria-live="polite" className="file-issue-button-help">
                    Go to Settings to configure issue filing.
                </div>
            );
        }

        return null;
    },
);
