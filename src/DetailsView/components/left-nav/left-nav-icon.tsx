// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { INavLink } from 'office-ui-fabric-react/lib/Nav';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { StatusIcon } from '../status-icon';

export type LeftNavIconProps = {
    item: INavLink;
};

export const LeftNavStatusIcon = NamedFC<LeftNavIconProps>('LeftNavStatusIcon', props => {
    const { item } = props;

    return (
        <div>
            <StatusIcon status={item.status} className={'dark-gray'} level="test" />
        </div>
    );
});

export const LeftNavIndexIcon = NamedFC<LeftNavIconProps>('LeftNavIndexIcon', props => {
    const { item } = props;

    return <div className={'index-circle'}>{item.index}</div>;
});
