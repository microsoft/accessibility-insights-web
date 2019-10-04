// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Shell } from 'electron';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';
import { NamedFC } from '../../../../common/react/named-fc';

export interface ElectronExternalLinkProps {
    href: string;
    shell: Shell;
    children: React.ReactNode;
}

export const ElectronExternalLink = NamedFC<ElectronExternalLinkProps>('ElectronExternalLink', (props: ElectronExternalLinkProps) => {
    const onClick = () => props.shell.openExternal(props.href);
    return <Link onClick={onClick}>{props.children}</Link>;
});
