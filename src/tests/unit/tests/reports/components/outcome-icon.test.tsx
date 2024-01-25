// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { CheckIcon, CheckIconInverted } from 'common/icons/check-icon';
import { CircleIcon } from 'common/icons/circle-icon';
import { CrossIconInverted } from 'common/icons/cross-icon';
import { InapplicableIcon, InapplicableIconInverted } from 'common/icons/inapplicable-icon';
import * as React from 'react';
import { OutcomeIcon } from 'reports/components/outcome-icon';
import { allRequirementOutcomeTypes } from 'reports/components/requirement-outcome-type';

describe('OutcomeIcon', () => {
    describe('render', () => {
        allRequirementOutcomeTypes.forEach(outcomeType => {
            test(outcomeType, () => {
                const renderResult = render(<OutcomeIcon outcomeType={outcomeType} />);
                expect(renderResult.asFragment()).toMatchSnapshot();
            });
        });
    });
});

[
    CheckIcon,
    CheckIconInverted,
    CircleIcon,
    CrossIconInverted,
    InapplicableIcon,
    InapplicableIconInverted,
].forEach(Icon => {
    const name = Icon.displayName;
    describe(name, () => {
        test('render', () => {
            const renderResult = render(<Icon />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
