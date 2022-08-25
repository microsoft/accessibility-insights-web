// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CardsVisualizationModifierButtons,
    CardsVisualizationModifierButtonsProps,
} from 'common/components/cards/cards-visualization-modifier-buttons';
import {
    ResultSectionContent,
    ResultSectionContentDeps,
    ResultSectionContentProps,
} from 'common/components/cards/result-section-content';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { CardRuleResult } from 'common/types/store-data/card-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('ResultSectionContent', () => {
    const emptyRules: CardRuleResult[] = [];
    const someRules: CardRuleResult[] = [exampleUnifiedRuleResult];
    const depsStub = {} as ResultSectionContentDeps;
    let cardSelectionMessageCreatorMock: IMock<CardSelectionMessageCreator>;

    beforeEach(() => {
        cardSelectionMessageCreatorMock = Mock.ofType<CardSelectionMessageCreator>();
    });

    it('renders, with some rules', () => {
        const cardsVisualizationModifierButtonsStub: Readonly<CardsVisualizationModifierButtons> =
            NamedFC<CardsVisualizationModifierButtonsProps>('test', _ => null);

        const props = {
            deps: {
                cardsVisualizationModifierButtons: cardsVisualizationModifierButtonsStub,
            },
            results: someRules,
            outcomeType: 'pass',
            cardSelectionMessageCreator: {} as CardSelectionMessageCreator,
        } as ResultSectionContentProps;

        const wrapper = shallow(<ResultSectionContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders without modifier buttons without cardSelectionMessageCreator, with some rules', () => {
        const cardsVisualizationModifierButtonsStub: Readonly<CardsVisualizationModifierButtons> =
            NamedFC<CardsVisualizationModifierButtonsProps>('test', _ => null);

        const props = {
            deps: {
                cardsVisualizationModifierButtons: cardsVisualizationModifierButtonsStub,
            },
            results: someRules,
            outcomeType: 'pass',
        } as ResultSectionContentProps;

        const wrapper = shallow(<ResultSectionContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('does not render, no rules', () => {
        const props: ResultSectionContentProps = {
            deps: depsStub,
            results: emptyRules,
            outcomeType: 'pass',
            showCongratsIfNotInstances: true,
            userConfigurationStoreData: null,
            targetAppInfo: { name: 'app' },
            visualHelperEnabled: true,
            allCardsCollapsed: true,
            outcomeCounter: null,
            headingLevel: 5,
            cardSelectionMessageCreator: cardSelectionMessageCreatorMock.object,
        };

        const wrapper = shallow(<ResultSectionContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
