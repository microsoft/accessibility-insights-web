// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FocusComponent, FocusComponentProps } from 'common/components/focus-component';
import { WindowUtils } from 'common/window-utils';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

describe('FocusComponent', () => {
    let props: FocusComponentProps;
    let windowUtilsMock: IMock<WindowUtils>;
    let tabStopRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;

    beforeEach(() => {
        windowUtilsMock = Mock.ofType(WindowUtils);
        tabStopRequirementActionMessageCreatorMock = Mock.ofType(
            TabStopRequirementActionMessageCreator,
        );
        props = {
            tabbingEnabled: true,
            deps: {
                windowUtils: windowUtilsMock.object,
                tabStopRequirementActionMessageCreator:
                    tabStopRequirementActionMessageCreatorMock.object,
            },
        };
    });

    test('render', () => {
        const testSubject = shallow(<FocusComponent {...props} />);
        expect(testSubject.getElement()).toBeNull();
    });

    test('componentDidMount adds focus listener', () => {
        windowUtilsMock
            .setup(util => util.addEventListener(It.isAny(), 'focus', It.isAny(), false))
            .verifiable(Times.once());

        const testSubject = new FocusComponent(props);
        testSubject.componentDidMount();

        windowUtilsMock.verifyAll();
    });

    test('componentWillUnmount removes listener', () => {
        windowUtilsMock
            .setup(util => util.removeEventListener(It.isAny(), 'focus', It.isAny(), false))
            .verifiable(Times.once());

        const testSubject = new FocusComponent(props);
        testSubject.componentWillUnmount();

        windowUtilsMock.verifyAll();
    });
});
