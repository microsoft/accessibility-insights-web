// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { Toggle } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './tab-stops-testing-content.scss';

export type TabStopsTestingContentDeps = {};
export type TabStopsTestingContentProps = {
    deps: TabStopsTestingContentDeps;
    showTabStops: boolean;
};

const ariaLevelForHowToTestHeading: number = 3;

export const TabStopsTestingContent = NamedFC<TabStopsTestingContentProps>(
    'TabStopsTestingContent',
    props => {
        return (
            <>
                <Toggle
                    label={'Show tab stops'}
                    checked={props.showTabStops}
                    offText="Off"
                    onText="On"
                    className={styles.toggle}
                />
                <span role="heading" aria-level={ariaLevelForHowToTestHeading}>
                    <strong>How to test:</strong>
                </span>
                <ol className={styles.howToTestList}>
                    <li>Navigate to the screen you want to test in your app.</li>
                    <li>
                        Turn on the Show tab stops toggle. An empty circle will highlight the
                        element with focus.
                    </li>
                    <li>
                        If you are connected to an emulator, select your emulator app to bring it
                        into focus and use your keyboard.
                    </li>
                    <li>
                        Or If you are connected to a physical mobile device use the keyboard
                        key-buttons below.
                    </li>
                    <li>
                        Move input focus through all the interactive elements in the page:
                        <ul>
                            <li>Use Tab and Shift+Tab to navigate between standalone controls.</li>
                            <li>
                                Use the arrow keys to navigate between the focusable elements within
                                a composite control.
                            </li>
                        </ul>
                    </li>
                    <li>
                        As you navigate to each element, look for these accessibility problems:
                        <ul>
                            <li>
                                An interactive element can't be reached using the Tab and arrow
                                keys.
                            </li>
                            <li>
                                An interactive element "traps" input focus and prevents navigating
                                away.
                            </li>
                            <li>
                                An interactive element doesn't give a visible indication when it has
                                input focus.
                            </li>
                            <li>
                                The tab order is inconsistent with the logical order that's
                                communicated visually.
                            </li>
                            <li>Input focus moves unexpectedly without the user initiating it.</li>
                        </ul>
                    </li>
                </ol>
            </>
        );
    },
);
