// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewTabLink } from 'common/components/new-tab-link';
import { CheckIcon } from 'common/icons/check-icon';
import { CrossIcon } from 'common/icons/cross-icon';
import { ContentActionMessageCreator } from 'common/message-creators/content-action-message-creator';
import { create } from 'content/common';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';
import { It, Mock, Times } from 'typemoq';

import { createMarkup } from 'views/content/markup';

jest.mock('common/icons/check-icon');
jest.mock('common/icons/cross-icon');
jest.mock('common/components/new-tab-link');
jest.mock('react-helmet');

describe('ContentPage', () => {
    mockReactComponents([CheckIcon, CrossIcon, NewTabLink, Helmet]);
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
            const renderResult = render(<Title>TEST</Title>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        [true, false, null].forEach(value =>
            it(`<Title> renders where setPageTitle === ${value}`, () => {
                const Markup = createMarkup(deps, { setPageTitle: value });
                const renderResult = render(<Markup.Title>TEST</Markup.Title>);
                expect(renderResult.asFragment()).toMatchSnapshot();
            }),
        );

        it('<LandmarkLegend> renders', () => {
            const renderResult = render(<LandmarkLegend role="main">TEST</LandmarkLegend>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<Table> renders', () => {
            const renderResult = render(<Table>table content</Table>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<ProblemList> renders', () => {
            const renderResult = render(<ProblemList>list content</ProblemList>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<LandmarkLegend> renders', () => {
            const renderResult = render(<Do>THINGS TO DO</Do>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<Do> renders', () => {
            const renderResult = render(<Do>THINGS TO DO</Do>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<Dont> renders', () => {
            const renderResult = render(<Dont>DON'T DO THIS</Dont>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<Pass> renders', () => {
            const renderResult = render(<Pass>I PASSED :)</Pass>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<Fail> renders', () => {
            const renderResult = render(<Fail>I FAILED :(</Fail>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<Columns> renders', () => {
            const renderResult = render(<Columns>INSIDE COLUMNS</Columns>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<Column> renders', () => {
            const renderResult = render(<Column>INSIDE COLUMN</Column>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<Inline> renders', () => {
            const renderResult = render(<Inline>INLINED</Inline>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('<Include> renders', () => {
            const renderResult = render(
                <Include
                    content={create(() => (
                        <div>INCLUDE</div>
                    ))}
                />,
            );
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        describe('<PassFail>', () => {
            it('renders without example headers', () => {
                const renderResult = render(
                    <PassFail
                        failText={<p>I FAILED :(</p>}
                        failExample="This is the failure [example]."
                        passText={<p>I PASSED!</p>}
                        passExample="This is the passing [example]."
                    />,
                );
                expect(renderResult.asFragment()).toMatchSnapshot();
            });

            it('renders with example headers', () => {
                const renderResult = render(
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
                expect(renderResult.asFragment()).toMatchSnapshot();
            });
        });

        describe('<HyperLink>', () => {
            const href = 'http://my.link';

            const renderResult = render(<HyperLink href={href}>LINK TEXT</HyperLink>);
            it('renders', () => {
                expect(renderResult.asFragment()).toMatchSnapshot();
            });

            it('registers click with event', async () => {
                await userEvent.click(renderResult.container.querySelector('.insights-link'));
                contentActionMessageCreatorMock
                    .setup(m => m.openContentHyperLink(It.isAny(), href))
                    .verifiable(Times.once());
            });
        });

        it('<Highlight> renders', () => {
            const renderResult = render(<Highlight>HIGHLIGHTED</Highlight>);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        describe('<Links>', () => {
            const link1 = <HyperLink href="about:blank">One</HyperLink>;
            const link2 = <HyperLink href="about:blank">Two</HyperLink>;
            const link3 = <HyperLink href="about:blank">Three</HyperLink>;

            it('renders with text', () => {
                const renderResult = render(<Links>Some text</Links>);
                expect(renderResult.asFragment()).toMatchSnapshot();
            });

            it('renders with one link', () => {
                const renderResult = render(<Links>{link1}</Links>);
                expect(renderResult.asFragment()).toMatchSnapshot();
            });

            it('renders with many links', () => {
                const renderResult = render(
                    <Links>
                        {link1}
                        {link2}
                        {link3}
                    </Links>,
                );
                expect(renderResult.asFragment()).toMatchSnapshot();
            });
        });
    });
});
