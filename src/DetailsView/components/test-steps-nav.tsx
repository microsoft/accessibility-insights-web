// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { INavLink, Nav } from 'office-ui-fabric-react/lib/Nav';
import * as React from 'react';

import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { getRequirementsResults } from '../../common/assessment/requirement';
import { IManualTestStatus } from '../../common/types/manual-test-status';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { TestStepLink } from './test-step-link';

export interface ITestStepNavProps {
    selectedTest: VisualizationType;
    selectedTestStep: string;
    stepStatus: IManualTestStatus;
    actionMessageCreator: DetailsViewActionMessageCreator;
    assessmentsProvider: IAssessmentsProvider;
    ariaLabel: string;
}

export class TestStepsNav extends React.Component<ITestStepNavProps> {
    constructor(props) {
        super(props);
    }

    public render(): JSX.Element {

        const { assessmentsProvider, selectedTest, selectedTestStep, stepStatus } = this.props;

        const results = getRequirementsResults(
            assessmentsProvider,
            selectedTest,
            stepStatus);

        const links = results.map(result => {
            const { definition: step } = result;
            return {
                key: step.key,
                name: step.name,
                description: step.description,
                url: '',
                index: step.order,
                forceAnchor: true,
                renderRequirementDescription: step.renderRequirementDescription,
            } as INavLink;
        });

        return (
            <Nav
                ariaLabel={this.props.ariaLabel}
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
            status={this.props.stepStatus[link.key].stepFinalResult}
            renderRequirementDescription={link.renderRequirementDescription}
        />;
    }

    @autobind
    protected onTestStepSelected(event?: React.MouseEvent<HTMLElement>, item?: INavLink): void {
        if (item) {
            this.props.actionMessageCreator.selectTestStep(event, item.key, this.props.selectedTest);
        }
    }
}
