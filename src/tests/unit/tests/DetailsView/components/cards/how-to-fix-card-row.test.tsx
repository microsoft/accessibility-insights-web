// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { HowToFixWebCardRow, HowToFixWebCardRowProps } from '../../../../../../DetailsView/components/cards/how-to-fix-card-row';
import { FixInstructionProcessor } from '../../../../../../injected/fix-instruction-processor';

describe('HowToFixWebCardRow', () => {
    it('renders', () => {
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const props: HowToFixWebCardRowProps = {
            deps: { fixInstructionProcessor: fixInstructionProcessorMock.object },
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
