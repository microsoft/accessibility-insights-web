// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import * as Markup from '../markup';
import { Assessment } from '../types/iassessment';
import { Cues } from './test-steps/cues';
import { DesignPattern } from './test-steps/design-pattern';
import { ExpectedInput } from './test-steps/expected-input';
import { Instructions } from './test-steps/instructions';
import { KeyboardInteraction } from './test-steps/keyboard-interaction';
import { RoleStateProperty } from './test-steps/role-state-property';

const key = 'customWidgets';
const title = 'Custom widgets';
const { guidance } = content.customWidgets;
const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            A <Markup.Emphasis>widget</Markup.Emphasis> is an interactive interface component, such
            as a link, button, or combo box.
        </p>
        <p>
            A <Markup.Emphasis>custom widget</Markup.Emphasis> is an interactive interface component
            other than a link or native HTML element. Custom widgets can be simple (e.g., a link or
            a button) or complex (e.g., a text field, listbox, and button that together function as
            a combo box).
        </p>
        <p>
            Each custom widget should follow the{' '}
            <NewTabLink href="https://www.w3.org/TR/wai-aria-practices-1.1/">
                ARIA design pattern
            </NewTabLink>{' '}
            that best describes its function.
        </p>
    </React.Fragment>
);

export const CustomWidgets: Assessment = AssessmentBuilder.Assisted({
    key,
    visualizationType: VisualizationType.CustomWidgets,
    title,
    gettingStarted,
    guidance,
    requirements: [
        DesignPattern,
        Instructions,
        ExpectedInput,
        RoleStateProperty,
        Cues,
        KeyboardInteraction,
    ],
});
