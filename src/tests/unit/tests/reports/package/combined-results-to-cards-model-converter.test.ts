// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionViewData } from "common/get-card-selection-view-data";
import { GuidanceLink } from 'common/types/store-data/guidance-links';
import { UUIDGenerator } from "common/uid-generator";
import { ResolutionCreator } from "injected/adapters/resolution-creator";
import { GroupedResults, FailuresGroup, AxeRuleData, HowToFixData } from "reports/package/accessibilityInsightsReport";
import { CombinedResultsToCardsModelConverter } from "reports/package/combined-results-to-cards-model-converter";
import { HelpUrlGetter } from "scanner/help-url-getter";
import { IMock, It, Mock } from "typemoq";

describe(CombinedResultsToCardsModelConverter, () => {
    const viewDataStub: CardSelectionViewData = {
        selectedResultUids: [],
        expandedRuleIds: [],
        visualHelperEnabled: false,
        resultsHighlightStatus: {},
    };
    let mapAxeTagsToGuidanceLinksMock: IMock<(axeTags?: string[]) => GuidanceLink[]>;
    let uuidGeneratorMock: IMock<UUIDGenerator>;
    const helpUrlGetterStub = {
        getHelpUrl: (ruleId, defaultUrl) => {
            return `url for ${ruleId} with default url ${defaultUrl}`;
        }
    } as HelpUrlGetter;
    let resolutionCreatorMock: IMock<ResolutionCreator>;

    let testSubject: CombinedResultsToCardsModelConverter;

    beforeEach(() => {
        mapAxeTagsToGuidanceLinksMock = Mock.ofInstance(() => null);
        uuidGeneratorMock = Mock.ofType<UUIDGenerator>();
        uuidGeneratorMock.setup(ug => ug()).returns(() => 'test uid');
        resolutionCreatorMock = Mock.ofType<ResolutionCreator>();

        setupGuidanceLinks();
        setupResolutionCreator();
        
        testSubject = new CombinedResultsToCardsModelConverter(
            mapAxeTagsToGuidanceLinksMock.object,
            viewDataStub,
            uuidGeneratorMock.object,
            helpUrlGetterStub,
            resolutionCreatorMock.object,
        );
    })

    it('with issues', () => {
        const input: GroupedResults = {
            failed: [makeFailuresGroup('failed-rule-1'), makeFailuresGroup('failed-rule-2')],
            passed: [makeRule('passed-rule-1')],
            notApplicable: [makeRule('inapplicable-rule-1')],
        };

        const cardsViewModel = testSubject.convertResults(input);

        expect(cardsViewModel).toMatchSnapshot();
    });

    it('with baseline-aware issues', () => {
        const input: GroupedResults = {
            failed: [makeBaselineAwareFailuresGroup('failed-rule-1'), makeBaselineAwareFailuresGroup('failed-rule-2')],
            passed: [makeRule('passed-rule-1')],
            notApplicable: [makeRule('inapplicable-rule-1')],
        };

        const cardsViewModel = testSubject.convertResults(input);

        expect(cardsViewModel).toMatchSnapshot();
    });

    it('with a mixture of url specifications', () => {
        const input: GroupedResults = {
            failed: [makeFailuresGroupWithMixedUrlSpecifications('failed-rule-1')],
            passed: [makeRule('passed-rule-1')],
            notApplicable: [makeRule('inapplicable-rule-1')],
        };

        const cardsViewModel = testSubject.convertResults(input);

        expect(cardsViewModel).toMatchSnapshot();
    });

    it('without issues', () => {
        const input: GroupedResults = {
            failed: [],
            passed: [makeRule('passed-rule-1'), makeRule('passed-rule-2')],
            notApplicable: [makeRule('inapplicable-rule-1'), makeRule('inapplicable-rule-2')],
        };

        const cardsViewModel = testSubject.convertResults(input);

        expect(cardsViewModel).toMatchSnapshot();
    });

    it('without passed or inapplicable rules', () => {
        const input: GroupedResults = {
            failed: [makeFailuresGroup('failed-rule-1')],
        };

        const cardsViewModel = testSubject.convertResults(input);

        expect(cardsViewModel).toMatchSnapshot();
    });

    function setupGuidanceLinks() {
        mapAxeTagsToGuidanceLinksMock.setup(gl => gl(It.isAny())).returns((axeTags) => {
            const tagStr = (axeTags ?? []).join('-');
            return [{
                href: `https://guidance-link-stub/${tagStr}`,
                text: `guidance for ${tagStr}`,
            }];
        });
    }

    function setupResolutionCreator() {
        resolutionCreatorMock.setup(rc => rc(It.isAny())).returns(data => {
            return {'how-to-fix': `fix ${data.nodeResult.failureSummary}`};
        });
    }

    function makeFailuresGroup(ruleId: string): FailuresGroup {
        return {
            key: ruleId,
            failed: [
                {
                    rule: makeRule(ruleId),
                    elementSelector: `.${ruleId}-selector-1`,
                    fix: makeHowToFixData(ruleId, 1),
                    snippet: `<div>snippet 1</div>`,
                    urls: [`https://example.com/${ruleId}/only-violation`]
                },
                {
                    rule: makeRule(ruleId),
                    elementSelector: `.${ruleId}-selector-2`,
                    fix: makeHowToFixData(ruleId, 2),
                    snippet: `<div>snippet 2</div>`,
                    urls: [`https://example.com/${ruleId}/violations/1`, `https://example.com/${ruleId}/violations/2`, `https://example.com/${ruleId}/violations/3`]
                }
            ]
        };
    }

    function makeBaselineAwareFailuresGroup(ruleId: string): FailuresGroup {
        return {
            key: ruleId,
            failed: [
                {
                    rule: makeRule(ruleId),
                    elementSelector: `.${ruleId}-selector-1`,
                    fix: makeHowToFixData(ruleId, 1),
                    snippet: `<div>snippet 1</div>`,
                    urls: [ {url: `https://example.com/${ruleId}/only-violation`, baselineStatus: 'existing'}, ]
                },
                {
                    rule: makeRule(ruleId),
                    elementSelector: `.${ruleId}-selector-2`,
                    fix: makeHowToFixData(ruleId, 2),
                    snippet: `<div>snippet 2</div>`,
                    urls: [
                        {url: `https://example.com/${ruleId}/violations/1`, baselineStatus: 'unknown'}, 
                        {url: `https://example.com/${ruleId}/violations/2`, baselineStatus: 'existing'}, 
                        {url: `https://example.com/${ruleId}/violations/3`, baselineStatus: 'new'},
                    ]
                }
            ]
        };
    }

    function makeFailuresGroupWithMixedUrlSpecifications(ruleId: string): FailuresGroup {
        const urls: any = [
            `https://example.com/${ruleId}/violation-1`, 
            {url: `https://example.com/${ruleId}/violation-2`,},
            {url:`https://example.com/${ruleId}/violation-3`, baselineStatus: 'new'},
        ];

        return {
            key: ruleId,
            failed: [
                {
                    rule: makeRule(ruleId),
                    elementSelector: `.${ruleId}-selector-1`,
                    fix: makeHowToFixData(ruleId, 1),
                    snippet: `<div>snippet 1</div>`,
                    urls,
                },
            ]
        };
    }

    function makeHowToFixData(ruleId: string, failureId: number): HowToFixData {
        return  {
            any: [],
            all: [],
            none: [],
            failureSummary: `Violation ${failureId} of rule ${ruleId}`,
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
