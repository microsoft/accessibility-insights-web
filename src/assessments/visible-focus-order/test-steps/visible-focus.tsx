// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from 'content/link';
import { title } from 'content/strings/application';
import * as content from 'content/test/focus/visible-focus';
import * as React from 'react';
import { Messages } from 'common/messages';
import { VisualizationType } from 'common/types/visualization-type';
import { generateUID } from 'common/uid-generator';
import { RestartScanVisualHelperToggle } from '../../../DetailsView/components/restart-scan-visual-helper-toggle';
import { VisualizationInstanceProcessor } from '../../../injected/visualization-instance-processor';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { visibleFfocusOrderTestStep } from './test-steps';

const description: JSX.Element = <span>Components must provide a visible indication when they have the input focus.</span>;

const howToTest: JSX.Element = (
    <div>
        <p>The visual helper for this requirement records elements in the target page that receive the input focus.</p>
        <ol>
            <li>
                Use the keyboard to navigate through all the interactive interface components in the target page.
                <ol>
                    <li>
                        Use <Markup.Term>Tab</Markup.Term> and <Markup.Term>Shift+Tab</Markup.Term> to navigate between widgets both
                        forwards and backwards.
                    </li>
                    <li>Use the arrow keys to navigate between the focusable elements within a composite widget.</li>
                </ol>
            </li>
            <li>
                As you move focus to each component, verify that it provides a visible indication that it has received the focus. (In
                addition to the circle drawn by {title}.)
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const VisibleFocus: Requirement = {
    key: visibleFfocusOrderTestStep.visibleFocus,
    name: 'Visible focus',
    description,
    howToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_2_4_7],
    ...content,
    getAnalyzer: provider =>
        provider.createFocusTrackingAnalyzer({
            key: visibleFfocusOrderTestStep.visibleFocus,
            testType: VisualizationType.VisibleFocusOrderAssessment,
            analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
            analyzerProgressMessageType: Messages.Assessment.ScanUpdate,
            analyzerTerminatedMessageType: Messages.Assessment.TrackingCompleted,
        }),
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
    updateVisibility: false,
    generateInstanceIdentifier: generateUID,
};
