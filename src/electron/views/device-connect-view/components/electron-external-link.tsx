// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import { Shell } from 'electron';
import * as React from 'react';

export interface ElectronExternalLinkProps {
    href: string;
    shell: Shell;
    children: React.ReactNode;
}

export const ElectronExternalLink = NamedFC<ElectronExternalLinkProps>(
    'ElectronExternalLink',
    (props: ElectronExternalLinkProps) => {
        const onClick = async (event: React.MouseEvent<any>) => {
            await props.shell.openExternal(props.href);
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Link role="link" onClick={onClick}>
                {props.children}
            </Link>
        );
    },
);
