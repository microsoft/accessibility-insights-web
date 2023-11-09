// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import { InstructionsAndLabelsNotes } from '../../../../../assessments/common/instructions-and-labels-note';

describe('InstructionsAndLabelsNote', () => {
    it('renders', () => {
        const renderResult = render(<InstructionsAndLabelsNotes />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
