// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    LoadAssessmentButton,
    LoadAssessmentButtonProps,
} from 'DetailsView/components/load-assessment-button';
import * as React from 'react';

export function getLoadButtonForAssessment(props: LoadAssessmentButtonProps): JSX.Element {
    return <LoadAssessmentButton {...props} />;
}

export function getNullLoadButton(props: LoadAssessmentButtonProps): JSX.Element | null {
    return null;
}
