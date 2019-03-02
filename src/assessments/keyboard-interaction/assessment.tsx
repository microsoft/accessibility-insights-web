// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../common/components/new-tab-link';
import { Messages } from '../../common/messages';
import { VisualizationType } from '../../common/types/visualization-type';
import { test as content } from '../../content/test';
import { AssessmentBuilder } from '../assessment-builder';
import { IAssessment } from '../types/iassessment';
import { KeyboardNavigation } from './test-steps/keyboard-navigation';
import { NoKeyboardTraps } from './test-steps/no-keyboard-traps';
import { NoKeystrokeTiming } from './test-steps/no-keystroke-timings';
import { OnFocus } from './test-steps/on-focus';
import { OnInput } from './test-steps/on-input';

const key = 'keyboardInteraction';
const keyboardInteractionTitle = 'Keyboard';
const { guidance } = content.keyboard;

const keyboardInteractionGettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            Users must be able to access and interact with interface components using only the keyboard because using a mouse is not
            possible when the user has no vision or low vision or doesn't have the physical capability or dexterity to effectively control a
            pointing device.
        </p>
        <p>
            See{' '}
            <NewTabLink href="https://msit.microsoftstream.com/video/a872fda0-4b9e-453b-9adf-e02a38b1900b?channelId=66d47e66-d99c-488b-b9ea-98a153d2a4d4">
                this fun video
            </NewTabLink>{' '}
            to learn how landmarks, headings, and tab stops work together to provide efficient navigation.
        </p>
    </React.Fragment>
);

export const KeyboardInteraction: IAssessment = AssessmentBuilder.Assisted({
    key,
    title: keyboardInteractionTitle,
    gettingStarted: keyboardInteractionGettingStarted,
    guidance,
    type: VisualizationType.KeyboardInteraction,
    steps: [KeyboardNavigation, NoKeyboardTraps, OnFocus, OnInput, NoKeystrokeTiming],
    storeDataKey: 'keyboardInteractionAssessment',
    visualizationConfiguration: {
        key: key,
        analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
        analyzerProgressMessageType: Messages.Assessment.TabbedElementAdded,
    },
});
