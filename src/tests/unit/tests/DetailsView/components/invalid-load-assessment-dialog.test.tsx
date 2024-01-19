// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, DialogFooter, PrimaryButton } from '@fluentui/react';
import { render } from '@testing-library/react';
import {
    InvalidLoadAssessmentDialog,
    InvalidLoadAssessmentDialogProps,
} from 'DetailsView/components/invalid-load-assessment-dialog';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');

describe('InvalidLoadAssessmentDialog', () => {
    mockReactComponents([Dialog, DialogFooter, PrimaryButton]);
    let invalidLoadAssessmentDialogProps: InvalidLoadAssessmentDialogProps;

    beforeEach(() => {
        invalidLoadAssessmentDialogProps = {
            isOpen: true,
            onClose: () => {},
        };
    });

    it('should show when isOpen is set to true', () => {
        const renderResult = render(
            <InvalidLoadAssessmentDialog {...invalidLoadAssessmentDialogProps} />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Dialog]);
    });

    it('should not show when isOpen is set to false', () => {
        invalidLoadAssessmentDialogProps.isOpen = false;
        const renderResult = render(
            <InvalidLoadAssessmentDialog {...invalidLoadAssessmentDialogProps} />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
