// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { CheckIcon, CheckIconInverted } from 'common/icons/check-icon';
import { CircleIcon } from 'common/icons/circle-icon';
import { CrossIcon, CrossIconInverted } from 'common/icons/cross-icon';
import { InapplicableIcon, InapplicableIconInverted } from 'common/icons/inapplicable-icon';
import * as React from 'react';
import { OutcomeIcon } from 'reports/components/outcome-icon';
import { allRequirementOutcomeTypes } from 'reports/components/requirement-outcome-type';
import {
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';

describe('OutcomeIcon', () => {
    mockReactComponents([
        CheckIcon,
        CircleIcon,
        CrossIcon,
        InapplicableIcon,
        CheckIconInverted,
        CrossIconInverted,
        InapplicableIconInverted,
    ]);
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
        useOriginalReactElements('common/icons/check-icon', ['CheckIcon', 'CheckIconInverted']);
        useOriginalReactElements('common/icons/circle-icon', ['CircleIcon']);
        useOriginalReactElements('common/icons/inapplicable-icon', [
            'InapplicableIcon',
            'InapplicableIconInverted',
        ]);
        useOriginalReactElements('common/icons/cross-icon', ['CrossIconInverted']);
        test('render', () => {
            const renderResult = render(<Icon />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
