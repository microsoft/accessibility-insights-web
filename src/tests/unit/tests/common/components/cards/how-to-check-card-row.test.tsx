// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// import {
//     HowToCheckWebCardRow,
//     HowToCheckWebCardRowProps,
// } from 'common/components/cards/how-to-check-card-row';
// import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
// import { shallow } from 'enzyme';
// import * as React from 'react';
// import { Mock } from 'typemoq';

// describe('HowToCheckWebCardRow', () => {
//     it('renders', () => {
//         const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
//         const props: HowToCheckWebCardRowProps = {
//             deps: { fixInstructionProcessor: fixInstructionProcessorMock.object },
//             index: 22,
//             propertyData: {
//                 any: ['some any message'],
//                 all: ['some all message'],
//                 none: ['some none message'],
//             },
//         };

//         const testSubject = shallow(<HowToCheckWebCardRow {...props} />);

//         expect(testSubject.getElement()).toMatchSnapshot();
//     });
// });
