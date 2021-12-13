// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CardsVisualizationModifierButtonsProps,
    ExpandCollapseOnlyModifierButtons,
    ExpandCollapseVisualHelperModifierButtons,
} from 'common/components/cards/cards-visualization-modifier-buttons';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { shallow } from 'enzyme';
import * as React from 'react';

const stubProps: CardsVisualizationModifierButtonsProps = {
    visualHelperEnabled: true,
    allCardsCollapsed: true,
    cardSelectionMessageCreator: {} as CardSelectionMessageCreator,
};

describe('ExpandCollapseVisualHelperModifierButtons', () => {
    it('renders per snapshot', () => {
        const testSubject = shallow(<ExpandCollapseVisualHelperModifierButtons {...stubProps} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});

describe('ExpandCollapseOnlyModifierButtons', () => {
    it('renders per snapshot', () => {
        const testSubject = shallow(<ExpandCollapseOnlyModifierButtons {...stubProps} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
