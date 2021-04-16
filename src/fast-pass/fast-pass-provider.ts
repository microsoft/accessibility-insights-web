// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';

export class FastPassProvider {
    private static fastPassVisualizations: VisualizationType[] = [
        VisualizationType.Issues,
        VisualizationType.TabStops,
        VisualizationType.NeedsReview,
    ];

    private static fastPassTests: string[] = ['Automated checks', 'Tab stops', 'Needs review'];

    public static getAllFastPassVisualizations(): VisualizationType[] {
        return this.fastPassVisualizations.slice();
    }

    public static getStepIndexForTest(test: string): number {
        return this.fastPassTests.findIndex(t => t === test) + 1;
    }
}
