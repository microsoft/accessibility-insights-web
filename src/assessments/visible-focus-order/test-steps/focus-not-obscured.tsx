// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { generateUID } from 'common/uid-generator';
import { link } from 'content/link';
import { title } from 'content/strings/application';
import * as content from 'content/test/focus/focus-not-obscured';
import { RestartScanVisualHelperToggle } from 'DetailsView/components/restart-scan-visual-helper-toggle';
import { FocusAnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { visibleFfocusOrderTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        For elements receiving keyboard focus, its focus indicator must be at least partially
        visible and not obscured by author-created content which overlays it, unless the focused
        element can be revealed without requiring the user to advance focus in the UI.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            <Markup.Term>The visual helper for this requirement</Markup.Term> records elements in
            the target page that receive the input focus.
        </p>
        <ol>
            <li>
                Use the keyboard to navigate through all the interactive interface components in the
                target page.
                <ol>
                    <li>
                        Use <Markup.Term>Tab</Markup.Term> and <Markup.Term>Shift+Tab</Markup.Term>{' '}
                        to navigate between widgets both forwards and backwards.
                    </li>
                    <li>
                        Use the arrow keys to navigate between the focusable elements within a
                        composite widget.
                    </li>
                </ol>
            </li>
            <li>
                As you move focus to each component, verify that the focused element is not
                completely obscured by other content. (In addition to the circle drawn by {title}.)
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const FocusNotObscured: Requirement = {
    key: visibleFfocusOrderTestStep.focusNotObscured,
    name: 'Focus not obscured',
    description,
    howToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_2_4_11],
    ...content,
    getAnalyzer: (provider: AnalyzerProvider, analyzerConfig: FocusAnalyzerConfiguration) => {
        return provider.createFocusTrackingAnalyzer(analyzerConfig);
    },
    getVisualHelperToggle: props => <RestartScanVisualHelperToggle {...props} />,
    visualizationInstanceProcessor: VisualizationInstanceProcessor.addOrder,
    doNotScanByDefault: true,
    getDrawer: provider =>
        provider.createSVGDrawer({
            tabIndexLabel: {
                showTabIndexedLabel: false,
            },
            line: {
                showSolidFocusLine: false,
            },
        }),
    getNotificationMessage: selectorMap => 'Start pressing Tab to start visualizing tab stops.',
    switchToTargetTabOnScan: true,
    generateInstanceIdentifier: generateUID,
};
