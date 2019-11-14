// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

import {
    ExternalLink,
    ExternalLinkDeps,
} from '../../../../../common/components/external-link';

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

    const link = rendered.find(Link);

    it('renders Link', () => {
        expect(link.exists()).toEqual(true);
        expect(link.type()).toEqual(Link);
        expect(link.prop('href')).toEqual(href);
        expect(link.prop('title')).toEqual(title);
        expect(link.children().debug()).toEqual(text);
    });

    it('triggers initiator on click', () => {
        link.simulate('click');
        expect(openExternalLink).toBeCalledWith(undefined, { href });
    });
});
