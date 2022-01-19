// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FocusComponent, FocusComponentProps } from 'common/components/focus-component';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { WindowUtils } from 'common/window-utils';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

describe('FocusComponent', () => {
    let props: FocusComponentProps;
    let windowUtilsMock: IMock<WindowUtils>;
    let configurationMock: IMock<VisualizationConfiguration>;
    let visualizationStoreData: VisualizationStoreData;
    let tabStopRequirementActionMessageCreatorMock: IMock<TabStopRequirementActionMessageCreator>;

    beforeEach(() => {
        windowUtilsMock = Mock.ofType(WindowUtils);
        configurationMock = Mock.ofType<VisualizationConfiguration>();
        tabStopRequirementActionMessageCreatorMock = Mock.ofType(
            TabStopRequirementActionMessageCreator,
        );
        props = {
            windowUtils: windowUtilsMock.object,
            configuration: configurationMock.object,
            visualizationStoreData,
            tabStopRequirementActionMessageCreator:
                tabStopRequirementActionMessageCreatorMock.object,
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
