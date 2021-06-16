// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    HowToFixWebCardRow,
    HowToFixWebCardRowProps,
} from 'common/components/cards/how-to-fix-card-row';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { RecommendColor } from 'common/components/recommend-color';
import { LinkComponentType } from 'common/types/link-component-type';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

describe('HowToFixWebCardRow', () => {
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

        const testSubject = shallow(<HowToFixWebCardRow {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
