// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css, INavLink } from 'office-ui-fabric-react';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { StatusIcon } from '../status-icon';

export type LeftNavIconProps = {
    item: INavLink;
    className?: string;
};

export const LeftNavStatusIcon = NamedFC<LeftNavIconProps>('LeftNavStatusIcon', props => {
    const { item } = props;
    const classes = css('left-nav-icon', props.className);

    return <StatusIcon status={item.status} className={classes} level="test" />;
});

export const LeftNavIndexIcon = NamedFC<LeftNavIconProps>('LeftNavIndexIcon', props => {
    const { item } = props;

    return <span className={'index-circle'}>{item.index}</span>;
});
