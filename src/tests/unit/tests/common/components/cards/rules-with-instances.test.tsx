// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CardsCollapsibleControl } from 'common/components/cards/collapsible-component-cards';
import {
    RulesWithInstances,
    RulesWithInstancesDeps,
} from 'common/components/cards/rules-with-instances';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { AutomatedChecksCardSelectionMessageCreator } from 'common/message-creators/automated-checks-card-selection-message-creator';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock } from 'typemoq';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

jest.mock('common/components/cards/collapsible-component-cards');

describe('RulesWithInstances', () => {
    mockReactComponents([CardsCollapsibleControl]);
    let fixInstructionProcessorMock: IMock<FixInstructionProcessor>;
    let cardSelectionMessageCreatorMock: IMock<CardSelectionMessageCreator>;

    beforeEach(() => {
        fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        cardSelectionMessageCreatorMock = Mock.ofType(AutomatedChecksCardSelectionMessageCreator);
    });

    it('renders', () => {
        const rules = [exampleUnifiedRuleResult];
        const depsStub = {
            collapsibleControl: CardsCollapsibleControl,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
        } as RulesWithInstancesDeps;
        const outcomeCounterStub = () => 5;

        const renderResult = render(
            <RulesWithInstances
                deps={depsStub}
                outcomeType={'pass'}
                rules={rules}
                userConfigurationStoreData={null}
                targetAppInfo={{ name: 'app' }}
                outcomeCounter={outcomeCounterStub}
                headingLevel={5}
                cardSelectionMessageCreator={cardSelectionMessageCreatorMock.object}
            />,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([CardsCollapsibleControl]);
    });
});
