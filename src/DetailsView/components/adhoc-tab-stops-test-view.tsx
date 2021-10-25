// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { RequirementInstructions } from 'DetailsView/components/requirement-instructions';
import * as React from 'react';

export interface AdhocTabStopsTestViewProps {}

const howToTest: JSX.Element = (
    <ol>
        <li>
            Locate the visual helper on the target page, it will highlight element in focus with an
            empty circle.
        </li>
        <li>
            Use your keyboard to move input focus through all the interactive elements in the page:
        </li>
        <ol>
            <li>Use Tab and Shift+Tab to navigate between standalone controls. </li>
            <li>
                Use the arrow keys to navigate between the focusable elements within a composite
                control.
            </li>
        </ol>
    </ol>
);
export const AdhocTabStopsTestView = NamedFC<AdhocTabStopsTestViewProps>(
    'AdhocTabStopsTestView',
    () => {
        return <RequirementInstructions howToTest={howToTest} />;
    },
);
