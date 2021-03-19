// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { pageTitleInstanceDetailsColumnRenderer } from 'assessments/page/pagetitle-instance-details-column-renderer';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import * as React from 'react';
import { HeadingsAssessmentProperties } from '../../../../common/types/store-data/assessment-result-data';
import { AssessmentInstanceDetailsColumn } from '../../../../DetailsView/components/assessment-instance-details-column';

describe('PageTitleInstanceDetailsColumnRendererTest', () => {
    test('render: propertyBag is null', () => {
        const item = {
            instance: {
                propertyBag: null,
            },
        } as InstanceTableRow<HeadingsAssessmentProperties>;
        const expected = <AssessmentInstanceDetailsColumn textContent={null} />;
        expect(expected).toEqual(pageTitleInstanceDetailsColumnRenderer(item));
    });

    test('render', () => {
        const pageTitle = 'Test Page Title';
        const item = {
            instance: {
                propertyBag: {
                    pageTitle: pageTitle,
                },
            },
        } as InstanceTableRow<any>;
        const expected = <AssessmentInstanceDetailsColumn textContent={pageTitle} />;
        expect(expected).toEqual(pageTitleInstanceDetailsColumnRenderer(item));
    });
});
