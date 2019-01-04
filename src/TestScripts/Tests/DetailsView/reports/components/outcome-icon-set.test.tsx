// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { OutcomeIconSet } from '../../../../../DetailsView/reports/components/outcome-icon-set';
import { shallowRender } from '../../../../Common/shallow-render';

describe('OutcomeIconSet', () => {

    describe('render', () => {

        test('render with all properties', () => {
            expect(shallowRender(<OutcomeIconSet pass={3} incomplete={2} fail={4} />)).toMatchSnapshot();
        });

        test('render incomplete zero', () => {
            expect(shallowRender(<OutcomeIconSet pass={3} incomplete={0} fail={4} />)).toMatchSnapshot();
        });

        test('render all zero', () => {
            expect(shallowRender(<OutcomeIconSet pass={0} incomplete={0} fail={0} />)).toMatchSnapshot();
        });

    });

});
