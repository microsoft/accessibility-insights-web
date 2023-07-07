// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { CardInteractionSupport } from 'common/components/cards/card-interaction-support';
import { CardsViewController } from 'common/components/cards/cards-view-controller';
import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';
import { IssueFilingDialogPropsFactory } from 'common/components/get-issue-filing-dialog-props';
import { DateProvider } from 'common/date-provider';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { IssueFilingNeedsSettingsContentProps } from 'common/types/issue-filing-needs-setting-content';
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
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { shallow } from 'enzyme';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { IMock, Mock } from 'typemoq';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';

describe('IssuesTableTest', () => {
    let deps: IssuesTableDeps;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    const cardsViewController = {
        closeIssueFilingSettingsDialog: () => null,
    } as CardsViewController;
    let cardInteractionSupport: CardInteractionSupport;
    let issueFilingDialogPropsFactoryMock: IMock<IssueFilingDialogPropsFactory>;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let getProviderMock: IMock<() => AssessmentsProvider>;

    beforeEach(() => {
        reportGeneratorMock = Mock.ofType(ReportGenerator);
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);
        cardInteractionSupport = {
            supportsIssueFiling: false,
        } as CardInteractionSupport;
        issueFilingDialogPropsFactoryMock = Mock.ofInstance(() => null);
        assessmentsProviderMock = Mock.ofType<AssessmentsProvider>();
        getProviderMock = Mock.ofType<() => AssessmentsProvider>();
        getProviderMock.setup(g => g()).returns(() => assessmentsProviderMock.object);

        deps = {
            getDateFromTimestamp: DateProvider.getDateFromTimestamp,
            reportGenerator: reportGeneratorMock.object,
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            cardsViewController: cardsViewController,
            issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            cardInteractionSupport: cardInteractionSupport,
            issueFilingDialogPropsFactory: issueFilingDialogPropsFactoryMock.object,
        } as IssuesTableDeps;
    });

    it('spinner, issuesEnabled == null', () => {
        const props = new TestPropsBuilder()
            .setDeps(deps)
            .setGetProviderMock(getProviderMock)
            .build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('includes subtitle if specified', () => {
        const props = new TestPropsBuilder()
            .setGetProviderMock(getProviderMock)
            .setSubtitle(<>test subtitle text</>)
            .build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('automated checks disabled', () => {
        const issuesEnabled = false;

        const props = new TestPropsBuilder()
            .setGetProviderMock(getProviderMock)
            .setDeps(deps)
            .setIssuesEnabled(issuesEnabled)
            .build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('spinner for scanning state', () => {
        const issuesEnabled = true;

        const props = new TestPropsBuilder()
            .setDeps(deps)
            .setGetProviderMock(getProviderMock)
            .setIssuesEnabled(issuesEnabled)
            .setScanning(true)
            .build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('not scanning, issuesEnabled is true', () => {
        const props = new TestPropsBuilder()
            .setGetProviderMock(getProviderMock)
            .setDeps(deps)
            .setIssuesEnabled(true)
            .build();

        const wrapper = shallow(<IssuesTable {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('With issue filing support', () => {
        cardInteractionSupport.supportsIssueFiling = true;
        const props = new TestPropsBuilder()
            .setGetProviderMock(getProviderMock)
            .setDeps(deps)
            .setIssuesEnabled(true)
            .build();
        issueFilingDialogPropsFactoryMock
            .setup(i =>
                i(
                    props.userConfigurationStoreData,
                    props.cardsViewStoreData,
                    props.deps.cardsViewController,
                    props.deps,
                ),
            )
            .returns(
                () =>
                    ({
                        isOpen: false,
                    }) as IssueFilingNeedsSettingsContentProps,
            );

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
    private getProviderMock: IMock<() => AssessmentsProvider>;

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

    public setGetProviderMock(getProviderMock: IMock<() => AssessmentsProvider>): TestPropsBuilder {
        this.getProviderMock = getProviderMock;
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
            userConfigurationStoreData: {} as UserConfigurationStoreData,
            instancesSection: NamedFC<CommonInstancesSectionProps>(
                'SomeInstancesSection',
                _ => null,
            ),
            visualizationStoreData: {
                selectedFastPassDetailsView: this.testType,
            } as VisualizationStoreData,
            cardSelectionMessageCreator: {} as CardSelectionMessageCreator,
            cardsViewStoreData: {
                isIssueFilingSettingsDialogOpen: false,
            },
            narrowModeStatus: {} as NarrowModeStatus,
            selectedVisualizationType: 0,
            getProvider: this.getProviderMock.object,
        };
    }
}
