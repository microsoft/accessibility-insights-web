// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleIdToResourceUrl } from "common/configs/rule-resource-links";
import { CardSelectionViewData } from "common/get-card-selection-view-data";
import { UUIDGenerator } from "common/uid-generator";
import { GroupedResults, FailuresGroup, AxeRuleData } from "reports/package/accessibilityInsightsReport";
import { CombinedResultsToCardsModelConverter } from "reports/package/combined-results-to-cards-model-converter";
import { GuidanceLink } from "scanner/rule-to-links-mappings";
import { IMock, It, Mock } from "typemoq";

describe(CombinedResultsToCardsModelConverter, () => {
    const viewDataStub: CardSelectionViewData = {
        selectedResultUids: [],
        expandedRuleIds: [],
        visualHelperEnabled: false,
        resultsHighlightStatus: {},
    };
    let getGuidanceLinksMock: IMock<(ruleId: string) => GuidanceLink[]>;
    let uuidGeneratorMock: IMock<UUIDGenerator>;
    let getRuleResourceUrlMock: IMock<RuleIdToResourceUrl>;

    let testSubject: CombinedResultsToCardsModelConverter;

    beforeEach(() => {
        getGuidanceLinksMock = Mock.ofInstance(() => null);
        uuidGeneratorMock = Mock.ofType<UUIDGenerator>();
        uuidGeneratorMock.setup(ug => ug()).returns(() => 'test uid');
        getRuleResourceUrlMock = Mock.ofType<RuleIdToResourceUrl>();
        
        testSubject = new CombinedResultsToCardsModelConverter(
            getGuidanceLinksMock.object,
            viewDataStub,
            uuidGeneratorMock.object,
            getRuleResourceUrlMock.object,
        );
    })

    it('with issues', () => {
        setupGuidanceLinks();
        const input: GroupedResults = {
            failed: [makeFailuresGroup('failed-rule-1'), makeFailuresGroup('failed-rule-2')],
            passed: [makeRule('passed-rule-1')],
            notApplicable: [makeRule('inapplicable-rule-1')],
        };

        const cardsViewModel = testSubject.convertResults(input);

        expect(cardsViewModel).toMatchSnapshot();
    });

    it('without issues', () => {
        setupGuidanceLinks();
        const input: GroupedResults = {
            failed: [],
            passed: [makeRule('passed-rule-1'), makeRule('passed-rule-2')],
            notApplicable: [makeRule('inapplicable-rule-1'), makeRule('inapplicable-rule-2')],
        };

        const cardsViewModel = testSubject.convertResults(input);

        expect(cardsViewModel).toMatchSnapshot();
    });

    it('without passed or inapplicable rules', () => {
        setupGuidanceLinks();
        const input: GroupedResults = {
            failed: [makeFailuresGroup('failed-rule-1')],
        };

        const cardsViewModel = testSubject.convertResults(input);

        expect(cardsViewModel).toMatchSnapshot();
    });

    function setupGuidanceLinks() {
        getGuidanceLinksMock.setup(gl => gl(It.isAny())).returns((ruleId) => {
            return [{
                href: `https://guidance-link-stub/${ruleId}`,
                text: `guidance for ${ruleId}`,
            }];
        });
    }

    function makeFailuresGroup(ruleId: string): FailuresGroup {
        return {
            key: ruleId,
            failed: [
                {
                    rule: makeRule(ruleId),
                    elementSelector: `.${ruleId}-selector-1`,
                    fix: `Fix the ${ruleId} violation`,
                    snippet: `<div>snippet 1</div>`,
                    urls: [`https://example.com/${ruleId}/only-violation`]
                },
                {
                    rule: makeRule(ruleId),
                    elementSelector: `.${ruleId}-selector-2`,
                    fix: `Fix the ${ruleId} violation`,
                    snippet: `<div>snippet 2</div>`,
                    urls: [`https://example.com/${ruleId}/violations/1`, `https://example.com/${ruleId}/violations/2`, `https://example.com/${ruleId}/violations/3`]
                }
            ]
        };
    }

    function makeRule(ruleId: string): AxeRuleData {
        return {
            ruleId,
            description: `${ruleId} description`,
            ruleUrl: `https://example.com/rules/${ruleId}`,
            tags: ['common-tag', `${ruleId}-specific-tag`],
        };
    }
});
