// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { generateUID } from 'common/uid-generator';
import { link } from 'content/link';
import * as content from 'content/test/focus/focus-order';
import { RestartScanVisualHelperToggle } from 'DetailsView/components/restart-scan-visual-helper-toggle';
import { AnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { visibleFfocusOrderTestStep } from './test-steps';

const description: JSX.Element = (
    <span>Components must receive focus in an order that preserves meaning and operability.</span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement records elements in the target page that receive
            the input focus and their focus order.
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
                If you encounter any trigger component that reveals hidden content:
                <ol>
                    <li>Activate the trigger.</li>
                    <li>Navigate through the revealed content.</li>
                    <li>Close the revealed content.</li>
                    <li>Resume navigating the page.</li>
                </ol>
            </li>
            <li>
                Verify that all interactive interface components receive focus in an order that
                preserves the meaning and operability of the web page.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const FocusOrder: Requirement = {
    key: visibleFfocusOrderTestStep.focusOrder,
    name: 'Focus order',
    description,
    howToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_2_4_3],
    ...content,
    getAnalyzer: (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) =>
        provider.createFocusTrackingAnalyzer(analyzerConfig as any),
    getVisualHelperToggle: props => <RestartScanVisualHelperToggle {...props} />,
    getDrawer: provider => provider.createSVGDrawer(),
    visualizationInstanceProcessor: VisualizationInstanceProcessor.addOrder,
    getNotificationMessage: selectorMap => 'Start pressing Tab to start visualizing tab stops.',
    doNotScanByDefault: true,
    switchToTargetTabOnScan: true,
    generateInstanceIdentifier: generateUID,
};
