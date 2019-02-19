// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MessageBarType, MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';

import { ITab } from '../../common/itab';
import { NamedSFC } from '../../common/react/named-sfc';
import { UrlParser } from '../../common/url-parser';

export interface AssessmentURLChangedWarningDeps {
    urlParser: UrlParser;
}

export interface AssessmentURLChangedWarningProps {
    deps: AssessmentURLChangedWarningDeps;
    currentTarget: ITab;
    prevTarget: ITab;
}

const urlChangedText: string = 'The target page URL has changed. We recommend doing an assessment in a single target page.';

export const AssessmentURLChangedWarning = NamedSFC<AssessmentURLChangedWarningProps>('AssessmentURLChangedWarning', props => {
    const { deps, prevTarget, currentTarget } = props;
    const { urlParser } = deps;

    const urlChanged = prevTarget != null && urlParser.areURLHostNamesEqual(prevTarget.url, currentTarget.url) === false;

    if (urlChanged === false) {
        return null;
    }

    return (
        <div>
            <MessageBar messageBarType={MessageBarType.warning}>{urlChangedText}</MessageBar>
        </div>
    );
});
