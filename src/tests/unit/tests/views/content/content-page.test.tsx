// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';
import {
    ContentCreator,
    ContentCreatorWithTitle,
    ContentPage,
    ContentPageComponent,
    ContentPageDeps,
    linkTo,
} from 'views/content/content-page';
import { NewTabLink } from '../../../../../common/components/new-tab-link';

describe('ContentPage', () => {
    const deps = Mock.ofType<ContentPageDeps>().object;

    describe('.create', () => {
        it('renders', () => {
            const MyPage = ContentPage.create(({ Markup, Link }) => {
                return <>MY CONTENT</>;
            });

            const result = shallow(<MyPage deps={deps} />);
            expect(result.getElement()).toMatchSnapshot();
        });

        it('passes options through to Markup', () => {
            const MyPage = ContentPage.create(({ Markup }) => {
                return <>{(Markup as any).options.testString}</>;
            });

            const result = shallow(
                <MyPage deps={deps} options={{ setPageTitle: true, testString: 'TEST STRING' }} />,
            );
            expect(result.getElement()).toMatchSnapshot();
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
            const result = shallow(<MyPage deps={deps} />);
            expect(result.getElement()).toMatchSnapshot();
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
                const result = shallow(<MyPage deps={deps} />);
                expect(result.getElement()).toMatchSnapshot();
            }),
        );
    });

    describe('ContentCreator links', () => {
        const linksMap = {
            testLink: linkTo('text', 'href'),
        };

        const create = ContentCreator(linksMap);

        it('renders', () => {
            const MyPage = create(({ Link }) => <Link.testLink />);

            const wrapped = mount(<MyPage deps={deps} />);

            const link = wrapped.find(NewTabLink);

            expect(link.getElement()).toMatchSnapshot();
        });

        it('renders, children is text', () => {
            const MyPage = create(({ Link }) => <Link.testLink>OVERRIDE</Link.testLink>);

            const wrapped = mount(<MyPage deps={deps} />);

            const link = wrapped.find(NewTabLink);

            expect(link.getElement()).toMatchSnapshot();
        });

        it('...WithTitle sets title', () => {
            const config = { pageTitle: 'Test title' };
            const contentPage = {} as ContentPageComponent;
            const props = ({ Link }) => <Link.testLink />;
            const createMock = Mock.ofInstance(create);
            createMock.setup(a => a(props)).returns(() => contentPage);

            const createWithTitle = ContentCreatorWithTitle(createMock.object);
            const MyPage = createWithTitle(config, props);

            createMock.verifyAll();
            expect(MyPage).toMatchSnapshot();
        });
    });
});
