// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsActionCreator } from 'electron/flux/action/tab-stops-action-creator';
import {
    TabStopsTestingContent,
    TabStopsTestingContentProps,
} from 'electron/views/tab-stops/tab-stops-testing-content';
import { shallow } from 'enzyme';
import { Toggle } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('TabStopsTestingContent', () => {
    let tabStopsActionCreatorMock: IMock<TabStopsActionCreator>;
    let props: TabStopsTestingContentProps;
    let eventStub: any;

    beforeEach(() => {
        eventStub = {};
        tabStopsActionCreatorMock = Mock.ofType<TabStopsActionCreator>(
            undefined,
            MockBehavior.Strict,
        );
        props = {
            deps: { tabStopsActionCreator: tabStopsActionCreatorMock.object },
            tabStopsEnabled: true,
        };
    });

    test('renders', () => {
        const testSubject = shallow(<TabStopsTestingContent {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('toggles tab stops off', () => {
        tabStopsActionCreatorMock.setup(m => m.disableTabStops(eventStub)).verifiable();
        const testSubject = shallow(<TabStopsTestingContent {...props} />);
        const onToggle = testSubject.find(Toggle).prop('onClick');
        onToggle(eventStub);

        tabStopsActionCreatorMock.verifyAll();
    });

    test('toggles tab stops on', () => {
        props.tabStopsEnabled = false;
        tabStopsActionCreatorMock.setup(m => m.enableTabStops(eventStub)).verifiable();
        const testSubject = shallow(<TabStopsTestingContent {...props} />);
        const onToggle = testSubject.find(Toggle).prop('onClick');
        onToggle(eventStub);

        tabStopsActionCreatorMock.verifyAll();
    });
});
