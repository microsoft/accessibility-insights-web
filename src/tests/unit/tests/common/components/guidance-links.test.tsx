// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createEvent, fireEvent, render } from '@testing-library/react';
import { ExternalLink } from 'common/components/external-link';
import { GuidanceLinks, GuidanceLinksProps } from 'common/components/guidance-links';
import { NewTabLink } from 'common/components/new-tab-link';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { forOwn } from 'lodash';
import * as React from 'react';
import { BestPractice } from 'scanner/map-axe-tags-to-guidance-links';
import {
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('common/components/external-link');

describe('GuidanceLinksTest', () => {
    mockReactComponents([ExternalLink]);
    const testLink1 = {
        text: 'text1',
        href: 'https://url1',
    } as HyperlinkDefinition;
    const testLink2 = {
        text: 'text2',
        href: 'https://url2',
    } as HyperlinkDefinition;

    test('links is null', () => {
        const props: GuidanceLinksProps = {
            links: null,
            classNameForDiv: null,
            LinkComponent: NewTabLink,
        };

        const renderResult = render(<GuidanceLinks {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('links is empty', () => {
        const props: GuidanceLinksProps = {
            links: [],
            classNameForDiv: null,
            LinkComponent: NewTabLink,
        };

        const renderResult = render(<GuidanceLinks {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    const testCases = {
        'one regular link': [testLink1],
        'two regular links': [testLink1, testLink2],
        'one best practice link': [BestPractice],
        'best practice and regular links (excludes BEST PRACTICE)': [
            BestPractice,
            testLink1,
            testLink2,
        ],
    };
    forOwn(testCases, (testCase, testName) => {
        test('links is not null and correct with ' + testName, () => {
            const props: GuidanceLinksProps = {
                links: testCase,
                classNameForDiv: 'className',
                LinkComponent: ExternalLink,
            };

            const renderResult = render(<GuidanceLinks {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });

    test('linkComponentType is defined as ExternalLink', () => {
        const props: GuidanceLinksProps = {
            links: [testLink1],
            LinkComponent: ExternalLink,
        };

        const renderResult = render(<GuidanceLinks {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('link click -> event propagation stoped', async () => {
        useOriginalReactElements('common/components/external-link', ['ExternalLink']);
        const props: GuidanceLinksProps = {
            links: [testLink1],
            classNameForDiv: 'className',
            LinkComponent: NewTabLink,
        };

        const renderResult = render(<GuidanceLinks {...props} />);
        const link = renderResult.getByRole('link');
        const stopPropagationMock = jest.fn();
        const event = createEvent.click(link);
        event.stopPropagation = stopPropagationMock;
        fireEvent(link, event);
        expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    });
});
