// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { WindowUtils } from 'common/window-utils';
import { AllFrameRunner, AllFrameRunnerTarget } from 'injected/all-frame-runner';
import { AllFrameMessenger } from 'injected/frameCommunicators/all-frame-messenger';
import {
    CommandMessage,
    PromiseWindowCommandMessageListener,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

type UnitTestTargetType = {
    id: string;
};

describe('AllFrameRunnerTests', () => {
    const unitTestListener: AllFrameRunnerTarget<UnitTestTargetType> = {
        commandSuffix: '',
        start: async () => {},
        stop: async () => {},
        transformChildResultForParent: _ => null,
        setResultCallback: _ => {},
    };

    const unitTestListenerMock = Mock.ofInstance(unitTestListener, MockBehavior.Strict);
    const allFrameMessengerMock = Mock.ofType<AllFrameMessenger>(undefined, MockBehavior.Strict);
    const htmlElementUtilsMock = Mock.ofType(HTMLElementUtils, MockBehavior.Strict);
    const windowUtilsMock = Mock.ofType(WindowUtils, MockBehavior.Strict);

    beforeEach(() => {
        unitTestListenerMock.reset();
        allFrameMessengerMock.reset();
        htmlElementUtilsMock.reset();
        windowUtilsMock.reset();
    });

    afterEach(() => {
        unitTestListenerMock.verifyAll();
        allFrameMessengerMock.verifyAll();
        windowUtilsMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    describe('initialize', () => {
        test('general behavior', () => {
            const frameRunner = getFrameRunnerInstance(
                allFrameMessengerMock,
                htmlElementUtilsMock,
                windowUtilsMock,
                unitTestListenerMock,
            );
            allFrameMessengerMock
                .setup(m => m.addMessageListener(It.isAnyString(), It.isAny()))
                .verifiable(Times.exactly(3));

            unitTestListenerMock
                .setup(m => m.setResultCallback(It.isAny()))
                .verifiable(Times.once());

            frameRunner.initialize();
        });

        test('provides listener with callback that reports results through frames', async () => {
            const frameRunner = getFrameRunnerInstance(
                allFrameMessengerMock,
                htmlElementUtilsMock,
                windowUtilsMock,
                unitTestListenerMock,
            );

            allFrameMessengerMock
                .setup(m => m.addMessageListener(It.isAnyString(), It.isAny()))
                .verifiable(Times.exactly(3));

            let providedCallback: (payload: UnitTestTargetType) => Promise<void>;
            unitTestListenerMock
                .setup(m => m.setResultCallback(It.isAny()))
                .callback(func => (providedCallback = func))
                .verifiable(Times.once());

            frameRunner.initialize();

            const topWindowCallbackMock = Mock.ofInstance((_: UnitTestTargetType) => {});
            frameRunner.topWindowCallback = topWindowCallbackMock.object;
            const fakePayload = {
                id: 'payload',
            };
            topWindowCallbackMock.setup(m => m(fakePayload)).verifiable(Times.once());

            windowUtilsMock
                .setup(m => m.isTopWindow())
                .returns(() => true)
                .verifiable(Times.once());

            await providedCallback(fakePayload);

            topWindowCallbackMock.verifyAll();
        });
    });

    test('public start: calls start in current frame & sends start command to other frames', async () => {
        const frameRunner = getFrameRunnerInstance(
            allFrameMessengerMock,
            htmlElementUtilsMock,
            windowUtilsMock,
            unitTestListenerMock,
        );

        unitTestListenerMock.setup(m => m.start()).verifiable(Times.once());
        allFrameMessengerMock.setup(m => m.initialize()).verifiable(Times.once());
        allFrameMessengerMock
            .setup(m => m.sendCommandToFrames((frameRunner as any).startCommand))
            .verifiable(Times.once());

        await frameRunner.start();
    });

    test('public stop: calls stop in current frame & sends stop command to other frames', async () => {
        const frameRunner = getFrameRunnerInstance(
            allFrameMessengerMock,
            htmlElementUtilsMock,
            windowUtilsMock,
            unitTestListenerMock,
        );

        unitTestListenerMock.setup(m => m.stop()).verifiable(Times.once());
        allFrameMessengerMock
            .setup(m => m.sendCommandToFrames((frameRunner as any).stopCommand))
            .verifiable(Times.once());

        await frameRunner.stop();
    });

    test('child frames return null when sent start message', async () => {
        unitTestListenerMock.setup(m => m.start()).verifiable(Times.once());

        const { commandId, commandFunc } =
            captureFrameMessengerCallbacks(unitTestListenerMock).start;

        allFrameMessengerMock.setup(m => m.initialize()).verifiable(Times.once());
        allFrameMessengerMock.setup(m => m.sendCommandToFrames(commandId)).verifiable(Times.once());

        expect(await commandFunc(null, null)).toBeNull();
    });

    test('child frames return null when sent stop message', async () => {
        unitTestListenerMock.setup(m => m.stop()).verifiable(Times.once());

        const { commandId, commandFunc } =
            captureFrameMessengerCallbacks(unitTestListenerMock).stop;

        allFrameMessengerMock.setup(m => m.sendCommandToFrames(commandId)).verifiable(Times.once());

        expect(await commandFunc(null, null)).toBeNull();
    });

    describe('on child result: OnResultFromChildFrame', () => {
        const newPayload = { id: 'new-payload' };
        const fakeFrames = [{ id: 'iframe1' }, { id: 'iframe2' }] as HTMLIFrameElement[];
        const fakeWindow = {} as Window;
        const fakeCm: CommandMessage = {
            command: 'fake-command',
            payload: {
                id: 'fake-payload',
            },
        };

        const setupValidMessageFromChildFrame = () => {
            htmlElementUtilsMock
                .setup(m => m.getAllElementsByTagName('iframe'))
                .returns(() => fakeFrames as any)
                .verifiable(Times.atLeastOnce());

            htmlElementUtilsMock
                .setup(m => m.getContentWindow(fakeFrames[0] as HTMLIFrameElement))
                .returns(_ => fakeWindow)
                .verifiable(Times.once());

            unitTestListenerMock
                .setup(m => m.transformChildResultForParent(fakeCm.payload, fakeFrames[0]))
                .returns(_ => newPayload)
                .verifiable(Times.once());
        };

        test('calls topWindowCallback if in main window', async () => {
            setupValidMessageFromChildFrame();

            windowUtilsMock.setup(m => m.isTopWindow()).returns(_ => true);

            const topWindowCallbackMock = Mock.ofInstance((_: UnitTestTargetType) => {});
            const { commandFunc } = captureFrameMessengerCallbacks(
                unitTestListenerMock,
                topWindowCallbackMock.object,
            ).onResultFromChildFrame;

            topWindowCallbackMock.setup(m => m(newPayload)).verifiable(Times.once());

            await commandFunc(fakeCm, fakeWindow);

            topWindowCallbackMock.verifyAll();
        });

        test('forwards payload to parent window if in child frame', async () => {
            setupValidMessageFromChildFrame();

            windowUtilsMock.setup(m => m.isTopWindow()).returns(_ => false);

            const parentWindow = {} as Window;
            windowUtilsMock.setup(m => m.getParentWindow()).returns(() => parentWindow);

            const { commandId, commandFunc } =
                captureFrameMessengerCallbacks(unitTestListenerMock).onResultFromChildFrame;

            allFrameMessengerMock
                .setup(m =>
                    m.sendMessageToWindow(parentWindow, {
                        command: commandId,
                        payload: newPayload,
                    }),
                )
                .verifiable(Times.once());

            await commandFunc(fakeCm, fakeWindow);
        });

        test('throws error if unable to identify source window of message', async () => {
            const { commandFunc } =
                captureFrameMessengerCallbacks(unitTestListenerMock).onResultFromChildFrame;

            htmlElementUtilsMock
                .setup(m => m.getAllElementsByTagName('iframe'))
                .returns(() => fakeFrames as any)
                .verifiable(Times.atLeastOnce());

            fakeFrames.forEach(f => {
                htmlElementUtilsMock
                    .setup(m => m.getContentWindow(f as HTMLIFrameElement))
                    .returns(_ => null)
                    .verifiable(Times.once());
            });

            await expect(commandFunc(fakeCm, fakeWindow)).rejects.toThrow(
                'unable to get frame element for the given window',
            );
        });
    });

    type CommandFunction = {
        commandId: string;
        commandFunc: PromiseWindowCommandMessageListener;
    };

    type AllFrameRunnerCommands = {
        start: CommandFunction;
        stop: CommandFunction;
        onResultFromChildFrame: CommandFunction;
    };

    const captureFrameMessengerCallbacks = (
        unitTestListenerMock: IMock<AllFrameRunnerTarget<UnitTestTargetType>>,
        topWindowCallback?: (result: UnitTestTargetType) => void,
    ): AllFrameRunnerCommands => {
        const frameRunner = getFrameRunnerInstance(
            allFrameMessengerMock,
            htmlElementUtilsMock,
            windowUtilsMock,
            unitTestListenerMock,
        );
        frameRunner.topWindowCallback = topWindowCallback;

        const commands: Record<string, PromiseWindowCommandMessageListener> = {};
        allFrameMessengerMock
            .setup(m => m.addMessageListener(It.isAnyString(), It.isAny()))
            .callback((command: string, func: PromiseWindowCommandMessageListener) => {
                commands[command] = func;
            })
            .verifiable(Times.exactly(3));

        unitTestListenerMock.setup(m => m.setResultCallback(It.isAny())).verifiable(Times.once());

        frameRunner.initialize();

        const startCommand = (frameRunner as any).startCommand;
        const stopCommand = (frameRunner as any).stopCommand;
        const onResultFromChildFrameCommand = (frameRunner as any).onResultFromChildFrameCommand;
        return {
            start: {
                commandId: startCommand,
                commandFunc: commands[startCommand],
            },
            stop: {
                commandId: stopCommand,
                commandFunc: commands[stopCommand],
            },
            onResultFromChildFrame: {
                commandId: onResultFromChildFrameCommand,
                commandFunc: commands[onResultFromChildFrameCommand],
            },
        };
    };

    const getFrameRunnerInstance = (
        _allFrameMessengerMock: IMock<AllFrameMessenger>,
        _htmlElementUtilsMock: IMock<HTMLElementUtils>,
        _windowUtilsMock: IMock<WindowUtils>,
        _listenerMock: IMock<AllFrameRunnerTarget<UnitTestTargetType>>,
    ) => {
        _listenerMock
            .setup(m => m.commandSuffix)
            .returns(_ => 'unit-test')
            .verifiable(Times.atLeastOnce());

        const frameRunner: AllFrameRunner<UnitTestTargetType> =
            new AllFrameRunner<UnitTestTargetType>(
                _allFrameMessengerMock.object,
                _htmlElementUtilsMock.object,
                _windowUtilsMock.object,
                _listenerMock.object,
            );

        return frameRunner;
    };
});
