// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';
import { AssessmentBuilder } from '../assessment-builder';
import * as Markup from '../markup';
import { LabelInName } from './test-steps/label-in-name';
import { LinkFunction } from './test-steps/link-function';
import { LinkPurpose } from './test-steps/link-purpose';

const key = 'linksAssessment';
const title = 'Links';
const { guidance } = content.links;

const LinksAssessmentGettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            A link is a specific type of widget (interactive interface component) that navigates the
            user to new content, either in the current page or in a new page. A link is typically
            implemented as an HTML <Markup.Term>a</Markup.Term> (anchor) element with an{' '}
            <Markup.Term>href</Markup.Term> value.
        </p>
        However, <Markup.Term>a</Markup.Term> elements are frequently scripted to function as
        buttons. The difference between a link and a button:
        <ul>
            <li>
                A <Markup.Term>link</Markup.Term> <Markup.Emphasis>navigates</Markup.Emphasis> to
                new content.
            </li>
            <li>
                A <Markup.Term>button</Markup.Term> <Markup.Emphasis>activates</Markup.Emphasis>{' '}
                functionality (e.g., shows or hides content, toggles a state on or off).
            </li>
        </ul>
        For example, a navigation bar is a list of links, while a menu is a collection of buttons.
        <p>
            An <Markup.Term>a</Markup.Term> element that functions as a button or other custom
            widget must have the appropriate widget role.
        </p>
    </React.Fragment>
);

export const LinksAssessment = AssessmentBuilder.Assisted({
    key,
    title: title,
    gettingStarted: LinksAssessmentGettingStarted,
    guidance,
    visualizationType: VisualizationType.LinksAssessment,
    requirements: [LinkFunction, LinkPurpose, LabelInName],
    storeDataKey: 'linksAssessment',
});
