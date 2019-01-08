// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { INavLink } from 'office-ui-fabric-react/lib/Nav';
import * as React from 'react';
import { Mock } from 'typemoq';

import { IAssessmentsProvider } from '../../../../../../assessments/types/iassessments-provider';
import { PivotConfiguration } from '../../../../../../common/configs/pivot-configuration';
import {
    IVisualizationConfiguration,
    VisualizationConfigurationFactory,
} from '../../../../../../common/configs/visualization-configuration-factory';
import { DetailsViewPivotType } from '../../../../../../common/types/details-view-pivot-type';
import { ManualTestStatus } from '../../../../../../common/types/manual-test-status';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import { DetailsRightPanelConfiguration } from '../../../../../../DetailsView/components/details-view-right-panel';
import {
    AssessmentLeftNav,
    AssessmentLeftNavDeps,
    AssessmentLeftNavProps,
} from '../../../../../../DetailsView/components/left-nav/assessment-left-nav';
import { NavLinkHandler } from '../../../../../../DetailsView/components/left-nav/nav-link-handler';
import { CreateTestAssessmentProvider, createTestStepStatuses } from '../../../../common/test-assessment-provider';

describe('AssessmentLeftNav', () => {
    test('render fast pass', () => {
        const selectedDetailsView = VisualizationType.Landmarks;
        const selectedPivot = DetailsViewPivotType.fastPass;
        const selectedKeyStub = 'fake key';
        const getSelectedKeyMock = Mock.ofInstance(({type: VisualizationType}) => null);
        const rightPanelConfigurationStub: DetailsRightPanelConfiguration = {
            GetLeftNavSelectedKey: getSelectedKeyMock.object,
        } as DetailsRightPanelConfiguration;
        getSelectedKeyMock
            .setup(gskm => gskm(selectedDetailsView))
            .returns(() => selectedKeyStub);

        const pivotConfigurationMock = Mock.ofType<PivotConfiguration>();
        pivotConfigurationMock
            .setup(config => config.getTestsByType(selectedPivot))
            .returns(() => [selectedDetailsView]);

        const configurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        configurationFactoryMock
            .setup(config => config.getConfiguration(selectedDetailsView))
            .returns(() => {
                return {
                    displayableData: {
                        title: 'test title',
                    },
                } as IVisualizationConfiguration;
            });

        const visualizationConfigurationFactory = configurationFactoryMock.object;
        const pivotConfiguration = pivotConfigurationMock.object;

        const deps: AssessmentLeftNavDeps = {
            pivotConfiguration,
            visualizationConfigurationFactory,
            getAssessmentSummaryModelFromProviderAndStatusData: null,
            navLinkHandler: {} as NavLinkHandler,
        };

        const renderNav = (selectedKey: string, links: INavLink[], renderIcon: (INavLink) => JSX.Element) => {
            return (
                <div>
                    {selectedKeyStub}
                    {links.map(link => {
                        return (
                            <>
                                {link.name}
                                {renderIcon(link)}
                            </>
                        );
                    })
                    }
                </div>
            );
        };

        const props: AssessmentLeftNavProps = {
            deps,
            selectedPivot,
            selectedDetailsView,
            renderNav,
            assessmentsData: null,
            assessmentProvider: Mock.ofType<IAssessmentsProvider>().object,
            rightPanelConfiguration: rightPanelConfigurationStub,
        };

        const rendered = shallow(<AssessmentLeftNav {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    });

    const statuses = [
        ManualTestStatus.PASS,
        ManualTestStatus.FAIL,
        ManualTestStatus.UNKNOWN,
    ];

    test.each(statuses)('render assessments', status => {
        const assessmentProvider = CreateTestAssessmentProvider();
        const summaryModel = { byPercentage: { incomplete: 58 }};
        const getAssessmentSummaryModelFromProviderAndStatusDataMock = jest.fn(() => summaryModel);
        const selectedDetailsView = VisualizationType.Headings;
        const selectedKeyStub = 'fake key';
        const getSelectedKeyMock = Mock.ofInstance(({type: VisualizationType}) => null);

        const rightPanelConfigurationStub: DetailsRightPanelConfiguration = {
            GetLeftNavSelectedKey: getSelectedKeyMock.object,
        } as DetailsRightPanelConfiguration;

        getSelectedKeyMock
            .setup(gskm => gskm(selectedDetailsView))
            .returns(() => selectedKeyStub);

        const deps: AssessmentLeftNavDeps = {
            pivotConfiguration: Mock.ofType(PivotConfiguration).object,
            visualizationConfigurationFactory: Mock.ofType(VisualizationConfigurationFactory).object,
            getAssessmentSummaryModelFromProviderAndStatusData: getAssessmentSummaryModelFromProviderAndStatusDataMock,
            navLinkHandler: {} as NavLinkHandler,
        };

        const assessmentsData = createTestStepStatuses({
            stepFinalResult: status,
            isStepScanned: false,
        });

        const renderNav = (selectedKey: string, links: INavLink[], renderIcon: (INavLink) => JSX.Element) => {
            return (
                <div>
                    {selectedKey}
                    {links.map(link => {
                        return (
                            <>
                                {link.name}
                                {renderIcon(link)}
                                {link.onRenderNavLink(link, renderIcon)}
                            </>
                        );
                    })
                    }
                </div>
            );
        };

        const props: AssessmentLeftNavProps = {
            deps,
            selectedPivot: DetailsViewPivotType.assessment,
            selectedDetailsView: VisualizationType.Headings,
            renderNav,
            assessmentsData,
            assessmentProvider,
            rightPanelConfiguration: rightPanelConfigurationStub,
        };

        const rendered = shallow(<AssessmentLeftNav {...props} />);
        expect(rendered.debug()).toMatchSnapshot(`with status ${ManualTestStatus[status]}`);
    });
});
