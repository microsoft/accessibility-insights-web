// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import * as content from 'content/test/semantics/css-content';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SemanticsTestStep } from './test-steps';

const cssContentHowToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement highlights content inserted in the page using CSS{' '}
            <Markup.Code>:before</Markup.Code> or <Markup.Code>:after</Markup.Code>. This procedure
            uses the{' '}
            <NewTabLink href="https://chrome.google.com/webstore/detail/web-developer/bfbameneiokkgbdmiekhjnmfkcnldhhm">
                Web Developer
            </NewTabLink>{' '}
            browser extension.
        </p>
        <ol>
            <li>
                In the target page, examine each highlighted item to determine whether it is
                meaningful or decorative.
                <ul>
                    <li>
                        An element is <Markup.Emphasis>meaningful</Markup.Emphasis> if it conveys
                        information that isn't available through other page content.
                    </li>
                    <li>
                        An element is <Markup.Emphasis>decorative</Markup.Emphasis> if it could be
                        removed from the page with <Markup.Emphasis>no</Markup.Emphasis> impact on
                        meaning or function.
                    </li>
                </ul>
            </li>
            <li>
                If inserted content is meaningful:
                <ul>
                    <li>
                        Determine whether the information in inserted content is available to
                        assistive technologies:
                        <ul>
                            <li>
                                Open the{' '}
                                <NewTabLink href="https://developers.google.com/web/updates/2018/01/devtools#a11y-pane">
                                    Accessibility pane
                                </NewTabLink>{' '}
                                in the browser Developer Tools.
                            </li>
                            <li>
                                In the accessibility tree, examine the element with inserted content
                                and its ancestors.
                            </li>
                            <li>
                                Verify that any information conveyed by the inserted content is
                                shown in the accessibility tree.
                            </li>
                        </ul>
                    </li>

                    <li>
                        Determine whether the information in inserted content is visible when CSS is
                        turned off:
                        <ul>
                            <li>
                                Use the Web Developer browser extension{' '}
                                <Markup.Term>(CSS > Disable All Styles)</Markup.Term> to turn off
                                CSS.
                            </li>
                            <li>
                                Verify that any information conveyed by the inserted content is
                                visible in the target page.
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

const cssContentDescription: JSX.Element = (
    <span>
        Meaningful content must not be implemented using only CSS <Markup.Code>:before</Markup.Code>{' '}
        or <Markup.Code>:after</Markup.Code>.
    </span>
);

const key = SemanticsTestStep.cssContent;

export const CssContent: Requirement = {
    key,
    name: 'CSS content',
    description: cssContentDescription,
    howToTest: cssContentHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_1],
    ...content,
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['css-content'],
                key,
                testType: VisualizationType.SemanticsAssessment,
            }),
        ),
    getDrawer: provider =>
        provider.createSingleTargetDrawer('insights-pseudo-selector-style-container'),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
