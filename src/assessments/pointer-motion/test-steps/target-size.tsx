// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import * as content from 'content/test/pointer-motion/target-size';
import * as React from 'react';

import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { PointerMotionTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Touch targets must have sufficient size and spacing to be easily activated without
        accidentally activating an adjacent target.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                <p>
                    Examine the target page to identify interactive elements which have been created
                    by authors (non-native browser controls).
                </p>
            </li>
            <li>
                <p>
                    Verify these elements are a minimum size of 24x24 css pixels. The following
                    exceptions apply:
                </p>
                <ul>
                    <li>
                        <p>
                            <em>Spacing</em>: These elements may be smaller than 24x24 css pixels so
                            long as it is within a 24x24 css pixel target spacing circle that
                            doesn’t overlap with other targets or their 24x24 target spacing circle.
                        </p>
                    </li>
                    <li>
                        <p>
                            <em>Equivalent</em>: If an alternative control is provided on the same
                            page that successfully meets the target criteria.
                        </p>
                    </li>
                    <li>
                        <p>
                            <em>Inline</em>: The target is in a sentence, or its size is otherwise
                            constrained by the line-height of non-target text.
                        </p>
                    </li>
                    <li>
                        <p>
                            <em>User agent control</em>: The size of the target is determined by the
                            user agent and is not modified by the author.
                        </p>
                    </li>
                    <li>
                        <p>
                            <em>Essential</em>: A particular presentation of the target is essential
                            or is legally required for the information to be conveyed.
                        </p>
                    </li>
                </ul>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const TargetSize: Requirement = {
    key: PointerMotionTestStep.targetSize,
    name: 'Target size',
    description,
    howToTest,
    ...content,
    isManual: true,
    guidanceLinks: [link.WCAG_2_5_8],
};
