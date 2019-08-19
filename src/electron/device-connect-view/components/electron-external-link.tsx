// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shell } from 'electron';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';
export interface ElectronExternalLinkProps {
    href: string;
    text: string;
}

export const ElectronExternalLink = NamedSFC<ElectronExternalLinkProps>('ElectronExternalLink', (props: ElectronExternalLinkProps) => {
    const onClick = () => shell.openExternal(props.href);
    return <Link onClick={onClick}>{props.text}</Link>;
});
