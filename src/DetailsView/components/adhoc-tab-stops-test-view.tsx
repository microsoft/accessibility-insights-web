// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { RequirementInstructions } from 'DetailsView/components/requirement-instructions';
import * as Markup from '../../assessments/markup';
import * as styles from 'DetailsView/components/static-content-common.scss';
import * as React from 'react';

export interface AdhocTabStopsTestViewProps {}

export const AdhocTabStopsTestView = NamedFC<AdhocTabStopsTestViewProps>(
    'AdhocTabStopsTestView',
    props => {
        const title = <h1>Tab stops Step 2 of 3</h1>;

        const description = (
            <p>
                <Markup.Emphasis>
                    Note: this test requires you to use a keyboard and to visually identify
                    interactive elements.
                </Markup.Emphasis>
            </p>
        );

        const howToTest: JSX.Element = (
            <ol>
                <li>
                    Locate the visual helper on the target page, it will highlight element in focus
                    with an empty circle.
                </li>
                <li>
                    Use your keyboard to move input focus through all the interactive elements in
                    the page:
                    <ol>
                        <li>Use Tab and Shift+Tab to navigate between standalone controls. </li>
                        <li>
                            Use the arrow keys to navigate between the focusable elements within a
                            composite control.
                        </li>
                    </ol>
                </li>
            </ol>
        );

        return (
            <div className={styles.staticContentInDetailsView}>
                {title}
                {description}
                <RequirementInstructions howToTest={howToTest} />
            </div>
        );
    },
);
