// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { IAssessmentsProvider } from '../../../../../../assessments/types/iassessments-provider';
import { IManualTestStatus, ManualTestStatus } from '../../../../../../common/types/manual-test-status';
import {
    AssessmentLeftNavLink,
    AssessmentLeftNavV2,
    AssessmentLeftNavV2Deps,
    AssessmentLeftNavV2Props,
} from '../../../../../../DetailsView/components/left-nav/assessment-left-nav-v2';
import { LeftNavLinkBuilder } from '../../../../../../DetailsView/components/left-nav/left-nav-link-builder';
import { NavLinkHandler } from '../../../../../../DetailsView/components/left-nav/nav-link-handler';


describe('AssessmentLeftNavV2', () => {
    let linkStub: AssessmentLeftNavLink;
    let deps: AssessmentLeftNavV2Deps;
    let props: AssessmentLeftNavV2Props;
    let leftNavLinkBuilderMock: IMock<LeftNavLinkBuilder>;
    let navLinkHandlerMock: NavLinkHandler;
    let assessmentsProviderStub: IAssessmentsProvider;
    let assessmentsDataStub: IDictionaryStringTo<IManualTestStatus>;

    beforeEach(() => {
        assessmentsDataStub = {};
        assessmentsProviderStub = {} as IAssessmentsProvider;
        leftNavLinkBuilderMock = Mock.ofType(LeftNavLinkBuilder);
        navLinkHandlerMock = {
            onOverviewClick: () => {},
            onAssessmentTestClickV2: (x, y) => {},
        } as NavLinkHandler;
        linkStub = {
            status: ManualTestStatus.UNKNOWN,
        } as AssessmentLeftNavLink;
        deps = {
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            navLinkHandler: navLinkHandlerMock,
        } as AssessmentLeftNavV2Deps;
        props = {
            deps,
            selectedKey: 'some key',
            leftNavLinkBuilder: leftNavLinkBuilderMock.object,
            assessmentsProvider: assessmentsProviderStub,
            assessmentsData: assessmentsDataStub,
        };

        leftNavLinkBuilderMock
            .setup(lnlbm => lnlbm.buildOverviewLink(
                deps,
                navLinkHandlerMock.onOverviewClick,
                assessmentsProviderStub,
                assessmentsDataStub,
                0,
            ))
            .returns(() => linkStub);

        leftNavLinkBuilderMock
            .setup(lnlbm => lnlbm.buildAssessmentTestLinks(
                deps,
                navLinkHandlerMock.onAssessmentTestClickV2,
                assessmentsProviderStub,
                assessmentsDataStub,
                1,
            ))
            .returns(() => [linkStub]);
    });

    it('render with index icon', () => {
        const actual = shallow(<AssessmentLeftNavV2 {...props} />);
        const renderIcon: (link: AssessmentLeftNavLink) => JSX.Element = actual.prop('renderIcon');
        const renderedIcon = shallow(renderIcon(linkStub));

        expect(actual.getElement()).toMatchSnapshot();
        expect(renderedIcon.getElement()).toMatchSnapshot();
    });

    it('render with status icon', () => {
        linkStub.status = -1;
        const actual = shallow(<AssessmentLeftNavV2 {...props} />);
        const renderIcon: (link: AssessmentLeftNavLink) => JSX.Element = actual.prop('renderIcon');
        const renderedIcon = shallow(renderIcon(linkStub));

        expect(actual.getElement()).toMatchSnapshot();
        expect(renderedIcon.getElement()).toMatchSnapshot();
    });
});
