// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { INavLink, Nav } from 'office-ui-fabric-react';
import * as React from 'react';

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { OutcomeTypeSemantic } from 'reports/components/outcome-type';
import { getRequirementsResults } from '../../common/assessment/requirement';
import { ManualTestStatus, ManualTestStatusData } from '../../common/types/manual-test-status';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { RequirementLink } from './requirement-link';

export interface TestStepNavDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentsProvider: AssessmentsProvider;
    outcomeTypeSemanticsFromTestStatus(testStatus: ManualTestStatus): OutcomeTypeSemantic;
    getInnerTextFromJsxElement(element: JSX.Element): string;
}

export interface TestStepNavProps {
    deps: TestStepNavDeps;
    selectedTest: VisualizationType;
    selectedTestStep: string;
    stepStatus: ManualTestStatusData;
    ariaLabel: string;
}

export class TestStepsNav extends React.Component<TestStepNavProps> {
    constructor(props) {
        super(props);
    }

    public render(): JSX.Element {
        const { ariaLabel, selectedTestStep } = this.props;
        const links = this.getLinks();

        return (
            <Nav
                ariaLabel={ariaLabel}
                className={'test-step-nav'}
                selectedKey={selectedTestStep}
                groups={[
                    {
                        links,
                    },
                ]}
                onLinkClick={this.onTestStepSelected}
                onRenderLink={this.renderNavLink}
            />
        );
    }

    protected renderNavLink = (link: INavLink): JSX.Element => {
        return (
            <RequirementLink
                link={link}
                status={this.getStepStatus(link.key)}
                renderRequirementDescription={link.renderRequirementDescription}
            />
        );
    };

    private getStepStatus(key: string): ManualTestStatus {
        return this.props.stepStatus[key].stepFinalResult;
    }

    protected onTestStepSelected = (
        event?: React.MouseEvent<HTMLElement>,
        item?: INavLink,
    ): void => {
        if (item) {
            this.props.deps.detailsViewActionMessageCreator.selectRequirement(
                event,
                item.key,
                this.props.selectedTest,
            );
        }
    };

    private getLinks(): INavLink[] {
        const { selectedTest, stepStatus } = this.props;
        const {
            assessmentsProvider,
            getInnerTextFromJsxElement,
            outcomeTypeSemanticsFromTestStatus,
        } = this.props.deps;
        const results = getRequirementsResults(assessmentsProvider, selectedTest, stepStatus);

        return results.map(result => {
            const { definition: step } = result;
            const status = this.getStepStatus(step.key);
            const uiDisplayableStatus = outcomeTypeSemanticsFromTestStatus(status).pastTense;
            const title = `${step.name}. ${uiDisplayableStatus}. ${getInnerTextFromJsxElement(
                step.description,
            )}`;

            return {
                key: step.key,
                name: step.name,
                description: step.description,
                url: '',
                index: step.order,
                forceAnchor: true,
                renderRequirementDescription: step.renderRequirementDescription,
                title: title,
            } as INavLink;
        });
    }
}
