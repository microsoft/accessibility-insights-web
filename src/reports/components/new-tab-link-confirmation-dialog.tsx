// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import { getId, ILinkProps } from 'office-ui-fabric-react';
import * as React from 'react';

export const NewTabLinkWithConfirmationDialog = NamedFC<ILinkProps>(
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

const addConfirmOnClickHandler = (linkId: string, doc: Document, confirmCallback: ConfirmType) => {
    const targetPageLink = doc.getElementById(linkId);
    targetPageLink.addEventListener('click', event => {
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
