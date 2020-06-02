// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { IconButton } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './left-nav-hamburger-button.scss';

export type LeftNavHamburgerButtonProps = {
    selectedPivot: DetailsViewPivotType;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LeftNavHamburgerButton = NamedFC<LeftNavHamburgerButtonProps>(
    'LeftNavHamburgerButton',
    props => {
        const assessmentAriaLabel = 'Assessment expand to see list of all tests and requirements';
        const fastPassAriaLabel = 'FastPass expand to see a list of all tests';
        const ariaLabel =
            props.selectedPivot === DetailsViewPivotType.assessment
                ? assessmentAriaLabel
                : fastPassAriaLabel;

        return (
            <IconButton
                className={styles.leftNavHamburgerButton}
                iconProps={{ iconName: 'GlobalNavButton' }}
                ariaLabel={ariaLabel}
                onClick={() => props.setSideNavOpen(true)}
            />
        );
    },
);
