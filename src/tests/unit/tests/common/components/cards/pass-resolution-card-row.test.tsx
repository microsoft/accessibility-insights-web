// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    PassResolutionCardRow,
    PassResolutionCardRowProps,
} from 'common/components/cards/pass-resolution-card-row';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { RecommendColor } from 'common/components/recommend-color';
import { LinkComponentType } from 'common/types/link-component-type';
import * as React from 'react';
import { Mock } from 'typemoq';
import { SimpleCardRow } from '../../../../../../common/components/cards/simple-card-row';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../common/components/cards/simple-card-row');
describe('PassResolutionCardRow', () => {
    mockReactComponents([SimpleCardRow]);

    it('renders', () => {
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const props: PassResolutionCardRowProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                recommendColor: {} as RecommendColor,
                LinkComponent: {} as LinkComponentType,
            },
            index: 22,
            propertyData: {
                any: ['pass any message'],
                all: ['pass all message'],
                none: [],
            },
        };

        const renderResult = render(<PassResolutionCardRow {...props} />);
        expectMockedComponentPropsToMatchSnapshots([SimpleCardRow]);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
