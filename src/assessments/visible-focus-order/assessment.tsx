// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Messages } from 'common/messages';
import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import { Assessment } from '../types/iassessment';
import { ClosingContent } from './test-steps/closing-content';
import { FocusOrder } from './test-steps/focus-order';
import { ModalDialogs } from './test-steps/modal-dialogs';
import { RevealingContent } from './test-steps/revealing-content';
import { VisibleFocus } from './test-steps/visible-focus';

const key = 'visibleFocusOrder';
const keyboardInteractionTitle = 'Focus';
const { guidance } = content.focus;
const keyboardInteractionGettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            When interacting with a website or web app using a keyboard, users need to know which
            component currently has the input focus. By default, web browsers indicate focus
            visually, but custom programming, styles, style sheets, and scripting can disrupt it.
        </p>
        <p>
            When navigating sequentially through a user interface, keyboard users need to encounter
            information in an order that preserves its meaning and allows them to perform all
            supported functions.
        </p>
    </React.Fragment>
);

export const VisibleFocusOrderAssessment: Assessment = AssessmentBuilder.Assisted({
    key,
    title: keyboardInteractionTitle,
    gettingStarted: keyboardInteractionGettingStarted,
    guidance,
    visualizationType: VisualizationType.VisibleFocusOrderAssessment,
    requirements: [VisibleFocus, RevealingContent, ModalDialogs, ClosingContent, FocusOrder],
    storeDataKey: 'visibleFocusOrderAssessment',
    visualizationConfiguration: {
        key: key,
        analyzerProgressMessageType: Messages.Assessment.TabbedElementAdded,
    },
});
