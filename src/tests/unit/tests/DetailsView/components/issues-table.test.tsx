// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { DateProvider } from 'common/date-provider';
import { NamedFC } from 'common/react/named-fc';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    IssuesTable,
    IssuesTableDeps,
    IssuesTableProps,
} from 'DetailsView/components/issues-table';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, Mock } from 'typemoq';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';

describe('IssuesTableTest', () => {
    let deps: IssuesTableDeps;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        reportGeneratorMock = Mock.ofType(ReportGenerator);
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        deps = {
            getDateFromTimestamp: DateProvider.getDateFromTimestamp,
            reportGenerator: reportGeneratorMock.object,
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
        } as IssuesTableDeps;
    });

    it('spinner, issuesEnabled == null', () => {
        const props = new TestPropsBuilder().setDeps(deps).build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('includes subtitle if specified', () => {
        const props = new TestPropsBuilder().setSubtitle(<>test subtitle text</>).build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('automated checks disabled', () => {
        const issuesEnabled = false;

        const props = new TestPropsBuilder().setDeps(deps).setIssuesEnabled(issuesEnabled).build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('inline start over button', () => {
        const issuesEnabled = false;
        const testType = VisualizationType.ColorSensoryAssessment;
        const clickEvent = {} as MouseEvent;

        const props = new TestPropsBuilder()
            .setDeps(deps)
            .setIssuesEnabled(issuesEnabled)
            .setTestType(testType)
            .build();

        detailsViewActionMessageCreatorMock
            .setup(amc => amc.rescanVisualization(testType, clickEvent))
            .verifiable();

        const wrapped = shallow(<IssuesTable {...props} />);

        const button = wrapped.find(InsightsCommandButton);
        button.simulate('click', clickEvent);

        detailsViewActionMessageCreatorMock.verifyAll();
    });

    it('spinner for scanning state', () => {
        const issuesEnabled = true;

        const props = new TestPropsBuilder()
            .setDeps(deps)
            .setIssuesEnabled(issuesEnabled)
            .setScanning(true)
            .build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('not scanning, issuesEnabled is true', () => {
        const props = new TestPropsBuilder().setDeps(deps).setIssuesEnabled(true).build();

        const wrapper = shallow(<IssuesTable {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

class TestPropsBuilder {
    private title: string = 'test title';
    private subtitle?: JSX.Element;
    private issuesEnabled: boolean;
    private scanning: boolean = false;
    private featureFlags = {};
    private deps: IssuesTableDeps;
    private testType: VisualizationType = -1;

    public setDeps(deps: IssuesTableDeps): TestPropsBuilder {
        this.deps = deps;
        return this;
    }

    public setScanning(newValue: boolean): TestPropsBuilder {
        this.scanning = newValue;
        return this;
    }

    public setIssuesEnabled(data: boolean): TestPropsBuilder {
        this.issuesEnabled = data;
        return this;
    }

    public setSubtitle(subtitle?: JSX.Element): TestPropsBuilder {
        this.subtitle = subtitle;
        return this;
    }

    public setTestType(testType: VisualizationType): TestPropsBuilder {
        this.testType = testType;
        return this;
    }

    public build(): IssuesTableProps {
        return {
            deps: this.deps,
            title: this.title,
            subtitle: this.subtitle,
            issuesEnabled: this.issuesEnabled,
            scanning: this.scanning,
            featureFlags: this.featureFlags,
            scanMetadata: {
                targetAppInfo: { name: 'app' },
            } as ScanMetadata,
            cardsViewData: {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
            userConfigurationStoreData: {
                bugService: 'gitHub',
            } as UserConfigurationStoreData,
            instancesSection: NamedFC<CommonInstancesSectionProps>(
                'SomeInstancesSection',
                _ => null,
            ),
            visualizationStoreData: {
                selectedFastPassDetailsView: this.testType,
            } as VisualizationStoreData,
        };
    }
}
