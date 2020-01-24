// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-fc';
import { BaseLeftNavLinkProps } from '../base-left-nav';

export const TestViewLeftNavLink = NamedFC<BaseLeftNavLinkProps>(
    'TestViewLeftNavLink',
    ({ link, renderIcon }) => {
        return (
            <span className={'button-flex-container'} aria-hidden="true">
                {renderIcon(link)}
                <span className={'ms-Button-label test-name'}>{link.name}</span>
            </span>
        );
    },
);
