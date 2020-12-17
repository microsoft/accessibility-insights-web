// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SingleElementSelector } from 'common/types/store-data/scoping-store-data';
import { ScanResults } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';

export class PlaceholderAxeResult {
    results: DictionaryStringTo<any>;
    originalResult: ScanResults;
    include?: SingleElementSelector[];
    exclude?: SingleElementSelector[];

    constructor(timestamp: string) {
        this.results = {};
        this.originalResult = {
            passes: [
                {
                    id: 'fake rule #3',
                    nodes: [this.getDummyNode(1), this.getDummyNode(2), this.getDummyNode(3)],
                },
                {
                    id: 'fake rule #4',
                    nodes: [this.getDummyNode(1), this.getDummyNode(3)],
                },
            ],
            violations: [
                {
                    id: 'fake rule #1',
                    nodes: [this.getDummyNode(1), this.getDummyNode(2)],
                },
                {
                    id: 'fake rule #2',
                    nodes: [this.getDummyNode(1), this.getDummyNode(3)],
                },
            ],
            inapplicable: [],
            incomplete: [
                {
                    id: 'fake rule #3',
                    nodes: [this.getDummyNode(2)],
                },
            ],
            timestamp,
            targetPageTitle: 'placeholder title',
            targetPageUrl: 'https://placeholder.com/placeholder_title',
        };
    }

    private getDummyNode(index: number): AxeNodeResult {
        return {
            any: [],
            all: [],
            none: [],
            html: `Placeholder html #${index}`,
            target: [`Target #${index}`],
        };
    }
}
