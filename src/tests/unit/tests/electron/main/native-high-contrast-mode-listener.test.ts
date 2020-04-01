// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { NativeTheme } from 'electron';
import { NativeHighContrastModeListener } from 'electron/main/native-high-contrast-mode-listener';
import { itIsFunction } from 'tests/unit/common/it-is-function';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('NativeHighContrastModeListener', () => {
    let testSubject: NativeHighContrastModeListener;

    let mockNativeTheme: IMock<NativeTheme>;
    let mockMessageCreator: IMock<UserConfigMessageCreator>;

    let testSubjectOnNativeThemeUpdateHandler: Function;

    beforeEach(() => {
        mockNativeTheme = Mock.ofType<NativeTheme>(null, MockBehavior.Strict);
        mockMessageCreator = Mock.ofType<UserConfigMessageCreator>();
        testSubjectOnNativeThemeUpdateHandler = null;

        mockNativeTheme
            .setup(m => m.on('updated', itIsFunction))
            .callback((eventName, handler) => {
                testSubjectOnNativeThemeUpdateHandler = handler;
            })
            .verifiable();

        testSubject = new NativeHighContrastModeListener(
            mockNativeTheme.object,
            mockMessageCreator.object,
        );
    });

    function setNativeContrastMode(value: boolean): void {
        mockNativeTheme
            .setup(m => m.shouldUseHighContrastColors)
            .returns(() => value)
            .verifiable(Times.atLeastOnce());
    }

    it('should not register an underlying event handler until startListening', () => {
        mockNativeTheme.verify(m => m.on(It.isAny(), It.isAny()), Times.never());
    });

    it.each([true, false])(
        'should send an initial message on startListening in state %p',
        initialState => {
            mockNativeTheme.setup(m => m.shouldUseHighContrastColors).returns(() => initialState);
            testSubject.startListening();

            mockMessageCreator.verify(m => m.setNativeHighContrastMode(initialState), Times.once());
        },
    );

    it('should send messages when the underlying high contrast state changes', () => {
        setNativeContrastMode(false);
        testSubject.startListening();
        mockMessageCreator.reset();

        mockNativeTheme.reset();
        setNativeContrastMode(true);

        testSubjectOnNativeThemeUpdateHandler();
        mockMessageCreator.verify(m => m.setNativeHighContrastMode(true), Times.once());
    });

    it("should avoid sending messages for underlying state changes that don't impact high contrast mode", () => {
        setNativeContrastMode(false);
        testSubject.startListening();
        mockMessageCreator.reset();

        // shouldUseHighContrastColors still false
        testSubjectOnNativeThemeUpdateHandler();
        mockMessageCreator.verify(m => m.setNativeHighContrastMode(It.isAny()), Times.never());
    });

    it('should unregister all underlying event handlers on stopListening', () => {
        setNativeContrastMode(false);
        testSubject.startListening();

        mockNativeTheme
            .setup(m => m.removeListener('updated', testSubjectOnNativeThemeUpdateHandler))
            .verifiable(Times.once());
        testSubject.stopListening();

        mockNativeTheme.verifyAll();
    });
});
