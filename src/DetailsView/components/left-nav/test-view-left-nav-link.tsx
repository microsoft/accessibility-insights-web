// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-sfc';
import { BaseLeftNavLinkProps } from '../base-left-nav';

export const TestViewLeftNavLink = NamedFC<BaseLeftNavLinkProps>('TestViewLeftNavLink', ({ link, renderIcon }) => {
    return (
        <div className={'button-flex-container'} aria-hidden="true">
            {renderIcon(link)}
            <div className={'ms-Button-label test-name'}>{link.name}</div>
        </div>
    );
});
