// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    HowToFixWebCardRow,
    HowToFixWebCardRowProps,
} from 'common/components/cards/how-to-fix-card-row';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { RecommendColor } from 'common/components/recommend-color';
import { LinkComponentType } from 'common/types/link-component-type';
import * as React from 'react';
import { Mock } from 'typemoq';
import { SimpleCardRow } from '../../../../../../common/components/cards/simple-card-row';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../common/components/cards/simple-card-row');
describe('HowToFixWebCardRow', () => {
    mockReactComponents([SimpleCardRow]);

    it('renders', () => {
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const props: HowToFixWebCardRowProps = {
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
                recommendColor: {} as RecommendColor,
                LinkComponent: {} as LinkComponentType,
            },
            index: 22,
            propertyData: {
                any: ['some any message'],
                all: ['some all message'],
                none: ['some none message'],
            },
        };

        const renderResult = render(<HowToFixWebCardRow {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
