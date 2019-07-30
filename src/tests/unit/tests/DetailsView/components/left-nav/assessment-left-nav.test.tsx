// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { ManualTestStatus, ManualTestStatusData } from '../../../../../../common/types/manual-test-status';
import {
    AssessmentLeftNav,
    AssessmentLeftNavDeps,
    AssessmentLeftNavLink,
    AssessmentLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/assessment-left-nav';
import { LeftNavLinkBuilder } from '../../../../../../DetailsView/components/left-nav/left-nav-link-builder';
import { NavLinkHandler } from '../../../../../../DetailsView/components/left-nav/nav-link-handler';
import { DictionaryStringTo } from '../../../../../../types/common-types';

describe('AssessmentLeftNav', () => {
    let linkStub: AssessmentLeftNavLink;
    let deps: AssessmentLeftNavDeps;
    let props: AssessmentLeftNavProps;
    let leftNavLinkBuilderMock: IMock<LeftNavLinkBuilder>;
    let navLinkHandlerMock: NavLinkHandler;
    let assessmentsProviderStub: AssessmentsProvider;
    let assessmentsDataStub: DictionaryStringTo<ManualTestStatusData>;

    beforeEach(() => {
        assessmentsDataStub = {};
        assessmentsProviderStub = {} as AssessmentsProvider;
        leftNavLinkBuilderMock = Mock.ofType(LeftNavLinkBuilder);
        navLinkHandlerMock = {
            onOverviewClick: () => {},
            onAssessmentTestClick: (x, y) => {},
        } as NavLinkHandler;
        linkStub = {
            status: ManualTestStatus.UNKNOWN,
        } as AssessmentLeftNavLink;
        deps = {
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            navLinkHandler: navLinkHandlerMock,
        } as AssessmentLeftNavDeps;
        props = {
            deps,
            selectedKey: 'some key',
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            assessmentsProvider: assessmentsProviderStub,
            assessmentsData: assessmentsDataStub,
        };

        leftNavLinkBuilderMock
            .setup(lnlbm =>
                lnlbm.buildOverviewLink(deps, navLinkHandlerMock.onOverviewClick, assessmentsProviderStub, assessmentsDataStub, 0),
            )
            .returns(() => linkStub);

        leftNavLinkBuilderMock
            .setup(lnlbm =>
                lnlbm.buildAssessmentTestLinks(
                    deps,
                    navLinkHandlerMock.onAssessmentTestClick,
                    assessmentsProviderStub,
                    assessmentsDataStub,
                    1,
                ),
            )
            .returns(() => [linkStub]);
    });

    it('render with index icon', () => {
        const actual = shallow(<AssessmentLeftNav {...props} />);
        const renderIcon: (link: AssessmentLeftNavLink) => JSX.Element = actual.prop('renderIcon');
        const renderedIcon = shallow(renderIcon(linkStub));

        expect(actual.getElement()).toMatchSnapshot();
        expect(renderedIcon.getElement()).toMatchSnapshot();
    });

    it('render with status icon', () => {
        linkStub.status = -1;
        const actual = shallow(<AssessmentLeftNav {...props} />);
        const renderIcon: (link: AssessmentLeftNavLink) => JSX.Element = actual.prop('renderIcon');
        const renderedIcon = shallow(renderIcon(linkStub));

        expect(actual.getElement()).toMatchSnapshot();
        expect(renderedIcon.getElement()).toMatchSnapshot();
    });
});
