// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { CheckIcon } from '../../../../../../common/icons/check-icon';
import { CircleIcon } from '../../../../../../common/icons/circle-icon';
import { CrossIcon } from '../../../../../../common/icons/cross-icon';
import { OutcomeIcon } from '../../../../../../DetailsView/reports/components/outcome-icon';
import { allOutcomeTypes } from '../../../../../../DetailsView/reports/components/outcome-type';
import { shallowRender } from '../../../../Common/shallow-render';

describe('OutcomeIcon', () => {
    describe('render', () => {
        allOutcomeTypes.forEach(outcomeType => {
            test(outcomeType, () => {
                expect(shallowRender(<OutcomeIcon outcomeType={outcomeType} />)).toMatchSnapshot();
            });
        });
    });
});

[CheckIcon, CircleIcon, CrossIcon].forEach(Icon => {
    const name = Icon.displayName;
    describe(name, () => {
        test('render', () => {
            expect(shallowRender(<Icon />)).toMatchSnapshot();
        });
    });
});
