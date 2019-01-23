// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { css } from '@uifabric/utilities';
import * as React from 'react';

import { ManualTestStatus } from '../../common/types/manual-test-status';

export interface IStatusIconProps {
    status: ManualTestStatus;
    className?: string;
    level: 'test' | 'requirement';
}

export class StatusIcon extends React.Component<IStatusIconProps> {
    public render(): JSX.Element {
        switch (this.props.status) {
            case ManualTestStatus.PASS:
                return this.renderIcon('completedSolid', `passed ${this.props.level}`, css('positive-outcome-icon', this.props.className));
            case ManualTestStatus.FAIL:
                return this.renderIcon('StatusErrorFull', `failed ${this.props.level}`, css('negative-outcome-icon', this.props.className));
            case ManualTestStatus.UNKNOWN:
            default:
                return this.renderIcon('circleRing', `incompleted ${this.props.level}`);
        }
    }

    private renderIcon(iconName: string, ariaLabel: string, className?: String): JSX.Element {
        return (
            <Icon iconName={iconName} className={css('status-icon', className)} ariaLabel={ariaLabel} aria-live="polite" />
        );
    }
}
