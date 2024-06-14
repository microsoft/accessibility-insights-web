// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { getId } from '@fluentui/react';
import { LinkProps } from '@fluentui/react-components';
import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export const NewTabLinkWithConfirmationDialog = NamedFC<LinkProps>(
    'NewTabLinkWithConfirmationDialog',
    props => {
        const id = getId('new-tab-link-with-confirmation-dialog__'); // generates something like new-tab-link-with-confirmation-dialog__123

        return (
            <>
                <NewTabLink {...props} id={id} />
                {/* tslint:disable-next-line: react-no-dangerous-html */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: generateScriptToAddConfirmOnClickHandler(id),
                    }}
                />
            </>
        );
    },
);

export type ConfirmType = (message?: string) => boolean;

// Note: the source of this function's body is stringified and injected into the report.
//
// The use of function() {} syntax over arrow functions is important for IE compat (see #1875).
//
// The "istanbul ignore next" excludes the function from code coverage to prevent code cov from
// injecting functions that interfere with eval in the unit tests.
//
/* istanbul ignore next */
const addConfirmOnClickHandler = function (
    linkId: string,
    doc: Document,
    confirmCallback: ConfirmType,
): void {
    const targetPageLink = doc.getElementById(linkId)!;
    targetPageLink.addEventListener('click', function (event): void {
        const result = confirmCallback(
            'Are you sure you want to navigate away from the Accessibility Insights report?\n' +
                'This link will open the target page in a new tab.\n\nPress OK to continue or ' +
                'Cancel to stay on the current page.',
        );

        if (result === false) {
            event.preventDefault();
        }
    });
};

const generateScriptToAddConfirmOnClickHandler = (linkId: string): string =>
    `(${String(addConfirmOnClickHandler)})(${JSON.stringify(linkId)}, document, confirm);`;
