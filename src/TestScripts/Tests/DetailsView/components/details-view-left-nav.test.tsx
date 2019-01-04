// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { shallow } from 'enzyme';
import { NavBase } from 'office-ui-fabric-react/lib/components/Nav/Nav.base';
import { PivotBase, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { IMock, It, Mock, Times, MockBehavior } from 'typemoq';

import { IAssessmentsProvider } from '../../../../assessments/types/iassessments-provider';
import { PivotConfiguration } from '../../../../common/configs/pivot-configuration';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { FeatureFlags } from '../../../../common/feature-flags';
import { DetailsViewPivotType } from '../../../../common/types/details-view-pivot-type';
import { IManualTestStatus, ManualTestStatus } from '../../../../common/types/manual-test-status';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../DetailsView/actions/details-view-action-message-creator';
import {
    DetailsViewLeftNav,
    DetailsViewLeftNavDeps,
    DetailsViewLeftNavProps,
    NavLinkForLeftNav,
} from '../../../../DetailsView/components/details-view-left-nav';
import { EventStubFactory, IEventStub } from '../../../Common/event-stub-factory';
import {
    CreateTestAssessmentProviderWithFeatureFlag,
    createTestStepStatuses,
} from '../../../Common/test-assessment-provider';
import { DetailsRightPanelConfiguration } from '../../../../DetailsView/components/details-view-right-panel';


describe('DetailsViewLeftNavTest', () => {
    const eventStubFactory = new EventStubFactory();
    const assessmentsProvider: IAssessmentsProvider = CreateTestAssessmentProviderWithFeatureFlag();
    const assessmentsData: IDictionaryStringTo<IManualTestStatus> = createTestStepStatuses({
        stepFinalResult: ManualTestStatus.PASS,
        isStepScanned: false,
    });

    test('render: newAssessmentExperience', () => {
        const props: DetailsViewLeftNavProps = createDefaultPropsBuilder()
            .build();

        const wrapper = shallow(<DetailsViewLeftNav {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('renderNav', () => {
        const props = {} as DetailsViewLeftNavProps;
        const testSubject = new TestableDetailsViewLeftNav(props);

        const selectedKey = 'selected-key';
        const links = [
            {
                name: 'link-name-1',
            },
            {
                name: 'link-name-2',
            },
        ] as NavLinkForLeftNav[];
        const renderIcon = () => <i>renderIcon</i>;

        const actual = testSubject.getRenderNav()(selectedKey, links, renderIcon);

        expect(actual).toMatchSnapshot();
    });

    test('renderNavLink', () => {
        const props = {} as DetailsViewLeftNavProps;
        const testSubject = new TestableDetailsViewLeftNav(props);

        const link = {
            name: 'link-name-1',
            title: 'link-title-1',
            onRenderNavLink: (l, ri) => <div>{ri(l)}<div>{l.name}</div></div>,
        } as NavLinkForLeftNav;
        const renderIcon = (l: NavLinkForLeftNav) => <i>{l.title}</i>;

        const actual = testSubject.getRenderNavLink()(link, renderIcon);

        expect(actual).toMatchSnapshot();
    });

    test('render: onPivotItemClick', () => {
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator, MockBehavior.Strict);
        const props = {
            actionCreator: actionMessageCreatorMock.object,
        } as DetailsViewLeftNavProps;
        const testSubject = new TestableDetailsViewLeftNav(props);
        const pivotItemStub = {
            props: {
                itemKey: 'some key',
            },
        } as PivotItem;
        const eventStub = {} as React.MouseEvent<HTMLElement>;

        actionMessageCreatorMock
            .setup(amcm => amcm.sendPivotItemClicked(pivotItemStub.props.itemKey, eventStub))
            .verifiable();

        testSubject.getOnPivotItemClick()(pivotItemStub, eventStub);

        actionMessageCreatorMock.verifyAll();
    });

    test('render: onNavLinkClick', () => {
        const onLeftNavLinkClickMock = Mock.ofInstance(
            (event: React.MouseEvent<HTMLElement>, item: NavLinkForLeftNav, pivot: DetailsViewPivotType) => null,
            MockBehavior.Strict,
        )
        const props = {
            selectedPivot: -1,
        } as DetailsViewLeftNavProps;
        const testSubject = new TestableDetailsViewLeftNav(props);
        const linkStub = {
            onClickNavLink: onLeftNavLinkClickMock.object,
        } as NavLinkForLeftNav;
        const eventStub = {} as React.MouseEvent<HTMLElement>;

        onLeftNavLinkClickMock
            .setup(olnlc => olnlc(eventStub, linkStub, props.selectedPivot))
            .verifiable();

        testSubject.getOnNavLinkClick()(eventStub, linkStub);

        onLeftNavLinkClickMock.verifyAll();
    });

    test('render: onNavLinkClick with null item/link', () => {
        const props = {
            selectedPivot: -1,
        } as DetailsViewLeftNavProps;
        const testSubject = new TestableDetailsViewLeftNav(props);
        const linkStub = null;
        const eventStub = {} as React.MouseEvent<HTMLElement>;

        testSubject.getOnNavLinkClick()(eventStub, linkStub);
    });

    const createDefaultPropsBuilder = (): IDetailsViewLeftNavPropsBuilder => {
        return new IDetailsViewLeftNavPropsBuilder(assessmentsProvider, assessmentsData);
    };
});

class IDetailsViewLeftNavPropsBuilder {
    private selectedDetailsView: VisualizationType = VisualizationType.Headings;
    private selectedPivot: DetailsViewPivotType = DetailsViewPivotType.allTest;
    private actionCreatorMock: IMock<DetailsViewActionMessageCreator> = Mock.ofType(DetailsViewActionMessageCreator);
    private pivotConfigurationMock = Mock.ofType(PivotConfiguration);
    private featureFlagStoreData: IDictionaryStringTo<boolean> = {
        [FeatureFlags.newAssessmentExperience]: false,
    };
    private rightPanelConfiguration = {} as DetailsRightPanelConfiguration;

    constructor(
        private assessmentsProvider: IAssessmentsProvider,
        private assessmentsData: IDictionaryStringTo<IManualTestStatus>,
    ) { }

    public setSelectedPivot(newValue: DetailsViewPivotType): IDetailsViewLeftNavPropsBuilder {
        this.selectedPivot = newValue;
        return this;
    }

    public setSendPivotItemClick(pivotItem, event): IDetailsViewLeftNavPropsBuilder {
        this.actionCreatorMock
            .setup(ac => ac.sendPivotItemClicked(pivotItem.props.itemKey, event))
            .verifiable();

        return this;
    }

    public setSelectedDetailsView(type: VisualizationType): IDetailsViewLeftNavPropsBuilder {
        this.selectedDetailsView = type;
        return this;
    }

    public setupSelectDetailsView(event: IEventStub, type: VisualizationType): IDetailsViewLeftNavPropsBuilder {
        this.actionCreatorMock
            .setup(a => a.selectDetailsView(event as any, It.isValue(type), this.selectedPivot))
            .verifiable();

        return this;
    }

    public setupSelectedDetailsViewToNotBeCalled(): IDetailsViewLeftNavPropsBuilder {
        this.actionCreatorMock
            .setup(a => a.selectDetailsView(It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.never());

        return this;
    }

    public setNewAssessmentFeatureFlag(enabled: boolean): IDetailsViewLeftNavPropsBuilder {
        this.featureFlagStoreData[FeatureFlags.newAssessmentExperience] = enabled;
        return this;
    }

    public build(): DetailsViewLeftNavProps {
        this.pivotConfigurationMock
            .setup(pc => pc.getTestsByType(DetailsViewPivotType.allTest))
            .returns(() => [VisualizationType.Issues, VisualizationType.Landmarks, VisualizationType.Headings, VisualizationType.TabStops]);

        this.pivotConfigurationMock
            .setup(pc => pc.getTestsByType(DetailsViewPivotType.fastPass))
            .returns(() => [VisualizationType.Issues, VisualizationType.TabStops]);

        this.pivotConfigurationMock
            .setup(pc => pc.getTestsByType(DetailsViewPivotType.assessment))
            .returns(() => [VisualizationType.Headings]);

        const deps: DetailsViewLeftNavDeps = {
            pivotConfiguration: this.pivotConfigurationMock.object,
            visualizationConfigurationFactory: new VisualizationConfigurationFactory(),
            getAssessmentSummaryModelFromProviderAndStatusData: null,
            navLinkHandler: null,
        };

        const props: DetailsViewLeftNavProps = {
            deps,
            selectedDetailsView: this.selectedDetailsView,
            selectedPivot: this.selectedPivot,
            actionCreator: this.actionCreatorMock.object,
            pivotConfiguration: deps.pivotConfiguration,
            visualizationConfigurationFactory: deps.visualizationConfigurationFactory,
            featureFlagStoreData: this.featureFlagStoreData,
            assessmentsProvider: this.assessmentsProvider,
            assessmentsData: this.assessmentsData,
            rightPanelConfiguration: this.rightPanelConfiguration,
        };

        return props;
    }

    public verifyAll(): void {
        this.actionCreatorMock.verifyAll();
    }
}

class TestableDetailsViewLeftNav extends DetailsViewLeftNav {
    public getRenderNav() {
        return this.renderNav;
    }

    public getRenderNavLink() {
        return this.renderNavLink;
    }

    public getOnPivotItemClick() {
        return this.onPivotItemClick;
    }

    public getOnNavLinkClick() {
        return this.onNavLinkClick;
    }
}
