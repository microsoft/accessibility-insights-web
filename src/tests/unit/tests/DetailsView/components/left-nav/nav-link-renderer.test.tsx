// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { BaseLeftNavLink } from 'DetailsView/components/base-left-nav';
import {
    AssessmentLeftNavLink,
    TestRequirementLeftNavLink,
} from 'DetailsView/components/left-nav/assessment-left-nav';
import { NavLinkRenderer } from 'DetailsView/components/left-nav/nav-link-renderer';

describe('NavLinkRenderer', () => {
    let testSubject: NavLinkRenderer;

    beforeEach(() => {
        testSubject = new NavLinkRenderer();
    });

    describe('renderGettingStartedLink', () => {
        test('renders', () => {
            const linkStub = {
                title: 'some link',
            } as BaseLeftNavLink;

            const actual = testSubject.renderGettingStartedLink(linkStub);

            expect(actual).toMatchSnapshot();
        });
    });

    describe('renderOverviewLink', () => {
        test('renders', () => {
            const linkStub = {
                title: 'some link',
            } as BaseLeftNavLink;

            const actual = testSubject.renderOverviewLink(linkStub);

            expect(actual).toMatchSnapshot();
        });
    });

    describe('renderVisualizationLink', () => {
        test('renders', () => {
            const linkStub = {
                title: 'some link',
            } as BaseLeftNavLink;

            const actual = testSubject.renderVisualizationLink(linkStub);
            const renderedIcon = actual.props['renderIcon'](linkStub);

            expect(actual).toMatchSnapshot();
            expect(renderedIcon).toMatchSnapshot();
        });
    });

    describe('renderRequirementLink', () => {
        test('render status icon with link', () => {
            const linkStub = {
                status: ManualTestStatus.PASS,
            } as TestRequirementLeftNavLink;

            const actual = testSubject.renderRequirementLink(linkStub);
            const renderedIcon = actual.props['renderIcon'](linkStub);
            expect(actual).toMatchSnapshot();
            expect(renderedIcon).toMatchSnapshot();
        });

        test('render displayed index when status is unknown', () => {
            const linkStub = {
                status: ManualTestStatus.UNKNOWN,
                displayedIndex: 'some displayed index',
            } as TestRequirementLeftNavLink;

            const actual = testSubject.renderRequirementLink(linkStub);
            const renderedIcon = actual.props['renderIcon'](linkStub);
            expect(actual).toMatchSnapshot();
            expect(renderedIcon).toMatchSnapshot();
        });
    });

    describe('renderAssessmentTestLink', () => {
        test('render status icon with link', () => {
            const linkStub = {
                status: ManualTestStatus.PASS,
            } as AssessmentLeftNavLink;

            const actual = testSubject.renderAssessmentTestLink(linkStub);
            const renderedIcon = actual.props['renderIcon'](linkStub);
            expect(actual).toMatchSnapshot();
            expect(renderedIcon).toMatchSnapshot();
        });

        test('render index icon when status is unknown', () => {
            const linkStub = {
                status: ManualTestStatus.UNKNOWN,
            } as AssessmentLeftNavLink;

            const actual = testSubject.renderRequirementLink(linkStub);
            const renderedIcon = actual.props['renderIcon'](linkStub);
            expect(actual).toMatchSnapshot();
            expect(renderedIcon).toMatchSnapshot();
        });
    });
});
