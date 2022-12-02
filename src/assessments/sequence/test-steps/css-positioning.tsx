// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autoPassIfNoResults } from 'assessments/auto-pass-if-no-results';
import { NewTabLink } from 'common/components/new-tab-link';
import { link } from 'content/link';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/sequence/css-positioning';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import { AnalyzerConfiguration } from 'injected/analyzers/analyzer';
import { AnalyzerProvider } from 'injected/analyzers/analyzer-provider';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { ManualTestRecordYourResults } from '../../common/manual-test-record-your-results';
import * as Markup from '../../markup';
import { Requirement } from '../../types/requirement';
import { SequenceTestStep } from './test-steps';

const description: JSX.Element = (
    <span>
        Meaningful content positioned on the page using CSS must retain its meaning when CSS is
        disabled.
    </span>
);

const howToTest: JSX.Element = (
    <div>
        <p>
            The visual helper for this requirement highlights content positioned on the screen using
            CSS <Markup.Term>position:absolute</Markup.Term> or{' '}
            <Markup.Term>float:right</Markup.Term>.
        </p>
        <TestAutomaticallyPassedNotice />
        <p>
            This procedure also uses the{' '}
            <NewTabLink href="https://chrome.google.com/webstore/detail/web-developer/bfbameneiokkgbdmiekhjnmfkcnldhhm">
                Web Developer
            </NewTabLink>{' '}
            browser extension.
        </p>
        <ol>
            <li>
                Examine the target page to determine whether it has any positioned (highlighted)
                content that's meaningful:
                <ol>
                    <li>
                        Content is <Markup.Emphasis>meaningful</Markup.Emphasis> if it conveys
                        information that isn't available through other page content.
                    </li>
                    <li>
                        Content is <Markup.Emphasis>decorative</Markup.Emphasis> if it could be
                        removed from the page with no impact on meaning or function.
                    </li>
                </ol>
            </li>
            <li>
                If the page does have meaningful positioned content, use the Web Developer browser
                extension (<Markup.Term>Miscellaneous {'>'} Linearize page</Markup.Term>) to show
                the page in DOM order.
            </li>
            <li>
                Verify that the positioned content retains its meaning when the page is linearized.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

const key = SequenceTestStep.cssPositioning;

export const CssPositioning: Requirement = {
    key,
    name: 'CSS positioning',
    description: description,
    howToTest: howToTest,
    isManual: true,
    getInitialManualTestStatus: autoPassIfNoResults,
    ...content,
    guidanceLinks: [link.WCAG_1_3_2],
    getAnalyzer: (provider: AnalyzerProvider, analyzerConfig: AnalyzerConfiguration) =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['css-positioning'],
                ...analyzerConfig,
            }),
        ),
    getDrawer: provider => provider.createHighlightBoxDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
};
