// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    InvalidLoadAssessmentDialog,
    InvalidLoadAssessmentDialogProps,
} from 'DetailsView/components/invalid-load-assessment-dialog';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('InvalidLoadAssessmentDialog', () => {
    let invalidLoadAssessmentDialogProps: InvalidLoadAssessmentDialogProps;

    beforeEach(() => {
        invalidLoadAssessmentDialogProps = {
            isOpen: true,
            onClose: () => {},
        };
    });

    it('should show when isOpen is set to true', () => {
        const rendered = shallow(
            <InvalidLoadAssessmentDialog {...invalidLoadAssessmentDialogProps} />,
        );
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('should not show when isOpen is set to false', () => {
        invalidLoadAssessmentDialogProps.isOpen = false;
        const rendered = shallow(
            <InvalidLoadAssessmentDialog {...invalidLoadAssessmentDialogProps} />,
        );
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
