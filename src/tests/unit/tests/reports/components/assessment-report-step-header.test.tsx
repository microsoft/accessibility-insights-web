// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { NewTabLink } from 'common/components/new-tab-link';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import * as React from 'react';
import { RequirementHeaderReportModel, RequirementType } from 'reports/assessment-report-model';
import {
    AssessmentReportStepHeader,
    AssessmentReportStepHeaderDeps,
} from 'reports/components/assessment-report-step-header';
import { OutcomeChip } from 'reports/components/outcome-chip';
import { RequirementOutcomeType } from 'reports/components/requirement-outcome-type';
import { Mock } from 'typemoq';
import '@testing-library/jest-dom';
import { GuidanceLinks } from '../../../../../common/components/guidance-links';
import { GuidanceTags } from '../../../../../common/components/guidance-tags';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('reports/components/outcome-chip');
jest.mock('../../../../../common/components/guidance-links');
jest.mock('../../../../../common/components/guidance-tags');

describe('AssessmentReportStepHeader', () => {
    mockReactComponents([OutcomeChip, GuidanceLinks, GuidanceTags]);
    function genHeader(requirementType: RequirementType): RequirementHeaderReportModel {
        return {
            description: <p>DESCRIPTION</p>,
            displayName: 'REQUIREMENT',
            guidanceLinks: [{ text: 'LINK_TEXT', href: 'LINK_URL' }],
            requirementType,
        };
    }

    const { PASS, UNKNOWN, FAIL } = ManualTestStatus;

    const deps: AssessmentReportStepHeaderDeps = {
        outcomeTypeSemanticsFromTestStatus: testStatus => {
            return { pastTense: ManualTestStatus[testStatus] + '-tested' };
        },
        getGuidanceTagsFromGuidanceLinks: Mock.ofInstance(GetGuidanceTagsFromGuidanceLinks).object,
        LinkComponent: NewTabLink,
    };

    test('matches snapshot', () => {
        const header = genHeader('assisted');

        const renderResult = render(
            <AssessmentReportStepHeader
                deps={deps}
                status={FAIL}
                header={header}
                instanceCount={42}
                defaultMessageComponent={null}
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([GuidanceLinks, GuidanceTags]);
    });

    const outcomePairs: [ManualTestStatus, RequirementOutcomeType][] = [
        [PASS, 'pass'],
        [UNKNOWN, 'incomplete'],
        [FAIL, 'fail'],
    ];

    outcomePairs.forEach(([status, outcomeType]) =>
        describe(`in ${outcomeType} section`, () => {
            const requirementTypes: RequirementType[] = ['manual', 'assisted'];

            requirementTypes.forEach(requirementType =>
                describe(`${requirementType} requirements`, () => {
                    [0, 1, 42].forEach(instanceCount =>
                        describe(`with instance count of ${instanceCount}`, () => {
                            let expectedCount = instanceCount;

                            if (
                                outcomeType === 'pass' &&
                                requirementType === 'manual' &&
                                expectedCount === 0
                            ) {
                                expectedCount = 1;
                            }

                            const header = genHeader(requirementType);

                            const defaultMessageComponent = {
                                message: (
                                    <div className="no-failure-view">No failing instances</div>
                                ),
                                instanceCount: expectedCount,
                            };
                            const component = (
                                <AssessmentReportStepHeader
                                    deps={deps}
                                    status={status}
                                    header={header}
                                    instanceCount={instanceCount}
                                    defaultMessageComponent={defaultMessageComponent}
                                />
                            );

                            const renderResult = render(component);

                            it(`will have OutcomeChip with count of ${expectedCount} and outcomeType of ${outcomeType}`, () => {
                                render(component);
                                expectMockedComponentPropsToMatchSnapshots([OutcomeChip]);
                            });

                            const messageWrapper =
                                renderResult.container.querySelector('.no-failure-view');

                            if (defaultMessageComponent && outcomeType === 'pass') {
                                it('will have a message about no instances', () => {
                                    expect(messageWrapper).not.toBeNull();
                                    expect(messageWrapper).toHaveTextContent(
                                        'No failing instances',
                                    );
                                });
                            } else {
                                it('will have no message', () => {
                                    expect(messageWrapper).toBeNull();
                                });
                            }
                        }),
                    );
                }),
            );
        }),
    );
});
