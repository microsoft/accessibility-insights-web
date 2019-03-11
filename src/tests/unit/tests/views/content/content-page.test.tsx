// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { Mock } from 'typemoq';

import { shallow } from 'enzyme';
import { ContentPage, ContentPageDeps } from '../../../../../views/content/content-page';

describe('ContentPage', () => {
    const deps = Mock.ofType<ContentPageDeps>().object;

    describe('.create', () => {
        it('renders', () => {
            const MyPage = ContentPage.create(({ Markup, Link }) => {
                return <>MY CONTENT</>;
            });

            const wrapper = shallow(<MyPage deps={deps} />);
            expect(wrapper.debug()).toMatchSnapshot();
        });

        it('passes options through to Markup', () => {
            const MyPage = ContentPage.create(({ Markup }) => {
                return <>{(Markup as any).options.testString}</>;
            });

            const wrapper = shallow(<MyPage deps={deps} options={{ setPageTitle: true, testString: 'TEST STRING' }} />);
            expect(wrapper.debug()).toMatchSnapshot();
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
            const wrapper = shallow(<MyPage deps={deps} />);
            expect(wrapper.debug()).toEqual('<Fragment>\n  <Disclaimer />\n  THE PAGE\n</Fragment>');
        });

        ['forest', 'notForest/thePage', 'forest/notThePage', 'extraPath/forest/thePage', 'thePage'].forEach(page =>
            it(`doesn't find ${page}`, () => {
                const MyPage = provider.getPage(page);
                expect(MyPage.displayName).toEqual('ContentPageComponent');
                const wrapper = shallow(<MyPage deps={deps} />);
                expect(
                    wrapper
                        .find('h1')
                        .first()
                        .text(),
                ).toEqual(`Cannot find ${page}`);
            }),
        );
    });
});
