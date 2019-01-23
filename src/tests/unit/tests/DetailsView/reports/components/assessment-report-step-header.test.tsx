// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import * as React from 'react';

import { ManualTestStatus } from '../../../../../../common/types/manual-test-status';
import {
    IRequirementHeaderReportModel,
    RequirementType,
} from '../../../../../../DetailsView/reports/assessment-report-model';
import {
    AssessmentReportStepHeader,
    AssessmentReportStepHeaderDeps,
} from '../../../../../../DetailsView/reports/components/assessment-report-step-header';
import { OutcomeChip } from '../../../../../../DetailsView/reports/components/outcome-chip';
import { OutcomeType, outcomeTypeSemanticsFromTestStatus } from '../../../../../../DetailsView/reports/components/outcome-type';
import { shallowRender } from '../../../../Common/shallow-render';

describe('AssessmentReportStepHeader', () => {
    function genHeader(requirementType: RequirementType): IRequirementHeaderReportModel {
        return {
            description: <p>DESCRIPTION</p>,
            displayName: 'REQUIREMENT',
            guidanceLinks: [{ text: 'LINK_TEXT', href: 'LINK_URL' }],
            requirementType,
        };
    }

    const { PASS, UNKNOWN, FAIL } = ManualTestStatus;

    // TODO: Make this a local test function rather than importing the actual one
    const deps: AssessmentReportStepHeaderDeps = {
        outcomeTypeSemanticsFromTestStatus: outcomeTypeSemanticsFromTestStatus,
    };

    test('matches snapshot', () => {
        const header = genHeader('assisted');

        const actual = shallowRender(
            <AssessmentReportStepHeader
                deps={deps}
                status={FAIL}
                header={header}
                instanceCount={42}
                defaultMessageComponent={null}
                />,
        );
        expect(actual).toMatchSnapshot();
    });

    const outcomePairs: [ManualTestStatus, OutcomeType][] = [[PASS, 'pass'], [UNKNOWN, 'incomplete'], [FAIL, 'fail']];

    outcomePairs.forEach(([status, outcomeType]) =>
        describe(`in ${outcomeType} section`, () => {
            const requirementTypes: RequirementType[] = ['manual', 'assisted'];

            requirementTypes.forEach(requirementType =>
                describe(`${requirementType} requirements`, () => {
                    [0, 1, 42].forEach(instanceCount =>
                        describe(`with instance count of ${instanceCount}`, () => {
                            let expectedCount = instanceCount;

                            if (outcomeType === 'pass' && requirementType === 'manual' && expectedCount === 0) {
                                expectedCount = 1;
                            }

                            const header = genHeader(requirementType);

                            const defaultMessageComponent = {
                                message: <div className="no-failure-view">No failing instances</div>,
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

                            const wrapper = Enzyme.shallow(component);

                            it(`will have OutcomeChip with count of ${expectedCount} and outcomeType of ${outcomeType}`, () => {
                                const chip = wrapper.find(OutcomeChip).getElement();
                                expect(chip).toEqual(<OutcomeChip count={expectedCount} outcomeType={outcomeType} />);
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
