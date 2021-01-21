// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Messages } from 'common/messages';
import { VisualizationType } from 'common/types/visualization-type';
import { generateUID } from 'common/uid-generator';
import { link } from 'content/link';
import * as content from 'content/test/keyboard/keyboard-navigation';
import { RestartScanVisualHelperToggle } from 'DetailsView/components/restart-scan-visual-helper-toggle';
import { VisualizationInstanceProcessor } from 'injected/visualization-instance-processor';
import * as React from 'react';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { KeyboardInteractionTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Users must be able to <Markup.Emphasis>navigate</Markup.Emphasis> to all interactive
        interface components using a keyboard.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement records elements in the target page that receive
            the input focus.
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
                If a “keyboard trap" prevents the focus from leaving a widget:
                <ol>
                    <li>Use your mouse to move the focus to the next widget.</li>
                    <li>Resume testing.</li>
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

            <li>Verify that you can navigate to all interactive components using the keyboard.</li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const KeyboardNavigation: Requirement = {
    key: KeyboardInteractionTestStep.keyboardNavigation,
    name: 'Keyboard navigation',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_2_1_1],
    getAnalyzer: provider =>
        provider.createFocusTrackingAnalyzer({
            key: KeyboardInteractionTestStep.keyboardNavigation,
            testType: VisualizationType.KeyboardInteraction,
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
    generateInstanceIdentifier: generateUID,
};
