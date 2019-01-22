// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { INavLink, Nav } from 'office-ui-fabric-react/lib/Nav';
import * as React from 'react';

import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { getRequirementsResults } from '../../common/assessment/requirement';
import { IManualTestStatus, ManualTestStatus } from '../../common/types/manual-test-status';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { OutcomeTypeSemantic } from '../reports/components/outcome-type';
import { TestStepLink } from './test-step-link';


export interface TestStepNavDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentsProvider: IAssessmentsProvider;
    outcomeTypeSemanticsFromTestStatus(testStatus: ManualTestStatus): OutcomeTypeSemantic;
    getInnerTextFromJsxElement(element: JSX.Element): string;
}

export interface ITestStepNavProps {
    deps: TestStepNavDeps;
    selectedTest: VisualizationType;
    selectedTestStep: string;
    stepStatus: IManualTestStatus;
    ariaLabel: string;
}

export class TestStepsNav extends React.Component<ITestStepNavProps> {
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
                groups={[{
                    links,
                }]}
                onLinkClick={this.onTestStepSelected}
                onRenderLink={this.renderNavLink}
            />
        );

    }

    @autobind
    protected renderNavLink(link: INavLink): JSX.Element {
        return <TestStepLink
            link={link}
            status={this.getStepStatus(link.key)}
            renderRequirementDescription={link.renderRequirementDescription}
        />;
    }

    private getStepStatus(key: string): ManualTestStatus {
        return this.props.stepStatus[key].stepFinalResult;
    }

    @autobind
    protected onTestStepSelected(event?: React.MouseEvent<HTMLElement>, item?: INavLink): void {
        if (item) {
            this.props.deps.detailsViewActionMessageCreator.selectTestStep(event, item.key, this.props.selectedTest);
        }
    }

    private getLinks(): INavLink[] {
        const { selectedTest, stepStatus } = this.props;
        const { assessmentsProvider, getInnerTextFromJsxElement, outcomeTypeSemanticsFromTestStatus } = this.props.deps;
        const results = getRequirementsResults(assessmentsProvider, selectedTest, stepStatus);

        return results.map(result => {
            const { definition: step } = result;
            const status = this.getStepStatus(step.key);
            const uiDisplayableStatus = outcomeTypeSemanticsFromTestStatus(status).pastTense;
            const title = `${step.name}. ${uiDisplayableStatus}. ${getInnerTextFromJsxElement(step.description)}`;

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
