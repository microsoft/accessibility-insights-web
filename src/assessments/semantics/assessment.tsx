// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeadersAttribute } from 'assessments/semantics/test-steps/headers-attribute';
import { VisualizationType } from 'common/types/visualization-type';
import { test as content } from 'content/test';
import * as React from 'react';

import { AssessmentBuilder } from '../assessment-builder';
import * as Markup from '../markup';
import { CssContent } from './test-steps/css-content';
import { SemanticsEmphasis } from './test-steps/emphasis';
import { SemanticsLetterSpacing } from './test-steps/letter-spacing';
import { SemanticsLists } from './test-steps/lists';
import { SemanticsQuotes } from './test-steps/quotes';
import { TableHeaders } from './test-steps/table-headers';
import { TableSemantics } from './test-steps/table-semantics';

const key = 'semanticsAssessment';
const title = 'Semantics';
const { guidance } = content.semantics;
const gettingStarted: JSX.Element = (
    <React.Fragment>
        <p>
            Information and relationships that are implied through visual formatting must be
            available to non-sighted users. Using semantic markup helps achieve this by introducing
            meaning into a web page rather than just presentation. For example, HTML tags like{' '}
            <Markup.Tag tagName="b" /> and <Markup.Tag tagName="i" /> are not semantic because they
            define only the <Markup.Emphasis>visual appearance</Markup.Emphasis> of text. On the
            other hand, tags like <Markup.Tag tagName="blockquote" />, <Markup.Tag tagName="em" />,
            and <Markup.Tag tagName="ol" /> communicate the meaning of the text. Access to semantic
            information allows browsers and assistive technologies to present the content
            appropriately to users. Using semantic elements correctly ensures all users have equal
            access to the meaning of content.
        </p>
    </React.Fragment>
);

export const SemanticsAssessment = AssessmentBuilder.Assisted({
    key,
    title,
    gettingStarted,
    guidance,
    visualizationType: VisualizationType.SemanticsAssessment,
    requirements: [
        CssContent,
        TableSemantics,
        TableHeaders,
        HeadersAttribute,
        SemanticsLists,
        SemanticsEmphasis,
        SemanticsQuotes,
        SemanticsLetterSpacing,
    ],
    storeDataKey: 'semanticsAssessment',
});
