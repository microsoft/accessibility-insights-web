// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import * as content from 'content/test/contrast/ui-components';
import * as React from 'react';

import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import { Requirement } from '../../types/requirement';
import { ContrastTestStep } from './test-steps';

const description: JSX.Element = (
    <span>Visual information used to indicate states and boundaries of active interface components must have sufficient contrast.</span>
);

const howToTest: JSX.Element = (
    <div>
        <p>The visual helper for this requirement highlights links, native widgets, and custom widgets in the target page.</p>
        <ol>
            <li>
                In the target page, examine each highlighted element in each of the following states:
                <ol>
                    <li>Normal</li>
                    <li>Focused</li>
                    <li>Mouseover</li>
                    <li>Selected (if applicable)</li>
                </ol>
            </li>
            <li>
                In each state, use{' '}
                <NewTabLink href="https://accessibilityinsights.io/docs/en/windows/getstarted/colorcontrast">
                    Accessibility Insights for Windows
                </NewTabLink>{' '}
                to verify that the following visual presentations (if implemented) have a contrast ratio of at least 3:1 against the
                adjacent background:
                <ol>
                    <li>Any visual effect that indicates state</li>
                    <li>Any visual boundary that indicates the component's clickable area</li>
                </ol>
                Exception: A lower contrast ratio is allowed if either of the following is true:
                <ol>
                    <li>The component is inactive/disabled.</li>
                    <li>The component's appearance is determined solely by the browser.</li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const UIComponents: Requirement = {
    key: ContrastTestStep.uiComponents,
    name: 'UI components',
    description,
    howToTest,
    ...content,
    guidanceLinks: [link.WCAG_1_4_11],
    isManual: true, // TODO: false
    // TODO: columnsConfig, reportInstanceFields, getAnalyzer, getDrawer, getVisualHelperToggle
};
