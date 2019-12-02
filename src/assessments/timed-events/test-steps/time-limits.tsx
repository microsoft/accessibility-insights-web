// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/timed-events/time-limits';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { TimedEventsTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        If a time limit is set by the content, the user must be able to turn off, adjust, or extend
        the time limit.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to determine whether it has any content time limits
                (time-outs).
                <ol>
                    <li>
                        Ignore any time limit that is:
                        <ol>
                            <li>
                                Part of a real-time event (such as an auction), and no alternative
                                to the time limit is possible; or
                            </li>

                            <li>
                                Essential to the activity (such as an online test), and allowing
                                users to extend it would invalidate the activity; or
                            </li>

                            <li>Longer than 20 hours.</li>
                        </ol>
                    </li>
                </ol>
            </li>

            <li>
                If the page <Markup.Emphasis>does</Markup.Emphasis> have a time limit, verify that:
                <ol>
                    <li>You can turn off the time limit, or</li>
                    <li>
                        You can adjust the time limit to at least 10 times the default limit, or
                    </li>
                    <li>
                        You are:
                        <ol>
                            <li>Warned about the time limit, and</li>

                            <li>
                                Given at least 20 seconds to extend the time limit with a simple
                                action (e.g., "Press the space bar"), and
                            </li>

                            <li>Allowed to extend the time limit at least 10 times.</li>
                        </ol>
                    </li>
                </ol>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const TimeLimits: Requirement = {
    key: TimedEventsTestStep.timeLimits,
    name: 'Time limits',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_2_2_1],
};
