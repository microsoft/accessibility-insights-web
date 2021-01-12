// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LandmarksAssessmentProperties } from 'common/types/store-data/assessment-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { link } from 'content/link';
import { TestAutomaticallyPassedNotice } from 'content/test/common/test-automatically-passed-notice';
import * as content from 'content/test/landmarks/landmark-roles';
import { AssessmentVisualizationEnabledToggle } from 'DetailsView/components/assessment-visualization-enabled-toggle';
import * as React from 'react';
import { AnalyzerConfigurationFactory } from '../../common/analyzer-configuration-factory';
import { AssistedTestRecordYourResults } from '../../common/assisted-test-record-your-results';
import * as Markup from '../../markup';
import { ReportInstanceField } from '../../types/report-instance-field';
import { Requirement } from '../../types/requirement';
import { landmarksAssessmentInstanceDetailsColumnRenderer } from '../landmarks-instance-details-column-renderer';
import { LandmarkTestStep } from './test-steps';

const description: JSX.Element = (
    <span>A landmark region must have the role that best describes its content.</span>
);

const howToTest: JSX.Element = (
    <div>
        <p>The visual helper for this requirement highlights all landmarks in the target page.</p>
        <TestAutomaticallyPassedNotice />
        <ol>
            <li>
                In the target page, examine each landmark to verify that it has the{' '}
                <Markup.CodeTerm>role</Markup.CodeTerm> that best describes its content:
                <ol>
                    <li>
                        <Markup.Term>Banner</Markup.Term> - Identifies site-oriented content at the
                        beginning of each page within a website. Site-oriented content typically
                        includes things such as the logo or identity of the site sponsor, and a
                        site-specific search tool. A banner usually appears at the top of the page
                        and typically spans the full width.
                    </li>
                    <li>
                        <Markup.Term>Complementary</Markup.Term> - Identifies a supporting section
                        of the document, designed to be complementary to the main content at a
                        similar level in the DOM hierarchy, but which remains meaningful when
                        separated from the main content.
                    </li>
                    <li>
                        <Markup.Term>Contentinfo</Markup.Term> - Identifies common information at
                        the bottom of each page within a website, typically called the "footer" of
                        the page, including information such as copyrights and links to privacy and
                        accessibility statements.
                    </li>
                    <li>
                        <Markup.Term>Form</Markup.Term> - Identifies a set of items and objects that
                        combine to create a form when no other named landmark is appropriate (e.g.
                        main or search). To function as a landmark, a form must have a label.
                    </li>
                    <li>
                        <Markup.Term>Main</Markup.Term> - Identifies the primary content of the
                        page.
                    </li>
                    <li>
                        <Markup.Term>Navigation</Markup.Term> - Identifies a set of links that are
                        intended to be used for website or page content navigation.
                    </li>
                    <li>
                        <Markup.Term>Region</Markup.Term> - Identifies content that is sufficiently
                        important for users to be able to navigate to it AND no other named landmark
                        is appropriate. To function as a landmark, a region must have a label.
                    </li>
                    <li>
                        <Markup.Term>Search</Markup.Term> - Identifies a set of items and objects
                        that combine to create search functionality.
                    </li>
                </ol>
            </li>
            <AssistedTestRecordYourResults />
        </ol>
    </div>
);

export const LandmarkRoles: Requirement = {
    key: LandmarkTestStep.landmarkRoles,
    name: 'Landmark roles',
    description,
    howToTest,
    isManual: false,
    guidanceLinks: [link.WCAG_1_3_1],
    columnsConfig: [
        {
            key: 'landmark-role-and-label',
            name: 'Landmark role / Landmark label',
            onRender: landmarksAssessmentInstanceDetailsColumnRenderer,
        },
    ],
    reportInstanceFields: [
        ReportInstanceField.fromPropertyBagFunction<LandmarksAssessmentProperties>(
            'Role',
            'role',
            pb => pb.role + (pb.label ? ': ' + pb.label : ''),
        ),
    ],
    getAnalyzer: provider =>
        provider.createRuleAnalyzer(
            AnalyzerConfigurationFactory.forScanner({
                rules: ['unique-landmark'],
                key: LandmarkTestStep.landmarkRoles,
                testType: VisualizationType.LandmarksAssessment,
            }),
        ),
    getDrawer: provider => provider.createLandmarksDrawer(),
    getVisualHelperToggle: props => <AssessmentVisualizationEnabledToggle {...props} />,
    ...content,
};
