// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowUtils } from 'common/window-utils';
import { TargetPageActionMessageCreator } from 'injected/target-page-action-message-creator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BaseStore } from '../../../../common/base-store';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { DevToolActionMessageCreator } from '../../../../common/message-creators/dev-tool-action-message-creator';
import { DevToolStoreData } from '../../../../common/types/store-data/dev-tool-store-data';
import { DetailsDialog, DetailsDialogState } from '../../../../injected/components/details-dialog';
import { DetailsDialogHandler } from '../../../../injected/details-dialog-handler';
import { EventStubFactory } from '../../common/event-stub-factory';
import { UserConfigurationStoreData } from './../../../../common/types/store-data/user-configuration-store';

describe('DetailsDialogHandlerTest', () => {
    let testSubject: DetailsDialogHandler;
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let container: Element;
    let detailsDialog: Element;
    let containerParent: Element;
    let detailsDialogMock: IMock<DetailsDialog>;
    let windowUtilsMock: IMock<WindowUtils>;

    beforeEach(() => {
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        windowUtilsMock = Mock.ofType(WindowUtils);
        testSubject = new DetailsDialogHandler(htmlElementUtilsMock.object, windowUtilsMock.object);
        container = document.createElement('div');
        detailsDialog = document.createElement('div');
        container.appendChild(detailsDialog);
        containerParent = document.createElement('div');
        containerParent.appendChild(container);
        detailsDialogMock = Mock.ofType<DetailsDialog>();
    });

    test('backButtonClickHandler', () => {
        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 1,
                } as any;
            });

        detailsDialogMock
            .setup(dialog =>
                dialog.setState(
                    It.isValue({
                        currentRuleIndex: 0,
                    }),
                ),
            )
            .verifiable();

        testSubject.backButtonClickHandler(detailsDialogMock.object);

        detailsDialogMock.verifyAll();
    });

    test('nextButtonClickHandler', () => {
        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 0,
                } as any;
            });

        detailsDialogMock
            .setup(dialog =>
                dialog.setState(
                    It.isValue({
                        currentRuleIndex: 1,
                    }),
                ),
            )
            .verifiable();

        testSubject.nextButtonClickHandler(detailsDialogMock.object);

        detailsDialogMock.verifyAll();
    });

    test('inspectButtonClickHandler when the devtools are opened', () => {
        const devToolStoreMock = Mock.ofType<BaseStore<DevToolStoreData>>(
            undefined,
            MockBehavior.Strict,
        );
        const devToolActionMessageCreatorMock = Mock.ofType<DevToolActionMessageCreator>(
            undefined,
            MockBehavior.Strict,
        );
        const eventFactory = new EventStubFactory();
        const event = eventFactory.createMouseClickEvent();
        const target = ['frame', 'div'];

        devToolStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    isOpen: true,
                } as any;
            })
            .verifiable(Times.once());

        devToolActionMessageCreatorMock
            .setup(creator =>
                creator.setInspectElement(It.isValue(event as any), It.isValue(target)),
            )
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    target: target,
                    devToolActionMessageCreator: devToolActionMessageCreatorMock.object,
                    devToolStore: devToolStoreMock.object,
                } as any;
            })
            .verifiable(Times.atLeastOnce());

        detailsDialogMock
            .setup(dialog =>
                dialog.setState(It.isValue({ showDialog: false, showInspectMessage: false })),
            )
            .verifiable(Times.once());

        testSubject.inspectButtonClickHandler(detailsDialogMock.object, event as any);

        detailsDialogMock.verifyAll();
        devToolActionMessageCreatorMock.verifyAll();
        devToolStoreMock.verifyAll();
    });

    test('inspectButtonClickHandler when the devtools are not opened', () => {
        const devToolStoreMock = Mock.ofType<BaseStore<DevToolStoreData>>(
            undefined,
            MockBehavior.Strict,
        );
        const devToolActionMessageCreatorMock = Mock.ofType<DevToolActionMessageCreator>(
            undefined,
            MockBehavior.Strict,
        );
        const eventFactory = new EventStubFactory();
        const event = eventFactory.createMouseClickEvent();

        devToolStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    isOpen: false,
                } as DevToolStoreData;
            })
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    devToolActionMessageCreator: devToolActionMessageCreatorMock.object,
                    devToolStore: devToolStoreMock.object,
                } as any;
            })
            .verifiable(Times.atLeastOnce());

        detailsDialogMock
            .setup(dialog => dialog.setState(It.isValue({ showInspectMessage: true })))
            .verifiable(Times.once());

        testSubject.inspectButtonClickHandler(detailsDialogMock.object, event as any);

        detailsDialogMock.verifyAll();
        devToolActionMessageCreatorMock.verifyAll();
        devToolStoreMock.verifyAll();
    });

    test.each([true, false])(
        'copyIssueDetailsButtonClickHandler when isTargetPageOriginSecure=%s',
        isTargetPageOriginSecure => {
            const targetPageActionMessageCreatorMock = Mock.ofType<TargetPageActionMessageCreator>(
                undefined,
                MockBehavior.Strict,
            );

            const eventFactory = new EventStubFactory();
            const event = eventFactory.createMouseClickEvent();

            testSubject.isTargetPageOriginSecure = () => isTargetPageOriginSecure;

            targetPageActionMessageCreatorMock
                .setup(creator => creator.copyIssueDetailsClicked(It.isValue(event as any)))
                .verifiable(Times.atLeastOnce());

            detailsDialogMock
                .setup(dialog => dialog.props)
                .returns(() => {
                    return {
                        deps: {
                            targetPageActionMessageCreator:
                                targetPageActionMessageCreatorMock.object,
                        },
                    } as any;
                })
                .verifiable(Times.atLeastOnce());

            detailsDialogMock
                .setup(dialog =>
                    dialog.setState(
                        It.isValue({ showInsecureOriginPageMessage: !isTargetPageOriginSecure }),
                    ),
                )
                .verifiable(Times.once());

            testSubject.copyIssueDetailsButtonClickHandler(detailsDialogMock.object, event as any);

            detailsDialogMock.verifyAll();
            targetPageActionMessageCreatorMock.verifyAll();
        },
    );

    test.each([true, false])('isTargetPageOriginSecure=%s', isSecureOrigin => {
        windowUtilsMock
            .setup(w => w.isSecureOrigin())
            .returns(() => isSecureOrigin)
            .verifiable(Times.once());

        expect(testSubject.isTargetPageOriginSecure()).toEqual(isSecureOrigin);

        windowUtilsMock.verifyAll();
    });

    test.each([true, false])('shouldShowInsecureOriginPageMessage=%s', show => {
        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    showInsecureOriginPageMessage: show,
                } as any;
            })
            .verifiable(Times.once());

        const actualState = testSubject.shouldShowInsecureOriginPageMessage(
            detailsDialogMock.object,
        );
        expect(actualState).toEqual(show);

        detailsDialogMock.verifyAll();
    });

    test('showDialog', () => {
        detailsDialogMock
            .setup(dialog =>
                dialog.setState(
                    It.isValue({
                        showDialog: true,
                    }),
                ),
            )
            .verifiable();

        testSubject.showDialog(detailsDialogMock.object);

        detailsDialogMock.verifyAll();
    });

    test('hideDialog', () => {
        detailsDialogMock
            .setup(dialog =>
                dialog.setState(
                    It.isValue({
                        showDialog: false,
                        showInspectMessage: false,
                    }),
                ),
            )
            .verifiable();

        testSubject.hideDialog(detailsDialogMock.object);

        detailsDialogMock.verifyAll();
    });

    test('NextButtonNotDisabled', () => {
        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 1,
                } as DetailsDialogState;
            });

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    failedRules: [1, 2, 3, 4],
                } as any;
            });

        detailsDialogMock
            .setup(dialog =>
                dialog.setState(
                    It.isValue({
                        showDialog: true,
                        currentRuleIndex: 1,
                    }),
                ),
            )
            .verifiable();

        expect(testSubject.isNextButtonDisabled(detailsDialogMock.object)).toBe(false);
    });

    test('NextButtonIsDisabled', () => {
        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 3,
                } as DetailsDialogState;
            });

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    failedRules: [1, 2, 3, 4],
                } as any;
            });

        detailsDialogMock
            .setup(dialog =>
                dialog.setState(
                    It.isValue({
                        showDialog: true,
                        currentRuleIndex: 1,
                    }),
                ),
            )
            .verifiable();

        expect(testSubject.isNextButtonDisabled(detailsDialogMock.object)).toBe(true);
    });

    test('BackButtonIsDisabled', () => {
        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 0,
                } as DetailsDialogState;
            });

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    failedRules: [1, 2, 3, 4],
                } as any;
            });

        detailsDialogMock
            .setup(dialog =>
                dialog.setState(
                    It.isValue({
                        showDialog: true,
                        currentRuleIndex: 1,
                    }),
                ),
            )
            .verifiable();

        expect(testSubject.isBackButtonDisabled(detailsDialogMock.object)).toBe(true);
    });

    test('BackButtonNotDisabled', () => {
        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 1,
                } as DetailsDialogState;
            });

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    failedRules: [1, 2, 3, 4],
                } as any;
            });

        detailsDialogMock
            .setup(dialog =>
                dialog.setState(
                    It.isValue({
                        showDialog: true,
                        currentRuleIndex: 1,
                    }),
                ),
            )
            .verifiable();

        expect(testSubject.isBackButtonDisabled(detailsDialogMock.object)).toBe(false);
    });

    describe('isInspectButtonDisabled', () => {
        it.each([true, false])('canInspect %s', testIsInspectButtonDisabledShouldReflectCanInspect);
    });

    describe('onDevToolChanged', () => {
        it.each([true, false])('isOpen %s', testOnDevToolChangeSetsCanInspectToIsOpen);
    });

    describe('onUserConfigChanged', () => {
        it.each(['example', 'other example'])('itp %s', testOnUserConfigChangedUpdateState);
    });

    describe('canInspect', () => {
        it.each([true, false])('isOpen %s', testCanInspectEqualsIsOpen);
    });

    test('getFailureInfo', () => {
        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return { currentRuleIndex: 0 } as DetailsDialogState;
            });

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 0,
                    failedRules: [1, 2, 3, 4],
                } as any;
            });

        expect(testSubject.getFailureInfo(detailsDialogMock.object)).toEqual(
            'Failure 1 of 4 for this target',
        );
    });

    test('onLayoutDidMount_ableToFindDialog', () => {
        const parentLayer = createParentLayerForDialog();
        const intermdediateElement = document.createElement('div');
        const dialogContainer = document.createElement('div');

        intermdediateElement.appendChild(dialogContainer);
        parentLayer.appendChild(intermdediateElement);

        htmlElementUtilsMock
            .setup(utils => utils.querySelector('.insights-dialog-main-override'))
            .returns(() => dialogContainer)
            .verifiable();

        testSubject.onLayoutDidMount();

        expect(parentLayer.style.zIndex).toEqual('2147483647');
        htmlElementUtilsMock.verifyAll();
    });

    test('onLayoutDidMount_unableToFindDialog', () => {
        htmlElementUtilsMock
            .setup(utils => utils.querySelector('.insights-dialog-main-override'))
            .returns(() => null)
            .verifiable();

        testSubject.onLayoutDidMount();

        htmlElementUtilsMock.verifyAll();
    });

    test('onLayoutDidMount_unableToFindLayer', () => {
        const dialogContainer = document.createElement('div');
        htmlElementUtilsMock
            .setup(utils => utils.querySelector('.insights-dialog-main-override'))
            .returns(() => dialogContainer)
            .verifiable();

        testSubject.onLayoutDidMount();

        htmlElementUtilsMock.verifyAll();
    });

    test('componentDidMount adds store change listeners', () => {
        const devToolStoreMock = Mock.ofType<BaseStore<DevToolStoreData>>(
            undefined,
            MockBehavior.Strict,
        );
        const userConfigStoreMock = Mock.ofType<BaseStore<UserConfigurationStoreData>>(
            undefined,
            MockBehavior.Strict,
        );
        const userConfigStoreData: UserConfigurationStoreData = {
            bugServicePropertiesMap: {
                gitHub: {
                    repository: 'issTrackPath',
                },
            },
        } as any;

        devToolStoreMock
            .setup(store => store.addChangedListener(It.isAny()))
            .verifiable(Times.once());
        userConfigStoreMock
            .setup(store => store.addChangedListener(It.isAny()))
            .verifiable(Times.once());

        devToolStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    isOpen: false,
                } as any;
            })
            .verifiable(Times.once());

        userConfigStoreMock
            .setup(store => store.getState())
            .returns(() => userConfigStoreData)
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    devToolStore: devToolStoreMock.object,
                    userConfigStore: userConfigStoreMock.object,
                    enableIssueFiling: true,
                } as any;
            })
            .verifiable(Times.atLeastOnce());

        detailsDialogMock
            .setup(dialog => dialog.setState(It.isValue({ canInspect: false })))
            .verifiable(Times.once());
        detailsDialogMock
            .setup(dialog =>
                dialog.setState(It.isValue({ userConfigurationStoreData: userConfigStoreData })),
            )
            .verifiable(Times.once());

        testSubject.componentDidMount(detailsDialogMock.object);

        devToolStoreMock.verifyAll();
        userConfigStoreMock.verifyAll();
        detailsDialogMock.verifyAll();
    });

    test('componentDidMount does not add listener if store not present', () => {
        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {} as any;
            })
            .verifiable(Times.atLeastOnce());

        testSubject.componentDidMount(detailsDialogMock.object);

        detailsDialogMock.verifyAll();
    });

    test('componentWillUnmount removes listener', () => {
        const devToolStoreMock = Mock.ofType<BaseStore<DevToolStoreData>>(
            undefined,
            MockBehavior.Strict,
        );
        const userConfigStoreMock = Mock.ofType<BaseStore<UserConfigurationStoreData>>(
            undefined,
            MockBehavior.Strict,
        );

        devToolStoreMock
            .setup(store => store.removeChangedListener(It.isAny()))
            .verifiable(Times.once());
        userConfigStoreMock
            .setup(store => store.removeChangedListener(It.isAny()))
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    devToolStore: devToolStoreMock.object,
                    userConfigStore: userConfigStoreMock.object,
                } as any;
            })
            .verifiable(Times.atLeastOnce());

        testSubject.componentWillUnmount(detailsDialogMock.object);

        devToolStoreMock.verifyAll();
        userConfigStoreMock.verifyAll();
        detailsDialogMock.verifyAll();
    });

    describe('hasStore', () => {
        it.each([
            [undefined, false],
            [{}, false],
            [{ devToolStore: {} }, true],
        ])('', (props, expected: boolean) => testHasStoreGivenPropsReturns(props, expected));
    });

    function testIsInspectButtonDisabledShouldReflectCanInspect(canInspect: boolean): void {
        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    canInspect: canInspect,
                } as any;
            })
            .verifiable(Times.once());

        const result = testSubject.isInspectButtonDisabled(detailsDialogMock.object);

        detailsDialogMock.verifyAll();
        expect(result).toEqual(!canInspect);
    }

    function testOnDevToolChangeSetsCanInspectToIsOpen(isOpen: boolean): void {
        const devToolStoreMock = Mock.ofType<BaseStore<DevToolStoreData>>(
            undefined,
            MockBehavior.Strict,
        );

        devToolStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    isOpen: isOpen,
                } as any;
            })
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    devToolStore: devToolStoreMock.object,
                } as any;
            })
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.setState(It.isValue({ canInspect: isOpen })))
            .verifiable(Times.once());

        testSubject.onDevToolChanged(detailsDialogMock.object);

        devToolStoreMock.verifyAll();
        detailsDialogMock.verifyAll();
    }

    function testOnUserConfigChangedUpdateState(itp: string): void {
        const userConfigStoreMock = Mock.ofType<BaseStore<UserConfigurationStoreData>>(
            undefined,
            MockBehavior.Strict,
        );
        const storeData: UserConfigurationStoreData = {
            bugServicePropertiesMap: {
                gitHub: {
                    repository: itp,
                },
            },
        } as any;
        userConfigStoreMock
            .setup(store => store.getState())
            .returns(() => storeData)
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    userConfigStore: userConfigStoreMock.object,
                } as any;
            })
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.setState(It.isValue({ userConfigurationStoreData: storeData })))
            .verifiable(Times.once());

        testSubject.onUserConfigChanged(detailsDialogMock.object);

        userConfigStoreMock.verifyAll();
        detailsDialogMock.verifyAll();
    }

    function testCanInspectEqualsIsOpen(isOpen: boolean): void {
        const devToolStoreMock = Mock.ofType<BaseStore<DevToolStoreData>>(
            undefined,
            MockBehavior.Strict,
        );

        devToolStoreMock
            .setup(store => store.getState())
            .returns(() => {
                return {
                    isOpen: isOpen,
                } as any;
            })
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    devToolStore: devToolStoreMock.object,
                } as any;
            })
            .verifiable(Times.once());

        const result = testSubject.canInspect(detailsDialogMock.object);

        expect(result).toEqual(isOpen);
        devToolStoreMock.verifyAll();
        detailsDialogMock.verifyAll();
    }

    function testHasStoreGivenPropsReturns(props, expected: boolean): void {
        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return props;
            })
            .verifiable(Times.atLeastOnce());

        const result = (testSubject as any).hasStore(detailsDialogMock.object);

        detailsDialogMock.verifyAll();
        expect(result).toEqual(expected);
    }

    function createParentLayerForDialog(): HTMLDivElement {
        const parentLayer = document.createElement('div');
        parentLayer.className = 'ms-Layer--fixed';
        return parentLayer;
    }
});
