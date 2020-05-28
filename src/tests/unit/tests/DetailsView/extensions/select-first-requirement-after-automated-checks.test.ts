// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { AssessmentViewProps } from '../../../../../DetailsView/components/assessment-view';
import { selectFirstRequirementAfterAutomatedChecks } from '../../../../../DetailsView/extensions/select-first-requirement-after-automated-checks';

describe('selectFirstRequirementAfterAutomatedChecks', () => {
    const first = 'first';
    const second = 'second';
    const assessmentType = -2112;

    const getRequirementResults = () => [
        { definition: { key: first } },
        { definition: { key: second } },
    ];

    const detailsViewActionMessageCreator = {
        selectRequirement: jest.fn(),
    };

    const scanningProps = ({
        deps: {
            detailsViewActionMessageCreator: detailsViewActionMessageCreator as Partial<
                DetailsViewActionMessageCreator
            >,
        },
        assessmentTestResult: {
            getOutcomeStats: () => ({ pass: 0, incomplete: 1, fail: 0 }),
            getRequirementResults,
            visualizationType: assessmentType,
        },
    } as Partial<AssessmentViewProps>) as AssessmentViewProps;

    const notScanningProps = ({
        deps: {
            detailsViewActionMessageCreator: detailsViewActionMessageCreator as Partial<
                DetailsViewActionMessageCreator
            >,
        },
        assessmentTestResult: {
            getOutcomeStats: () => ({ pass: 1, incomplete: 0, fail: 0 }),
            getRequirementResults,
            visualizationType: assessmentType,
        },
    } as Partial<AssessmentViewProps>) as AssessmentViewProps;

    beforeEach(() => {
        detailsViewActionMessageCreator.selectRequirement.mockClear();
    });

    const testObject = selectFirstRequirementAfterAutomatedChecks.component.onAssessmentViewUpdate;

    it('selects the first test step when transitioning from scanning to not scanning', () => {
        testObject(scanningProps, notScanningProps);

        expect(detailsViewActionMessageCreator.selectRequirement).toBeCalledWith(
            null,
            first,
            assessmentType,
        );
    });

    it('does not select the first test step when remaining scanning', () => {
        testObject(scanningProps, scanningProps);

        expect(detailsViewActionMessageCreator.selectRequirement).not.toBeCalled();
    });

    it('does not select the first test step when remaining not scanning', () => {
        testObject(notScanningProps, notScanningProps);

        expect(detailsViewActionMessageCreator.selectRequirement).not.toBeCalled();
    });

    it('selects the first test step when transitioning from not scanning to scanning', () => {
        testObject(notScanningProps, scanningProps);

        expect(detailsViewActionMessageCreator.selectRequirement).not.toBeCalled();
    });
});
