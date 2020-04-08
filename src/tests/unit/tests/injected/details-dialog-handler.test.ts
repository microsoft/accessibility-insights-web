// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BaseStore } from '../../../../common/base-store';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { DevToolActionMessageCreator } from '../../../../common/message-creators/dev-tool-action-message-creator';
import { DevToolStoreData } from '../../../../common/types/store-data/dev-tool-store-data';
import { DetailsDialog, DetailsDialogState } from '../../../../injected/components/details-dialog';
import { DetailsDialogHandler } from '../../../../injected/details-dialog-handler';
import { DictionaryStringTo } from '../../../../types/common-types';
import { EventStubFactory } from '../../common/event-stub-factory';
import { UserConfigurationStoreData } from './../../../../common/types/store-data/user-configuration-store';

describe('DetailsDialogHandlerTest', () => {
    let testSubject: DetailsDialogHandler;
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let container: Element;
    let detailsDialog: Element;
    let containerParent: Element;
    let body: HTMLElement;
    let featureFlagStoreData: DictionaryStringTo<boolean>;
    let detailsDialogMock: IMock<DetailsDialog>;

    beforeEach(() => {
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        testSubject = new DetailsDialogHandler(htmlElementUtilsMock.object);
        container = document.createElement('div');
        detailsDialog = document.createElement('div');
        detailsDialog.classList.add('insights-shadow-dialog-container');
        container.appendChild(detailsDialog);
        containerParent = document.createElement('div');
        containerParent.appendChild(container);
        body = document.createElement('div');
        body.classList.add('insights-modal');
        featureFlagStoreData = {
            shadowDialog: true,
        };
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

    test('componentDidMount adds listener if clickable objects are available', () => {
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
        const clickableMock = Mock.ofInstance({
            addEventListener: (ev, cb) => {
                return null;
            },
        } as any);

        const evt = {
            target: clickableMock.object,
        } as any;

        clickableMock
            .setup(cM =>
                cM.addEventListener(
                    'click',
                    It.is(param => typeof param === 'function'),
                ),
            )
            .callback((ev, cb) => {
                cb(evt);
            })
            .verifiable(Times.atLeastOnce());

        const shadowRootMock: IMock<Element> = Mock.ofInstance({
            querySelector: selector => {
                return null;
            },
        } as any);

        const shadowRoot: Element = {
            shadowRoot: shadowRootMock.object,
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

        shadowRootMock
            .setup(x => x.querySelector('#insights-shadow-container'))
            .returns(selector => {
                return container;
            })
            .verifiable(Times.atLeastOnce());

        htmlElementUtilsMock
            .setup(x => x.querySelector('#insights-shadow-host'))
            .returns(() => shadowRoot)
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(x => x.getBody())
            .returns(() => body)
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    devToolStore: devToolStoreMock.object,
                    userConfigStore: userConfigStoreMock.object,
                    enableIssueFiling: true,
                    featureFlagStoreData: featureFlagStoreData,
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

        setupDetailsDialogMockForShadowComponents();

        setupDialogContainerQuerySelector(shadowRootMock, clickableMock);
        setupCloseButtonQuerySelector(shadowRootMock, clickableMock);
        setupNextButtonQuerySelector(shadowRootMock, clickableMock);
        setupBackButtonQuerySelector(shadowRootMock, clickableMock);
        setupInspectButtonQuerySelector(shadowRootMock, clickableMock);

        testSubject.componentDidMount(detailsDialogMock.object);

        devToolStoreMock.verifyAll();
        userConfigStoreMock.verifyAll();
        detailsDialogMock.verifyAll();
        shadowRootMock.verifyAll();
        clickableMock.verifyAll();
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

    test('closeWindow will remove listener', () => {
        const shadowRootMock: IMock<Element> = Mock.ofInstance({
            querySelector: selector => {
                return null;
            },
        } as any);

        shadowRootMock
            .setup(root => root.querySelector('#insights-shadow-container'))
            .returns(selector => {
                return container;
            })
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(x => x.getBody())
            .returns(() => body)
            .verifiable(Times.once());

        (testSubject as any).closeWindow(shadowRootMock.object);

        expect(body.classList.length).toEqual(0);
        expect(container.querySelector('.insights-shadow-dialog-container')).toBeNull();
        shadowRootMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    function setupInspectButtonQuerySelector(
        shadowRootMock: IMock<Element>,
        clickableMock: IMock<any>,
    ): void {
        shadowRootMock
            .setup(x => x.querySelector('.insights-dialog-button-inspect'))
            .returns(selector => {
                return clickableMock.object;
            })
            .verifiable(Times.once());
    }

    function setupDialogContainerQuerySelector(
        shadowRootMock: IMock<Element>,
        clickableMock: IMock<any>,
    ): void {
        shadowRootMock
            .setup(x => x.querySelector('.insights-dialog-main-override-shadow'))
            .returns(selector => {
                return clickableMock.object;
            })
            .verifiable(Times.once());
    }

    function setupCloseButtonQuerySelector(
        shadowRootMock: IMock<Element>,
        clickableMock: IMock<any>,
    ): void {
        shadowRootMock
            .setup(x => x.querySelector('.insights-dialog-close'))
            .returns(selector => {
                return clickableMock.object;
            })
            .verifiable(Times.once());
    }

    function setupNextButtonQuerySelector(
        shadowRootMock: IMock<Element>,
        clickableMock: IMock<any>,
    ): void {
        shadowRootMock
            .setup(x => x.querySelector('.insights-dialog-button-right'))
            .returns(selector => {
                return clickableMock.object;
            })
            .verifiable(Times.once());
    }

    function setupBackButtonQuerySelector(
        shadowRootMock: IMock<Element>,
        clickableMock: IMock<any>,
    ): void {
        shadowRootMock
            .setup(x => x.querySelector('.insights-dialog-button-left'))
            .returns(selector => {
                return clickableMock.object;
            })
            .verifiable(Times.once());
    }

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

    function setupDetailsDialogMockForShadowComponents(): void {
        setupVerificationForBackButton();
        setupVerificationForNextButton();
        setupVerificationForInspectButton();
    }

    function setupVerificationForBackButton(): void {
        detailsDialogMock
            .setup(dialog => dialog.isBackButtonDisabled())
            .returns(() => false)
            .verifiable(Times.once());

        detailsDialogMock.setup(dialog => dialog.onClickBackButton()).verifiable(Times.once());
    }

    function setupVerificationForNextButton(): void {
        detailsDialogMock
            .setup(dialog => dialog.isNextButtonDisabled())
            .returns(() => false)
            .verifiable(Times.once());

        detailsDialogMock.setup(dialog => dialog.onClickNextButton()).verifiable(Times.once());
    }

    function setupVerificationForInspectButton(): void {
        detailsDialogMock
            .setup(dialog => dialog.isInspectButtonDisabled())
            .returns(() => false)
            .verifiable(Times.once());

        detailsDialogMock
            .setup(dialog => dialog.onClickInspectButton(It.isAny()))
            .verifiable(Times.once());
    }
});
