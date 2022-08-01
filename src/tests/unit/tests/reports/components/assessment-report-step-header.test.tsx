// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from 'common/components/new-tab-link';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { shallow } from 'enzyme';
import * as React from 'react';
import { RequirementHeaderReportModel, RequirementType } from 'reports/assessment-report-model';
import {
    AssessmentReportStepHeader,
    AssessmentReportStepHeaderDeps,
} from 'reports/components/assessment-report-step-header';
import { OutcomeChip } from 'reports/components/outcome-chip';
import { RequirementOutcomeType } from 'reports/components/requirement-outcome-type';
import { Mock } from 'typemoq';

describe('AssessmentReportStepHeader', () => {
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

        const actual = shallow(
            <AssessmentReportStepHeader
                deps={deps}
                status={FAIL}
                header={header}
                instanceCount={42}
                defaultMessageComponent={null}
            />,
        );
        expect(actual.getElement()).toMatchSnapshot();
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

                            const wrapper = shallow(component);

                            it(`will have OutcomeChip with count of ${expectedCount} and outcomeType of ${outcomeType}`, () => {
                                const chip = wrapper.find(OutcomeChip).getElement();
                                expect(chip).toEqual(
                                    <OutcomeChip count={expectedCount} outcomeType={outcomeType} />,
                                );
                            });

                            const messageWrapper = wrapper.find('.no-failure-view');

                            if (defaultMessageComponent && outcomeType === 'pass') {
                                it('will have a message about no instances', () => {
                                    expect(messageWrapper.exists()).toBe(true);
                                    expect(messageWrapper.getElement()).toEqual(
                                        <div className="no-failure-view">No failing instances</div>,
                                    );
                                });
                            } else {
                                it('will have no message', () => {
                                    expect(messageWrapper.exists()).toBe(false);
                                });
                            }
                        }),
                    );
                }),
            );
        }),
    );
});
