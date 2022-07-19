// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from '@fluentui/react';
import { css } from '@fluentui/utilities';
import * as React from 'react';

import { outcomeTypeSemanticsFromTestStatus } from 'reports/components/requirement-outcome-type';
import { ManualTestStatus } from '../../common/types/store-data/manual-test-status';

export interface StatusIconProps {
    status: ManualTestStatus;
    className?: string;
    level: AssessmentLevel;
}

export type AssessmentLevel = 'test' | 'requirement';

export class StatusIcon extends React.Component<StatusIconProps> {
    public render(): JSX.Element {
        const outcomeTypeSemantics =
            outcomeTypeSemanticsFromTestStatus(this.props.status) ||
            outcomeTypeSemanticsFromTestStatus(ManualTestStatus.UNKNOWN);
        const pastTenseOutCome = outcomeTypeSemantics && outcomeTypeSemantics.pastTense;
        const label = `${pastTenseOutCome} ${this.props.level}`;

        switch (this.props.status) {
            case ManualTestStatus.PASS:
                return this.renderIcon(
                    'completedSolid',
                    label,
                    css('positive-outcome-icon', this.props.className),
                );
            case ManualTestStatus.FAIL:
                return this.renderIcon(
                    'StatusErrorFull',
                    label,
                    css('negative-outcome-icon', this.props.className),
                );
            case ManualTestStatus.UNKNOWN:
            default:
                return this.renderIcon('circleRing', label);
        }
    }

    private renderIcon(iconName: string, ariaLabel: string, className?: String): JSX.Element {
        return (
            <Icon
                iconName={iconName}
                className={css('status-icon', className)}
                ariaLabel={ariaLabel}
                aria-live="polite"
            />
        );
    }
}
