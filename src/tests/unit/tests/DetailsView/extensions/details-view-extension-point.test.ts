// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentViewProps } from '../../../../../DetailsView/components/assessment-view';
import { detailsViewExtensionPoint } from '../../../../../DetailsView/extensions/details-view-extension-point';

describe('detailsViewExtensionPoint', () => {
    const prev = { isScanning: false } as AssessmentViewProps;
    const cur = { isScanning: true } as AssessmentViewProps;

    it('supports onAssessmentViewUpdate', () => {
        const onAssessmentViewUpdate = jest.fn();

        const addIn = detailsViewExtensionPoint.define({
            onAssessmentViewUpdate,
        });

        const apply = detailsViewExtensionPoint.apply([addIn]);
        apply.onAssessmentViewUpdate(prev, cur);

        expect(onAssessmentViewUpdate).toBeCalledWith(prev, cur);
    });

    it('supports non-add-in items in the list', () => {
        const onAssessmentViewUpdate = jest.fn();

        const addIn = detailsViewExtensionPoint.define({
            onAssessmentViewUpdate,
        });
        const emptyAddIn = detailsViewExtensionPoint.define({});

        const apply = detailsViewExtensionPoint.apply([
            { x: 'whatever' },
            addIn,
            emptyAddIn,
        ]);
        apply.onAssessmentViewUpdate(prev, cur);

        expect(onAssessmentViewUpdate).toBeCalledWith(prev, cur);
    });

    it('supports empty list', () => {
        const apply = detailsViewExtensionPoint.apply([]);
        apply.onAssessmentViewUpdate(prev, cur);
    });

    it('supports null list', () => {
        const apply = detailsViewExtensionPoint.apply(null);
        apply.onAssessmentViewUpdate(prev, cur);
    });
});
