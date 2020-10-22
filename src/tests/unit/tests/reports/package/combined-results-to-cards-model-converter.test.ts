// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardSelectionViewData } from "common/get-card-selection-view-data";
import { CardsViewModel } from "common/types/store-data/card-view-model";
import { CombinedResultsToCardsModelConverter } from "reports/package/combined-results-to-cards-model-converter";
import { GuidanceLink } from "scanner/rule-to-links-mappings";
import { IMock, Mock } from "typemoq";
import { combinedResultsWithoutIssues } from "./example-input/combined-results-without-issues";

describe(CombinedResultsToCardsModelConverter, () => {
    let getGuidanceLinksMock: IMock<(ruleId: string) => GuidanceLink[]>;
    const viewDataStub: CardSelectionViewData = {
        selectedResultUids: [],
        expandedRuleIds: [],
        visualHelperEnabled: false,
        resultsHighlightStatus: {},
    };

    let testSubject: CombinedResultsToCardsModelConverter;

    beforeEach(() => {
        getGuidanceLinksMock = Mock.ofInstance(() => null);
        testSubject = new CombinedResultsToCardsModelConverter(getGuidanceLinksMock.object, viewDataStub);
    })

    it('converts results without issues to cards view data', () => {
        const expected: CardsViewModel = {
            cards: {
                fail: [],
                pass: [],
                inapplicable: [],
                unknown: [],
            },
            visualHelperEnabled: viewDataStub.visualHelperEnabled,
            allCardsCollapsed: true,
        };

        const cardsViewModel = testSubject.convertResults(combinedResultsWithoutIssues.results.resultsByRule);

        expect(cardsViewModel).toEqual(expected);
    })
});
