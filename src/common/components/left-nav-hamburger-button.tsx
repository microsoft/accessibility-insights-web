// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { IconButton } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './left-nav-hamburger-button.scss';

type LeftNavHamburgerButtonProps = {
    ariaLabel: string;
};

const LeftNavHamburgerButton = NamedFC<LeftNavHamburgerButtonProps>(
    'LeftNavHamburgerButton',
    props => {
        return (
            <IconButton
                className={styles.leftNavHamburgerButton}
                iconProps={{ iconName: 'GlobalNavButton' }}
                ariaLabel={props.ariaLabel}
            />
        );
    },
);

export type ExpandCollpaseLeftNavButtonProps = {
    isLeftNavOpen: boolean;
};

export const AssessmentLeftNavHamburgerButton = NamedFC<ExpandCollpaseLeftNavButtonProps>(
    'AssessmentLeftNavHamburgerButton',
    props => {
        const ariaLabel: string = 'Assessment - all tests and requirements list';
        return <LeftNavHamburgerButton ariaLabel={ariaLabel} />;
    },
);

export const FastPassLeftNavHamburgerButton = NamedFC<ExpandCollpaseLeftNavButtonProps>(
    'FastPassLeftNavHamburgerButton',
    props => {
        const ariaLabel: string = 'FastPass - all tests list';
        return <LeftNavHamburgerButton ariaLabel={ariaLabel} />;
    },
);
