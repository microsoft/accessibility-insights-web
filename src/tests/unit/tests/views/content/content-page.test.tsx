// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { NewTabLink } from 'common/components/new-tab-link';
import * as React from 'react';
import { Mock } from 'typemoq';

import { ContentCreator, ContentPage, ContentPageDeps } from 'views/content/content-page';
import { MarkupOptions } from '../../../../../views/content/markup';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('common/components/new-tab-link');

interface ExtendedMarkupOptions extends MarkupOptions {
    testString: string;
}
describe('ContentPage', () => {
    const deps = Mock.ofType<ContentPageDeps>().object;

    describe('.create', () => {
        mockReactComponents([NewTabLink]);
        it('renders', () => {
            const MyPage = ContentPage.create(({ Markup, Link }) => {
                return <>MY CONTENT</>;
            });

            const renderResult = render(<MyPage deps={deps} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('passes options through to Markup', () => {
            const MyPage = ContentPage.create(({ Markup }) => {
                return <>{(Markup as any).options.testString}</>;
            });

            const options: ExtendedMarkupOptions = {
                setPageTitle: true,
                testString: 'TEST STRING',
            };

            const renderResult = render(<MyPage deps={deps} options={options} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });

    describe('.provider', () => {
        const thePage = ContentPage.create(() => <>THE PAGE</>);
        const z = ContentPage.create(() => <>X-Y-Z</>);
        const notInTree = ContentPage.create(() => <>NOT IN TREE</>);

        const tree = {
            forest: {
                thePage,
            },
            x: {
                y: {
                    z,
                },
            },
        };

        const provider = ContentPage.provider(tree);

        it('returns allPaths', () => {
            expect(provider.allPaths()).toEqual(['forest/thePage', 'x/y/z']);
        });

        it('returns pathTo forest/thePage', () => {
            expect(provider.pathTo(thePage)).toEqual('forest/thePage');
        });

        it('returns pathTo x/y/z', () => {
            expect(provider.pathTo(z)).toEqual('x/y/z');
        });

        it('returns null for pathTo page not in the tree', () => {
            expect(provider.pathTo(notInTree)).toBeNull();
        });

        it('finds forest/thePage', () => {
            const MyPage = provider.getPage('forest/thePage');
            const renderResult = render(<MyPage deps={deps} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        [
            'forest',
            'notForest/thePage',
            'forest/notThePage',
            'extraPath/forest/thePage',
            'thePage',
        ].forEach(page =>
            it(`doesn't find ${page}`, () => {
                const MyPage = provider.getPage(page);
                expect(MyPage.displayName).toEqual('ContentPageComponent');
                const renderResult = render(<MyPage deps={deps} />);
                expect(renderResult.asFragment()).toMatchSnapshot();
            }),
        );
    });

    describe('ContentCreator links', () => {
        const linksMap = {
            testLink: { text: 'testLink text', href: 'testLink href' },
        };

        const create = ContentCreator(linksMap);

        it('renders', () => {
            const MyPage = create(({ Link }) => <Link.testLink />);
            const renderResult = render(<MyPage deps={deps} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('renders, children is text', () => {
            const MyPage = create(({ Link }) => <Link.testLink>OVERRIDE</Link.testLink>);

            const renderResult = render(<MyPage deps={deps} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
