// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { LeftNavLinkProps } from '../details-view-left-nav';

export const TestViewLeftNavLink = NamedSFC<LeftNavLinkProps>('TestViewLeftNavLink', ({ link, renderIcon }) => {
    return (
        <div
            className={'button-flex-container'}
            aria-hidden="true"
        >
            {renderIcon(link)}
            <div className={'ms-Button-label test-name'}>
                {link.name}
            </div>
        </div>
    );
});
