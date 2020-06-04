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

export const getAssessmentLeftNavHamburgerButton = (): JSX.Element => {
    const ariaLabel: string = 'Assessment expand to see list of all tests and requirements';
    return <LeftNavHamburgerButton ariaLabel={ariaLabel} />;
};

export const getFastPassLeftNavHamburgerButton = (): JSX.Element => {
    const ariaLabel: string = 'FastPass expand to see a list of all tests';
    return <LeftNavHamburgerButton ariaLabel={ariaLabel} />;
};
