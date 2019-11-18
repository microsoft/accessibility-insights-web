// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { IMock, Mock } from 'typemoq';
import { DropdownClickHandler } from '../../../../../common/dropdown-click-handler';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { TabInfo, TabInfoProps } from '../../../../../DetailsView/components/tab-info';

describe('TabInfo', () => {
    const scenarios = [
        {
            name: 'internal edition',
            showCoverageMessageBar: true,
        },
    ];

    scenarios.forEach(scenario => {
        describe(scenario.name, () => {
            let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
            let dropdownClickHandlerMock: IMock<DropdownClickHandler>;
            let testProps: TabInfoProps;

            beforeEach(() => {
                detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
                dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);

                testProps = {
                    deps: {
                        detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
                    },
                    title: 'test title',
                    url: 'test url',
                    isTargetPageHidden: false,
                    selectedPivot: DetailsViewPivotType.allTest,
                    dropdownClickHandler: dropdownClickHandlerMock.object,
                } as TabInfoProps;
            });

            function getExpectedWarningMessageBar(): JSX.Element {
                const text = (
                    <div>
                        The Target page is in a hidden state. For better performance, use the Target page link above to make the page
                        visible.
                    </div>
                );
                return getMessageBar(text, MessageBarType.warning, 'waring-message-bar');
            }

            function getMessageBar(messageContent: JSX.Element, messageBarType: MessageBarType, className: string): JSX.Element {
                return (
                    <MessageBar messageBarType={messageBarType} className={className}>
                        {messageContent}
                    </MessageBar>
                );
            }

            function getExpectedComponentRendered(warningMessageBar: JSX.Element): JSX.Element {
                return <div>{warningMessageBar}</div>;
            }

            test('render with warning messagebar', () => {
                testProps.isTargetPageHidden = true;

                const component = React.createElement(TabInfo, testProps);
                const testObject = TestUtils.renderIntoDocument(component);

                const warningMessageBar = getExpectedWarningMessageBar();
                const expectedComponent = getExpectedComponentRendered(warningMessageBar);

                expect(testObject.render()).toEqual(expectedComponent);
            });

            test('render without warning messagebar', () => {
                testProps.isTargetPageHidden = false;

                const component = React.createElement(TabInfo, testProps);
                const testObject = TestUtils.renderIntoDocument(component);

                expect(testObject.render()).toEqual(null);
            });
        });
    });
});
