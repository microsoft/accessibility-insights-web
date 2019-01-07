// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { Mock } from 'typemoq';

import { ContentPage, ContentPageDeps } from '../../../../../views/content/content-page';
import { shallowRender } from '../../../common/shallow-render';

describe('ContentPage', () => {

    const deps = Mock.ofType<ContentPageDeps>().object;

    describe('.create', () => {

        it('renders', () => {

            const MyPage = ContentPage.create(({ Markup, Link }) => {

                return <>MY CONTENT</>;
            });

            const result = shallowRender(<MyPage deps={deps} />);
            expect(result.props.children).toEqual('MY CONTENT');

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
            const result = shallowRender(<MyPage deps={deps} />);
            expect(result.props.children).toEqual('THE PAGE');
        });

        [
            'forest',
            'notForest/thePage',
            'forest/notThePage',
            'extraPath/forest/thePage',
            'thePage',
        ].forEach(page => it(`doesn't find ${page}`, () => {

            const MyPage = provider.getPage(page);
            expect(MyPage.displayName).toEqual('ContentPageComponent');
            const result = shallowRender(<MyPage deps={deps} />);
            expect(result.props.children).toEqual(['Cannot find ', page]);

        }));

    });

});

