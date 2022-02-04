// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeadingLevel } from 'common/components/heading-element-for-level';
import { FeatureFlags } from 'common/feature-flags';
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { CardRuleResult, CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import {
    TabStopRequirementState,
    TabStopRequirementStatus,
} from 'common/types/store-data/visualization-scan-result-data';
import { requirements } from 'DetailsView/components/tab-stops/requirements';
import * as React from 'react';
import { SectionProps } from './report-section-factory';

export type TabStopsChecksSectionWrapperProps = Pick<
    SectionProps,
    'deps' | 'cardSelectionMessageCreator'
> & {
    checksSection: ReactFCWithDisplayName<
        Pick<
            SectionProps,
            'deps' | 'cardsViewData' | 'cardSelectionMessageCreator' | 'sectionHeadingLevel'
        >
    >;
    tabStops: TabStopRequirementState;
    testKey?: string;
    sectionHeadingLevel: HeadingLevel;
    featureFlagStoreData: FeatureFlagStoreData;
};

export class TabStopsChecksSectionWrapper extends React.Component<TabStopsChecksSectionWrapperProps> {
    public render(): React.ReactNode {
        return (
            <this.props.checksSection
                sectionHeadingLevel={this.props.sectionHeadingLevel}
                testKey="tab-stops"
                cardsViewData={this.prepareCardsViewData()}
                {...this.props}
            />
        );
    }

    private prepareCardsViewData = () => {
        const cardsViewData: CardsViewModel = {
            cards: {
                fail: this.buildCardRuleResults('fail'),
                pass: this.buildCardRuleResults('pass'),
                unknown: this.buildCardRuleResults('unknown'),
                inapplicable: [],
            },
            visualHelperEnabled: false,
            allCardsCollapsed: true,
        };

        return cardsViewData;
    };

    private buildCardRuleResults = (status: TabStopRequirementStatus) => {
        const results: CardRuleResult[] = [];
        for (const [requirementId, data] of Object.entries(this.props.tabStops)) {
            if (data.status !== status) {
                continue;
            }
            const requirementResults = requirements(
                this.props.featureFlagStoreData != null &&
                    this.props.featureFlagStoreData[FeatureFlags.tabStopsAutomation],
            );
            results.push({
                id: requirementResults[requirementId].name,
                description: requirementResults[requirementId].description,
                nodes: [],
                isExpanded: data.isExpanded,
                url: '',
                guidance: requirementResults[requirementId].guidance,
            });
        }
        return results;
    };
}
