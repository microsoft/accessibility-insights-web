// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    onRenderPathColumn,
    onRenderSnippetColumn,
} from 'assessments/common/element-column-renderers';
import { InstanceTableRow } from 'assessments/types/instance-table-data';

describe('element column renderers', () => {
    const testCases: any[] = [
        ['null target', null, null],
        ['one target', ['A'], 'X'],
        ['two targets', ['A', 'B'], 'XY'],
    ];

    describe(onRenderSnippetColumn, () => {
        it.each(testCases)('%s', (testName, target, html) => {
            const item = createRowData(target, html);

            expect(onRenderSnippetColumn(item)).toMatchSnapshot();
        });
    });

    describe(onRenderPathColumn, () => {
        it.each(testCases)('%s', (testName, target, html) => {
            const item = createRowData(target, html);

            expect(onRenderPathColumn(item)).toMatchSnapshot();
        });
    });
});

function createRowData(target: string[], html: string): InstanceTableRow {
    return {
        statusChoiceGroup: null,
        visualizationButton: null,
        instance: {
            target: target,
            html: html,
            testStepResults: null,
        },
        key: 'key',
    };
}
