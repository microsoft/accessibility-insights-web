// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { OutcomeChipSet } from '../../../../../../DetailsView/reports/components/outcome-chip-set';
import { shallowRender } from '../../../../Common/shallow-render';

describe('OutcomeChipSet', () => {
    describe('render', () => {
        test('render with all properties', () => {
            expect(shallowRender(<OutcomeChipSet pass={3} incomplete={2} fail={4} />)).toMatchSnapshot();
        });

        test('render incomplete zero', () => {
            expect(shallowRender(<OutcomeChipSet pass={3} incomplete={0} fail={4} />)).toMatchSnapshot();
        });

        test('render all zero', () => {
            expect(shallowRender(<OutcomeChipSet pass={0} incomplete={0} fail={0} />)).toMatchSnapshot();
        });
    });
});
