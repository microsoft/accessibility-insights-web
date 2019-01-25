// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { OutcomeChip } from '../../../../../../DetailsView/reports/components/outcome-chip';
import { shallowRender } from '../../../../Common/shallow-render';

describe('OutcomeChip', () => {
    describe('render', () => {
        test('pass', () => {
            expect(shallowRender(<OutcomeChip outcomeType="pass" count={3} />)).toMatchSnapshot();
        });

        test('incomplete', () => {
            expect(shallowRender(<OutcomeChip outcomeType="incomplete" count={2} />)).toMatchSnapshot();
        });

        test('fail', () => {
            expect(shallowRender(<OutcomeChip outcomeType="fail" count={4} />)).toMatchSnapshot();
        });
    });
});
