// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DefaultButton, Icon } from '@fluentui/react';
import { Requirement } from 'assessments/types/requirement';
import { NamedFC } from 'common/react/named-fc';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import * as React from 'react';
export type NextRequirementButtonDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export type NextRequirementButtonProps = {
    deps: NextRequirementButtonDeps;
    nextRequirement: Requirement;
    currentTest: VisualizationType;
    className?: string;
};

export const NextRequirementButton = NamedFC<NextRequirementButtonProps>(
    'NextRequirementButton',
    props => {
        if (props.nextRequirement == null) {
            return null;
        }

        const selectNextRequirement = (event: React.MouseEvent<HTMLElement>) => {
            props.deps.detailsViewActionMessageCreator.selectNextRequirement(
                event,
                props.nextRequirement.key,
                props.currentTest,
            );
        };

        return (
            <DefaultButton
                text={props.nextRequirement.name}
                className={props.className}
                onClick={selectNextRequirement}
            >
                <span>
                    <Icon iconName="ChevronRight" ariaLabel={'next'} />
                </span>
            </DefaultButton>
        );
    },
);
