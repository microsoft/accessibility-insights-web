// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardSelectionViewData } from "common/get-card-selection-view-data";
import { UUIDGenerator } from "common/uid-generator";
import { CombinedResultsToCardsModelConverter } from "reports/package/combined-results-to-cards-model-converter";
import { GuidanceLink } from "scanner/rule-to-links-mappings";
import { combinedResultsWithIssues } from "tests/unit/tests/reports/package/example-input/combined-results-with-issues";
import { IMock, It, Mock } from "typemoq";
import { combinedResultsWithoutIssues } from "./example-input/combined-results-without-issues";

describe(CombinedResultsToCardsModelConverter, () => {
    const viewDataStub: CardSelectionViewData = {
        selectedResultUids: [],
        expandedRuleIds: [],
        visualHelperEnabled: false,
        resultsHighlightStatus: {},
    };
    let getGuidanceLinksMock: IMock<(ruleId: string) => GuidanceLink[]>;
    let uuidGeneratorMock: IMock<UUIDGenerator>;

    let testSubject: CombinedResultsToCardsModelConverter;

    beforeEach(() => {
        getGuidanceLinksMock = Mock.ofInstance(() => null);
        uuidGeneratorMock = Mock.ofType<UUIDGenerator>();
        uuidGeneratorMock.setup(ug => ug()).returns(() => 'test uid');
        
        testSubject = new CombinedResultsToCardsModelConverter(
            getGuidanceLinksMock.object,
            viewDataStub,
            uuidGeneratorMock.object
        );
    })

    it('with issues', () => {
        setupGuidanceLinks();

        const cardsViewModel = testSubject.convertResults(combinedResultsWithIssues.results.resultsByRule);

        expect(cardsViewModel).toMatchSnapshot();
    });

    it('without issues', () => {
        setupGuidanceLinks();

        const cardsViewModel = testSubject.convertResults(combinedResultsWithoutIssues.results.resultsByRule);

        expect(cardsViewModel).toMatchSnapshot();
    });

    it('without passed or inapplicable rules', () => {
        setupGuidanceLinks();
        const onlyFailedResults = {
            failed: combinedResultsWithIssues.results.resultsByRule.failed,
        };

        const cardsViewModel = testSubject.convertResults(onlyFailedResults);

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
});
