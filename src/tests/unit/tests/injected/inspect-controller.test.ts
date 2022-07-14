// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectStore } from 'background/stores/inspect-store';
import { InspectMode } from 'common/types/store-data/inspect-modes';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import {
    ConfigurationKey,
    InspectConfigurationFactory,
} from '../../../../common/configs/inspect-configuration-factory';
import { InspectStoreData } from '../../../../common/types/store-data/inspect-store-data';
import { InspectController } from '../../../../injected/inspect-controller';
import { ScopingListener } from '../../../../injected/scoping-listener';

describe('InspectControllerTests', () => {
    let inspectStoreMock: IMock<InspectStore>;
    let inspectStoreState: InspectStoreData;
    let scopingListenerMock: IMock<ScopingListener>;
    let inspectConfigurationMock: IMock<InspectConfigurationFactory>;
    let defaultState: InspectMode;
    let onHoverStub: (selector: string[]) => void;
    let changeInspectModeMock: IMock<
        (event: React.MouseEvent<HTMLButtonElement> | MouseEvent, inspectMode: InspectMode) => void
    >;
    let testObject: InspectController;

    beforeEach(() => {
        inspectStoreMock = Mock.ofType(InspectStore);
        scopingListenerMock = Mock.ofType(ScopingListener, MockBehavior.Strict);
        inspectConfigurationMock = Mock.ofType(InspectConfigurationFactory, MockBehavior.Strict);
        changeInspectModeMock = Mock.ofInstance(
            (
                event: React.MouseEvent<HTMLButtonElement> | MouseEvent,
                inspectMode: InspectMode,
            ) => {},
        );
        onHoverStub = () => {};

        testObject = new InspectController(
            inspectStoreMock.object,
            scopingListenerMock.object,
            changeInspectModeMock.object,
            inspectConfigurationMock.object,
            onHoverStub,
        );

        defaultState = InspectMode.off;

        inspectStoreMock.setup(sm => sm.addChangedListener(It.isAny()));
        inspectStoreMock.setup(sm => sm.getState()).returns(() => inspectStoreState);
    });

    afterEach(() => {
        inspectStoreMock.verifyAll();
        inspectStoreState = {
            inspectMode: InspectMode.off,
            hoveredOverSelector: null,
        };
    });

    test('do not start inspect if inspect store state is null', () => {
        inspectStoreState = null;
        changeInspectModeMock
            .setup(sm => sm(It.isAny(), It.isValue(defaultState)))
            .verifiable(Times.once());

        testObject.listenToStore();
        inspectStoreMock.verifyAll();
    });

    test('call start inspect if inspect store state has changed', () => {
        const inspectType = InspectMode.scopingAddExclude;
        const givenSelector = ['selector'];

        inspectStoreState = {
            inspectMode: inspectType,
            hoveredOverSelector: null,
        };
        let sendSelector;

        changeInspectModeMock
            .setup(sm => sm(It.isAny(), It.isValue(inspectType)))
            .verifiable(Times.once());

        const inspectConfigMock = Mock.ofInstance((event, selector) => {});
        inspectConfigMock
            .setup(sm => sm(It.isAny(), It.isValue(givenSelector)))
            .verifiable(Times.once());

        scopingListenerMock
            .setup(sm => sm.start(It.isAny(), onHoverStub))
            .callback(callback => {
                sendSelector = callback;
            })
            .verifiable(Times.once());

        scopingListenerMock.setup(sm => sm.stop()).verifiable(Times.once());

        inspectConfigurationMock
            .setup(sm => sm.getConfigurationByKey(inspectType))
            .returns((ev, selector) => inspectConfigMock.object)
            .verifiable(Times.once());

        testObject.listenToStore();
        sendSelector();

        scopingListenerMock.verifyAll();
    });

    test("don't call start inspect if inspect store state has changed to off", () => {
        inspectStoreState = {
            inspectMode: defaultState,
            hoveredOverSelector: null,
        };

        const givenSelector = ['selector'];

        changeInspectModeMock
            .setup(sm => sm(It.isAny(), It.isValue(defaultState)))
            .verifiable(Times.once());

        const inspectConfigMock = Mock.ofInstance((event, selector) => {});
        inspectConfigMock
            .setup(sm => sm(It.isAny(), It.isValue(givenSelector)))
            .verifiable(Times.once());

        scopingListenerMock.setup(sm => sm.stop()).verifiable(Times.never());

        inspectConfigurationMock
            .setup(sm => sm.getConfigurationByKey(defaultState as ConfigurationKey))
            .returns((ev, selector) => inspectConfigMock.object)
            .verifiable(Times.never());

        testObject.listenToStore();

        scopingListenerMock.verifyAll();
    });
});
