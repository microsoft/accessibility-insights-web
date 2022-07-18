// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';
import { StateMachine } from 'electron/platform/android/setup/state-machine/state-machine';
import { StateMachineSteps } from 'electron/platform/android/setup/state-machine/state-machine-steps';
import { ExpectedCallType, It, Mock, MockBehavior, Times } from 'typemoq';

type MartiniStepId = 'gin' | 'vermouth' | 'olives';

class MartiniActions {
    public shake = new SyncAction<void>();
    public stir = new SyncAction<void>();
    public garnish = new SyncAction<string>();
}

type MartiniSteps = StateMachineSteps<MartiniStepId, MartiniActions>;
type MartiniStepTransition = (stepId: MartiniStepId) => void;

describe('Android setup state machine', () => {
    const factory = (onStepTransition: MartiniStepTransition): MartiniSteps => {
        return {
            gin: {
                actions: {
                    shake: () => onStepTransition('olives'),
                },
            },
            vermouth: null,
            olives: {
                actions: {
                    garnish: (name: string) => onStepTransition('vermouth'),
                },
            },
        };
    };

    it('constructor calls factory and step transition callback', () => {
        const factoryMock = Mock.ofInstance(factory, MockBehavior.Strict, true);
        factoryMock
            .setup(m => m(It.isAny()))
            .returns(factory)
            .verifiable(Times.once());

        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock.setup(m => m('gin')).verifiable(Times.once());

        const sm = new StateMachine<MartiniStepId, MartiniActions>(
            factoryMock.object,
            stepTransitionCallbackMock.object,
            'gin',
        );

        expect(sm).toBeTruthy();
        factoryMock.verifyAll();
        stepTransitionCallbackMock.verifyAll();
    });

    it('constructor throws exception on null factory', () => {
        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock
            .setup(m => m(It.is<MartiniStepId>(v => true)))
            .verifiable(Times.never());

        const construction = () =>
            new StateMachine<MartiniStepId, MartiniActions>(
                null,
                stepTransitionCallbackMock.object,
                'gin',
            );

        expect(construction).toThrowError();

        stepTransitionCallbackMock.verifyAll();
    });

    it('constructor throws exception on null step transition callback', () => {
        const factoryMock = Mock.ofInstance(factory, MockBehavior.Strict, true);
        factoryMock
            .setup(m => m(It.isAny()))
            .returns(factory)
            .verifiable(Times.never());

        const construction = () =>
            new StateMachine<MartiniStepId, MartiniActions>(factoryMock.object, null, 'gin');

        expect(construction).toThrowError();

        factoryMock.verifyAll();
    });

    it('constructor throws exception if factory returns invalid object', () => {
        const factoryMock = Mock.ofInstance(factory, MockBehavior.Strict, true);
        factoryMock
            .setup(m => m(It.isAny()))
            .returns(null)
            .verifiable(Times.once());

        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock
            .setup(m => m(It.is<MartiniStepId>(v => true)))
            .verifiable(Times.never());

        const construction = () =>
            new StateMachine<MartiniStepId, MartiniActions>(
                factoryMock.object,
                stepTransitionCallbackMock.object,
                'gin',
            );

        expect(construction).toThrowError();

        factoryMock.verifyAll();
        stepTransitionCallbackMock.verifyAll();
    });

    it('Fails gracefully when a step is null', () => {
        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock
            .setup(m => m(It.is<MartiniStepId>(v => true)))
            .verifiable(Times.never());

        const construction = () =>
            new StateMachine<MartiniStepId, MartiniActions>(
                factory,
                stepTransitionCallbackMock.object,
                'vermouth',
            );

        expect(construction).not.toThrow();
        stepTransitionCallbackMock.verifyAll();
    });

    it('step transition listener works', () => {
        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock
            .setup(m => m('gin'))
            .verifiable(Times.once(), ExpectedCallType.InSequence);
        stepTransitionCallbackMock
            .setup(m => m('olives'))
            .verifiable(Times.once(), ExpectedCallType.InSequence);

        const sm = new StateMachine<MartiniStepId, MartiniActions>(
            factory,
            stepTransitionCallbackMock.object,
            'gin',
        );

        sm.invokeAction('shake');

        stepTransitionCallbackMock.verifyAll();
    });

    it('invoke action fails gracefully when no action is found', () => {
        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock.setup(m => m('gin')).verifiable(Times.once());

        const sm = new StateMachine<MartiniStepId, MartiniActions>(
            factory,
            stepTransitionCallbackMock.object,
            'gin',
        );

        const testFunc = () => {
            sm.invokeAction('stir');
        };

        expect(testFunc).not.toThrow();
        stepTransitionCallbackMock.verifyAll();
    });

    it('onEnter is invoked when transition happens', () => {
        const onEnterMock = Mock.ofInstance(async () => {});
        onEnterMock
            .setup(m => m())
            .returns(_ => new Promise((resolve, reject) => resolve()))
            .verifiable(Times.once());

        const otherFactory = (
            onStepTransition: MartiniStepTransition,
        ): StateMachineSteps<MartiniStepId, MartiniActions> => {
            return {
                gin: {
                    actions: {},
                    onEnter: onEnterMock.object,
                },
                vermouth: null,
                olives: null,
            };
        };

        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock.setup(m => m('gin')).verifiable(Times.once());

        const sm = new StateMachine<MartiniStepId, MartiniActions>(
            otherFactory,
            stepTransitionCallbackMock.object,
            'gin',
        );

        expect(sm).toBeDefined();
        onEnterMock.verifyAll();
        stepTransitionCallbackMock.verifyAll();
    });

    it('onEnter promise rejected has no side effects ', () => {
        const onEnterMock = Mock.ofInstance(async () => {});
        onEnterMock
            .setup(m => m())
            .returns(
                _ => new Promise((resolve, reject) => reject(new Error('sample exception output'))),
            )
            .verifiable(Times.once());

        const otherFactory = (
            onStepTransition: MartiniStepTransition,
        ): StateMachineSteps<MartiniStepId, MartiniActions> => {
            return {
                gin: {
                    actions: {},
                    onEnter: onEnterMock.object,
                },
                vermouth: null,
                olives: null,
            };
        };

        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock.setup(m => m('gin')).verifiable(Times.once());

        const sm = new StateMachine<MartiniStepId, MartiniActions>(
            otherFactory,
            stepTransitionCallbackMock.object,
            'gin',
        );

        expect(sm).toBeDefined();
        onEnterMock.verifyAll();
        stepTransitionCallbackMock.verifyAll();
    });

    it('does not catch exceptions when calling factory', () => {
        const error = new Error('my error');

        const factoryMock = Mock.ofInstance(factory, MockBehavior.Strict, true);
        factoryMock
            .setup(m => m(It.isAny()))
            .throws(error)
            .verifiable(Times.once());

        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock
            .setup(m => m(It.is<MartiniStepId>(v => true)))
            .verifiable(Times.never());

        const construction = () =>
            new StateMachine<MartiniStepId, MartiniActions>(
                factoryMock.object,
                stepTransitionCallbackMock.object,
                'gin',
            );

        expect(construction).toThrowError(error);
        factoryMock.verifyAll();
        stepTransitionCallbackMock.verifyAll();
    });

    it('does not catch exceptions when calling step transition callback', () => {
        const factoryMock = Mock.ofInstance(factory, MockBehavior.Strict, true);
        factoryMock
            .setup(m => m(It.isAny()))
            .returns(factory)
            .verifiable(Times.once());

        const error = new Error('my error');

        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock
            .setup(m => m(It.is<MartiniStepId>(v => true)))
            .throws(error)
            .verifiable(Times.once());

        const construction = () =>
            new StateMachine<MartiniStepId, MartiniActions>(
                factoryMock.object,
                stepTransitionCallbackMock.object,
                'gin',
            );

        expect(construction).toThrowError(error);
        factoryMock.verifyAll();
        stepTransitionCallbackMock.verifyAll();
    });

    it('does not catch exceptions when calling onEnter', () => {
        const error = new Error('my error');

        const onEnterMock = Mock.ofInstance(async () => {});
        onEnterMock
            .setup(m => m())
            .throws(error)
            .verifiable(Times.once());

        const otherFactory = (
            onStepTransition: MartiniStepTransition,
        ): StateMachineSteps<MartiniStepId, MartiniActions> => {
            return {
                gin: {
                    actions: {},
                    onEnter: onEnterMock.object,
                },
                vermouth: null,
                olives: null,
            };
        };

        const stepTransitionCallbackMock = Mock.ofInstance((_: MartiniStepId) => {});
        stepTransitionCallbackMock.setup(m => m('gin')).verifiable(Times.never());

        const construction = () =>
            new StateMachine<MartiniStepId, MartiniActions>(
                otherFactory,
                stepTransitionCallbackMock.object,
                'gin',
            );

        expect(construction).toThrowError(error);
        onEnterMock.verifyAll();
        stepTransitionCallbackMock.verifyAll();
    });
});
