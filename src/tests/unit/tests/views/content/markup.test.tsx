// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentActionMessageCreator } from 'common/message-creators/content-action-message-creator';
import { create } from 'content/common';
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

import { createMarkup } from 'views/content/markup';

describe('ContentPage', () => {
    const contentActionMessageCreatorMock = Mock.ofType<ContentActionMessageCreator>();
    const applicationTitle = 'THE_APPLICATION_TITLE';
    const deps = {
        textContent: {
            applicationTitle,
        },
        contentActionMessageCreator: contentActionMessageCreatorMock.object,
    };

    beforeEach(() => {
        contentActionMessageCreatorMock.reset();
    });

    const {
        Title,
        Do,
        Dont,
        Pass,
        Fail,
        PassFail,
        Columns,
        Column,
        Inline,
        HyperLink,
        CodeExample,
        Highlight,
        Links,
        LandmarkLegend,
        Table,
        ProblemList,
        Include,
    } = createMarkup(deps, null);

    describe('.Markup', () => {
        it('<Title> renders where options not specified', () => {
            const wrapper = shallow(<Title>TEST</Title>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        [true, false, null].forEach(value =>
            it(`<Title> renders where setPageTitle === ${value}`, () => {
                const Markup = createMarkup(deps, { setPageTitle: value });
                const wrapper = shallow(<Markup.Title>TEST</Markup.Title>);
                expect(wrapper.getElement()).toMatchSnapshot();
            }),
        );

        it('<LandmarkLegend> renders', () => {
            const wrapper = shallow(<LandmarkLegend role="main">TEST</LandmarkLegend>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<Table> renders', () => {
            const wrapper = shallow(<Table>table content</Table>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<ProblemList> renders', () => {
            const wrapper = shallow(<ProblemList>list content</ProblemList>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<LandmarkLegend> renders', () => {
            const wrapper = shallow(<Do>THINGS TO DO</Do>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<Do> renders', () => {
            const wrapper = shallow(<Do>THINGS TO DO</Do>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<Dont> renders', () => {
            const wrapper = shallow(<Dont>DON'T DO THIS</Dont>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<Pass> renders', () => {
            const wrapper = shallow(<Pass>I PASSED :)</Pass>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<Fail> renders', () => {
            const wrapper = shallow(<Fail>I FAILED :(</Fail>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<Columns> renders', () => {
            const wrapper = shallow(<Columns>INSIDE COLUMNS</Columns>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<Column> renders', () => {
            const wrapper = shallow(<Column>INSIDE COLUMN</Column>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<Inline> renders', () => {
            const wrapper = shallow(<Inline>INLINED</Inline>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('<Include> renders', () => {
            const wrapper = shallow(
                <Include
                    content={create(() => (
                        <div>INCLUDE</div>
                    ))}
                />,
            );
            expect(wrapper.debug()).toMatchSnapshot();
        });

        describe('<PassFail>', () => {
            it('renders without example headers', () => {
                const wrapper = shallow(
                    <PassFail
                        failText={<p>I FAILED :(</p>}
                        failExample="This is the failure [example]."
                        passText={<p>I PASSED!</p>}
                        passExample="This is the passing [example]."
                    />,
                );
                expect(wrapper.getElement()).toMatchSnapshot();
            });

            it('renders with example headers', () => {
                const wrapper = shallow(
                    <PassFail
                        failText={<p>I FAILED :(</p>}
                        failExample={
                            <CodeExample title="How I failed">
                                This is the failure [example].
                            </CodeExample>
                        }
                        passText={<p>I PASSED!</p>}
                        passExample={
                            <CodeExample
                                title={
                                    <>
                                        How I <b>passed</b>
                                    </>
                                }
                            >
                                This is the passing [example].
                            </CodeExample>
                        }
                    />,
                );
                expect(wrapper.getElement()).toMatchSnapshot();
            });
        });

        describe('<HyperLink>', () => {
            const href = 'http://my.link';

            const wrapper = shallow(<HyperLink href={href}>LINK TEXT</HyperLink>);

            it('renders', () => {
                expect(wrapper.getElement()).toMatchSnapshot();
            });

            it('registers click with event', () => {
                wrapper.simulate('click');

                contentActionMessageCreatorMock.verify(
                    m => m.openContentHyperLink(It.isAny(), href),
                    Times.once(),
                );
            });
        });

        it('<Highlight> renders', () => {
            const wrapper = shallow(<Highlight>HIGHLIGHTED</Highlight>);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        describe('<Links>', () => {
            const link1 = <HyperLink href="about:blank">One</HyperLink>;
            const link2 = <HyperLink href="about:blank">Two</HyperLink>;
            const link3 = <HyperLink href="about:blank">Three</HyperLink>;

            it('renders with text', () => {
                const wrapper = shallow(<Links>Some text</Links>);
                expect(wrapper.getElement()).toMatchSnapshot();
            });

            it('renders with one link', () => {
                const wrapper = shallow(<Links>{link1}</Links>);
                expect(wrapper.getElement()).toMatchSnapshot();
            });

            it('renders with many links', () => {
                const wrapper = shallow(
                    <Links>
                        {link1}
                        {link2}
                        {link3}
                    </Links>,
                );
                expect(wrapper.getElement()).toMatchSnapshot();
            });
        });
    });
});
