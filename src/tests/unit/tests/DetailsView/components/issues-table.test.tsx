// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardInteractionSupport } from 'common/components/cards/card-interaction-support';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';
import { DateProvider } from 'common/date-provider';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import {
    IssueFilingServicePropertiesMap,
    UserConfigurationStoreData,
} from 'common/types/store-data/user-configuration-store';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    IssuesTable,
    IssuesTableDeps,
    IssuesTableProps,
} from 'DetailsView/components/issues-table';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { shallow } from 'enzyme';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, Mock } from 'typemoq';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';

const issueFilingKey = 'testkey';

describe('IssuesTableTest', () => {
    let deps: IssuesTableDeps;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let testIssueFilingServiceStub: IssueFilingService;
    const cardsViewController = {
        closeIssueFilingSettingsDialog: () => null,
    } as CardsViewController;
    let cardInteractionSupport: CardInteractionSupport;

    beforeEach(() => {
        reportGeneratorMock = Mock.ofType(ReportGenerator);
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);
        cardInteractionSupport = {
            supportsIssueFiling: false,
        } as CardInteractionSupport;
        testIssueFilingServiceStub = {
            getSettingsFromStoreData: data => data[issueFilingKey],
        } as IssueFilingService;
        issueFilingServiceProviderMock
            .setup(bp => bp.forKey(issueFilingKey))
            .returns(() => testIssueFilingServiceStub);

        deps = {
            getDateFromTimestamp: DateProvider.getDateFromTimestamp,
            reportGenerator: reportGeneratorMock.object,
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            cardsViewController: cardsViewController,
            issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            cardInteractionSupport: cardInteractionSupport,
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

    it('With issue filing support and null CardViewStoreData', () => {
        cardInteractionSupport.supportsIssueFiling = true;
        const props = new TestPropsBuilder()
            .setDeps(deps)
            .setCardsViewStoreData(null)
            .setIssuesEnabled(true)
            .build();

        const wrapper = shallow(<IssuesTable {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('With issue filing support and issue filing dialog closed', () => {
        cardInteractionSupport.supportsIssueFiling = true;
        const props = new TestPropsBuilder().setDeps(deps).setIssuesEnabled(true).build();

        const wrapper = shallow(<IssuesTable {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('With issue filing support and issue filing dialog open', () => {
        const issueDetailsData = {
            snippet: 'snippet',
        } as CreateIssueDetailsTextData;
        const cardsViewStoreData = {
            isIssueFilingSettingsDialogOpen: true,
            onIssueFilingSettingsDialogDismissed: () => null,
            selectedIssueData: issueDetailsData,
        };
        cardInteractionSupport.supportsIssueFiling = true;
        const props = new TestPropsBuilder()
            .setDeps(deps)
            .setCardsViewStoreData(cardsViewStoreData)
            .setIssuesEnabled(true)
            .build();

        const wrapper = shallow(<IssuesTable {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

class TestPropsBuilder {
    private title: string = 'test title';
    private stepsText: string = 'test steps text';
    private subtitle?: JSX.Element;
    private issuesEnabled: boolean;
    private scanning: boolean = false;
    private featureFlags = {};
    private deps: IssuesTableDeps;
    private testType: VisualizationType = -1;
    private cardsViewStoreData: CardsViewStoreData = {
        isIssueFilingSettingsDialogOpen: false,
    };

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

    public setCardsViewStoreData(data: CardsViewStoreData): TestPropsBuilder {
        this.cardsViewStoreData = data;
        return this;
    }

    public build(): IssuesTableProps {
        return {
            deps: this.deps,
            title: this.title,
            subtitle: this.subtitle,
            stepsText: this.stepsText,
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
                bugService: issueFilingKey,
                bugServicePropertiesMap: {
                    [issueFilingKey]: {},
                } as IssueFilingServicePropertiesMap,
            } as UserConfigurationStoreData,
            instancesSection: NamedFC<CommonInstancesSectionProps>(
                'SomeInstancesSection',
                _ => null,
            ),
            visualizationStoreData: {
                selectedFastPassDetailsView: this.testType,
            } as VisualizationStoreData,
            cardSelectionMessageCreator: {} as CardSelectionMessageCreator,
            cardsViewStoreData: this.cardsViewStoreData,
            narrowModeStatus: {} as NarrowModeStatus,
        };
    }
}
