// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NewTabLink } from 'common/components/new-tab-link';
import { Messages } from 'common/messages';
import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { CharacterKeyShortcuts } from './test-steps/character-key-shortcuts';
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
            Users must be able to access and interact with interface components using only the
            keyboard because using a mouse is not possible when the user has no vision or low vision
            or doesn't have the physical capability or dexterity to effectively control a pointing
            device.
        </p>
        <p>
            See{' '}
            <NewTabLink href="https://go.microsoft.com/fwlink/?linkid=2080372">
                this fun video
            </NewTabLink>{' '}
            to learn how landmarks, headings, and tab stops work together to provide efficient
            navigation.
        </p>
    </React.Fragment>
);

export const KeyboardInteraction: Assessment = AssessmentBuilder.Assisted({
    key,
    title: keyboardInteractionTitle,
    gettingStarted: keyboardInteractionGettingStarted,
    guidance,
    visualizationType: VisualizationType.KeyboardInteraction,
    requirements: [
        KeyboardNavigation,
        NoKeyboardTraps,
        OnFocus,
        OnInput,
        NoKeystrokeTiming,
        CharacterKeyShortcuts,
    ],
    storeDataKey: 'keyboardInteractionAssessment',
    visualizationConfiguration: {
        key: key,
        analyzerProgressMessageType: Messages.Assessment.TabbedElementAdded,
    },
});
