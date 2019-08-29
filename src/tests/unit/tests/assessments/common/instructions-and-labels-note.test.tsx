// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { InstructionsAndLabelsNotes } from '../../../../../assessments/common/instructions-and-labels-note';

describe('InstructionsAndLabelsNote', () => {
    it('renders', () => {
        const wrapped = shallow(<InstructionsAndLabelsNotes />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
