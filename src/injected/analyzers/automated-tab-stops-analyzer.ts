// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Analyzer } from './analyzer';

export class AutomatedTabStopsAnalyzer implements Analyzer {
    constructor(private readonly tabStopsAnalyzer: Analyzer) {}

    public analyze(): void {
        this.tabStopsAnalyzer.analyze();
    }

    public teardown(): void {
        this.tabStopsAnalyzer.teardown();
    }
}
