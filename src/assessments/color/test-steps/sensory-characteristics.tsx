// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import * as content from 'content/test/sensory/instructions';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { ColorSensoryTestStep } from './test-steps';

const sensoryCharacteristicsDescription: JSX.Element = (
    <span>Instructions must not rely solely on color or other sensory characteristics.</span>
);

const sensoryCharacteristicsHowToTest: JSX.Element = (
    <div>
        <ol>
            <li>
                Examine the target page to identify any instances where instructions refer to an
                element's sensory characteristics, such as:
                <ol>
                    <li>Color</li>
                    <li>Shape</li>
                    <li>Size</li>
                    <li>Visual location</li>
                    <li>Orientation</li>
                    <li>Sound</li>
                </ol>
            </li>
            <li>
                For each instance, verify that the instructions also include additional information
                sufficient to locate and identify the element without knowing its sensory
                characteristics. (For example, "Press the green button").
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const SensoryCharacteristics: Requirement = {
    key: ColorSensoryTestStep.sensoryCharacteristics,
    name: 'Instructions',
    description: sensoryCharacteristicsDescription,
    howToTest: sensoryCharacteristicsHowToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_1_3_3],
};
