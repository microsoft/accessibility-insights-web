// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import { shallow } from 'enzyme';
import * as React from 'react';

import { ExternalLink, ExternalLinkDeps } from '../../../../../common/components/external-link';

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

    const rendered = shallow(
        <ExternalLink deps={deps} href={href} title={title}>
            {text}
        </ExternalLink>,
    );

    const link = rendered.find(NewTabLinkWithTooltip);

    it('renders Link', () => {
        expect(link.exists()).toEqual(true);
        expect(link.type()).toEqual(NewTabLinkWithTooltip);
        expect(link.prop('href')).toEqual(href);
        expect(link.prop('tooltipContent')).toEqual(title);
        expect(link.children().debug()).toEqual(text);
    });

    it('triggers initiator on click', () => {
        link.simulate('click');
        expect(openExternalLink).toBeCalledWith(undefined, { href });
    });
});
