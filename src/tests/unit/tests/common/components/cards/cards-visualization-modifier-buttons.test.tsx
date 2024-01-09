// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    CardsVisualizationModifierButtonsProps,
    ExpandCollapseOnlyModifierButtons,
    ExpandCollapseVisualHelperModifierButtons,
} from 'common/components/cards/cards-visualization-modifier-buttons';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import * as React from 'react';
import { ExpandCollapseAllButton } from '../../../../../../common/components/cards/expand-collapse-all-button';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

const stubProps: CardsVisualizationModifierButtonsProps = {
    visualHelperEnabled: true,
    allCardsCollapsed: true,
    cardSelectionMessageCreator: {} as CardSelectionMessageCreator,
};

jest.mock('../../../../../../common/components/cards/expand-collapse-all-button');

describe('ExpandCollapseVisualHelperModifierButtons', () => {
    mockReactComponents([ExpandCollapseAllButton]);
    it('renders per snapshot', () => {
        const renderResult = render(<ExpandCollapseVisualHelperModifierButtons {...stubProps} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});

describe('ExpandCollapseOnlyModifierButtons', () => {
    it('renders per snapshot', () => {
        const renderResult = render(<ExpandCollapseOnlyModifierButtons {...stubProps} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
