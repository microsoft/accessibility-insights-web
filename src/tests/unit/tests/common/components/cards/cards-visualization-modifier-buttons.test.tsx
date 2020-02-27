// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CardsVisualizationModifierButtonsProps,
    ExpandCollapseOnlyModifierButtons,
    ExpandCollapseVisualHelperModifierButtons,
} from 'common/components/cards/cards-visualization-modifier-buttons';
import { ExpandCollapseAllButtonDeps } from 'common/components/cards/expand-collapse-all-button';
import { VisualHelperToggleDeps } from 'common/components/cards/visual-helper-toggle';
import { shallow } from 'enzyme';
import * as React from 'react';

const stubProps: CardsVisualizationModifierButtonsProps = {
    deps: {} as VisualHelperToggleDeps & ExpandCollapseAllButtonDeps,
    visualHelperEnabled: true,
    allCardsCollapsed: true,
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
