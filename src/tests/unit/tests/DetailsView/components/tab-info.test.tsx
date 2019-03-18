// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from 'office-ui-fabric-react/lib/Link';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { IMock, Mock } from 'typemoq';

import { css } from '@uifabric/utilities';
import { DropdownClickHandler } from '../../../../../common/dropdown-click-handler';
import { FeatureFlags, getDefaultFeatureFlagValues } from '../../../../../common/feature-flags';
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
            let actionCreatorMock: IMock<DetailsViewActionMessageCreator>;
            let dropdownClickHandlerMock: IMock<DropdownClickHandler>;
            let testProps: TabInfoProps;

            beforeEach(() => {
                actionCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
                dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);

                testProps = {
                    title: 'test title',
                    url: 'test url',
                    actionCreator: actionCreatorMock.object,
                    isTargetPageHidden: false,
                    selectedPivot: DetailsViewPivotType.allTest,
                    featureFlags: getDefaultFeatureFlagValues(),
                    dropdownClickHandler: dropdownClickHandlerMock.object,
                } as TabInfoProps;

                testProps.featureFlags[FeatureFlags.newAssessmentExperience] = false;
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

            function getTargetPageInfo(): JSX.Element {
                return (
                    <div className="target-tab-info">
                        Target page:&nbsp;
                        <Link
                            role="link"
                            className={css('target-page-link', 'insights-link')}
                            onClick={testProps.actionCreator.switchToTargetTab}
                        >
                            {testProps.title}
                        </Link>
                        &nbsp;({testProps.url})
                    </div>
                ) as JSX.Element;
            }

            function getExpectedComponentRendered(warningMessageBar: JSX.Element, tabInfo: JSX.Element): JSX.Element {
                return (
                    <div>
                        {warningMessageBar}
                        {tabInfo}
                    </div>
                );
            }

            test('render with all test as selected pivot', () => {
                const component = React.createElement(TabInfo, testProps);
                const testObject = TestUtils.renderIntoDocument(component);

                const warningMessageBar = null;
                const tabInfo = getTargetPageInfo();
                const expectedComponent = getExpectedComponentRendered(warningMessageBar, tabInfo);

                expect(testObject.render()).toEqual(expectedComponent);
            });

            test('render with fastpass as selected pivot', () => {
                testProps.selectedPivot = DetailsViewPivotType.fastPass;

                const component = React.createElement(TabInfo, testProps);
                const testObject = TestUtils.renderIntoDocument(component);

                const warningMessageBar = null;
                const tabInfo = getTargetPageInfo();
                const expectedComponent = getExpectedComponentRendered(warningMessageBar, tabInfo);

                expect(testObject.render()).toEqual(expectedComponent);
            });

            test('render with assessments as selected pivot, default values (off) for new assessments flag', () => {
                testProps.selectedPivot = DetailsViewPivotType.assessment;

                const component = React.createElement(TabInfo, testProps);
                const testObject = TestUtils.renderIntoDocument(component);

                const warningMessageBar = null;
                const tabInfo = getTargetPageInfo();
                const expectedComponent = getExpectedComponentRendered(warningMessageBar, tabInfo);

                expect(testObject.render()).toEqual(expectedComponent);
            });

            test('render with assessments as selected pivot, new assessments experience is on', () => {
                testProps.selectedPivot = DetailsViewPivotType.assessment;
                testProps.featureFlags[FeatureFlags.newAssessmentExperience] = true;

                const component = React.createElement(TabInfo, testProps);
                const testObject = TestUtils.renderIntoDocument(component);

                const warningMessageBar = null;
                const tabInfo = null;
                const expectedComponent = getExpectedComponentRendered(warningMessageBar, tabInfo);

                expect(testObject.render()).toEqual(expectedComponent);
            });

            test('render with invalid pivot', () => {
                testProps.selectedPivot = DetailsViewPivotType.assessment;

                const component = React.createElement(TabInfo, testProps);
                const testObject = TestUtils.renderIntoDocument(component);

                const warningMessageBar = null;
                const tabInfo = getTargetPageInfo();
                const expectedComponent = getExpectedComponentRendered(warningMessageBar, tabInfo);

                expect(testObject.render()).toEqual(expectedComponent);
            });

            test('render with warning messagebar', () => {
                testProps.isTargetPageHidden = true;

                const component = React.createElement(TabInfo, testProps);
                const testObject = TestUtils.renderIntoDocument(component);

                const warningMessageBar = getExpectedWarningMessageBar();
                const tabInfo = getTargetPageInfo();
                const expectedComponent = getExpectedComponentRendered(warningMessageBar, tabInfo);

                expect(testObject.render()).toEqual(expectedComponent);
            });
        });
    });
});
