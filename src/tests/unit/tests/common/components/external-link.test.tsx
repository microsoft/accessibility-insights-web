// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as React from 'react';
import { ExternalLink, ExternalLinkDeps } from '../../../../../common/components/external-link';
import '@testing-library/jest-dom';

describe('ExternalLink', () => {
    const href = 'about:blank';
    const title = 'TITLE';
    const text = 'LINK TEXT';
    const openExternalLink = jest.fn();

    const deps = {
        actionInitiators: {
            openExternalLink,
        },
    } as ExternalLinkDeps;

    it('renders Link', () => {
        const renderResult = render(
            <ExternalLink deps={deps} href={href} title={title}>
                {text}
            </ExternalLink>,
        );
        const link = renderResult.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', href);
        expect(link.textContent).toEqual(text);

        const tooltip = renderResult.getByText(title);
        expect(tooltip).toBeInTheDocument();
    });

    it('triggers initiator on click', async () => {
        const renderResult = render(
            <ExternalLink deps={deps} href={href} title={title}>
                {text}
            </ExternalLink>,
        );
        await userEvent.click(renderResult.getByRole('link'));
        expect(openExternalLink).toHaveBeenCalledTimes(1);
    });
});
