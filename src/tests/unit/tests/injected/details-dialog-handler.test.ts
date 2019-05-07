// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { DevToolStore } from '../../../../background/stores/dev-tools-store';
import { UserConfigurationStore } from '../../../../background/stores/global/user-configuration-store';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { DevToolActionMessageCreator } from '../../../../common/message-creators/dev-tool-action-message-creator';
import { DetailsDialog } from '../../../../injected/components/details-dialog';
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
    let body: Element;
    let featureFlagStoreData: DictionaryStringTo<boolean>;

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
    });

    test('backButtonClickHandler', () => {
        const detailsDialogMock: IMock<DetailsDialog> = Mock.ofType(DetailsDialog);

        detailsDialogMock
            .setup(it => it.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 1,
                } as any;
            });

        detailsDialogMock
            .setup(it =>
                it.setState(
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
        const detailsDialogMock: IMock<DetailsDialog> = Mock.ofType(DetailsDialog);

        detailsDialogMock
            .setup(it => it.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 0,
                } as any;
            });

        detailsDialogMock
            .setup(it =>
                it.setState(
                    It.isValue({
                        currentRuleIndex: 1,
                    }),
                ),
            )
            .verifiable();

        testSubject.nextButtonClickHandler(detailsDialogMock.object);

        detailsDialogMock.verifyAll();
    });

    test('inspectButtonClickHandler', () => {
        const detailsDialogMock = Mock.ofType(DetailsDialog, MockBehavior.Strict);
        const devToolActionMessageCreatorMock = Mock.ofType(DevToolActionMessageCreator, MockBehavior.Strict);
        const eventFactory = new EventStubFactory();
        const event = eventFactory.createMouseClickEvent();
        const target = ['frame', 'div'];

        devToolActionMessageCreatorMock
            .setup(it => it.setInspectElement(It.isValue(event as any), It.isValue(target)))
            .verifiable(Times.once());

        detailsDialogMock
            .setup(it => it.props)
            .returns(() => {
                return {
                    target: target,
                    devToolActionMessageCreator: devToolActionMessageCreatorMock.object,
                } as any;
            })
            .verifiable(Times.atLeastOnce());

        detailsDialogMock.setup(it => it.setState(It.isValue({ showDialog: false }))).verifiable(Times.once());

        testSubject.inspectButtonClickHandler(detailsDialogMock.object, event as any);

        detailsDialogMock.verifyAll();
        devToolActionMessageCreatorMock.verifyAll();
    });

    test('showDialog', () => {
        const detailsDialogMock: IMock<DetailsDialog> = Mock.ofType(DetailsDialog);

        detailsDialogMock
            .setup(it =>
                it.setState(
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
        const detailsDialogMock: IMock<DetailsDialog> = Mock.ofType(DetailsDialog);

        detailsDialogMock
            .setup(it =>
                it.setState(
                    It.isValue({
                        showDialog: false,
                    }),
                ),
            )
            .verifiable();

        testSubject.hideDialog(detailsDialogMock.object);

        detailsDialogMock.verifyAll();
    });

    test('NextButtonNotDisabled', () => {
        const detailsDialogMock: IMock<DetailsDialog> = Mock.ofType(DetailsDialog);

        detailsDialogMock
            .setup(it => it.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 1,
                } as any;
            });

        detailsDialogMock
            .setup(it => it.props)
            .returns(() => {
                return {
                    failedRules: [1, 2, 3, 4],
                } as any;
            });

        detailsDialogMock
            .setup(it =>
                it.setState(
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
        const detailsDialogMock: IMock<DetailsDialog> = Mock.ofType(DetailsDialog);

        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 3,
                } as any;
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
        const detailsDialogMock: IMock<DetailsDialog> = Mock.ofType(DetailsDialog);

        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 0,
                } as any;
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
        const detailsDialogMock: IMock<DetailsDialog> = Mock.ofType(DetailsDialog);

        detailsDialogMock
            .setup(dialog => dialog.state)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 1,
                } as any;
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

    test('isInspectButtonDisabled', () => {
        testIsInspectButtonDisabledShouldReflectCanInspect(true);
        testIsInspectButtonDisabledShouldReflectCanInspect(false);
    });

    test('onDevToolChanged', () => {
        testOnDevToolChangeSetsCanInspectToIsOpen(true);
        testOnDevToolChangeSetsCanInspectToIsOpen(false);
    });

    test('onUserConfigChanged', () => {
        testOnUserConfigChangedUpdateState('example');
        testOnUserConfigChangedUpdateState('other example');
    });

    test('canInspect', () => {
        testCanInspectEqualsIsOpen(true);
        testCanInspectEqualsIsOpen(false);
    });

    test('getFailureInfo', () => {
        const detailsDialogMock: IMock<DetailsDialog> = Mock.ofType(DetailsDialog);

        detailsDialogMock
            .setup(dialog => dialog.props)
            .returns(() => {
                return {
                    showDialog: true,
                    currentRuleIndex: 0,
                    failedRules: [1, 2, 3, 4],
                } as any;
            });
        expect(testSubject.getFailureInfo(detailsDialogMock.object)).toEqual('Failure 1 of 4 for this target');
    });

    test('onLayoutDidMount_ableToFindDialog', () => {
        const parentLayer = createParentLayerForDialog();
        const intermdediateElement = document.createElement('div');
        const dialogContainer = document.createElement('div');

        intermdediateElement.appendChild(dialogContainer);
        parentLayer.appendChild(intermdediateElement);

        htmlElementUtilsMock
            .setup(x => x.querySelector('.insights-dialog-main-override'))
            .returns(() => dialogContainer)
            .verifiable();

        testSubject.onLayoutDidMount();

        expect(parentLayer.style.zIndex).toEqual('2147483647');
        htmlElementUtilsMock.verifyAll();
    });

    test('onLayoutDidMount_unableToFindDialog', () => {
        htmlElementUtilsMock
            .setup(x => x.querySelector('.insights-dialog-main-override'))
            .returns(() => null)
            .verifiable();

        testSubject.onLayoutDidMount();

        htmlElementUtilsMock.verifyAll();
    });

    test('onLayoutDidMount_unableToFindLayer', () => {
        const dialogContainer = document.createElement('div');
        htmlElementUtilsMock
            .setup(x => x.querySelector('.insights-dialog-main-override'))
            .returns(() => dialogContainer)
            .verifiable();

        testSubject.onLayoutDidMount();

        htmlElementUtilsMock.verifyAll();
    });

    test('componentDidMount adds listener if clickable objects are available', () => {
        const detailsDialogMock = Mock.ofType(DetailsDialog, MockBehavior.Strict);
        const devToolStoreMock = Mock.ofType(DevToolStore, MockBehavior.Strict);
        const userConfigStoreMock = Mock.ofType(UserConfigurationStore, MockBehavior.Strict);
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
            .setup(cM => cM.addEventListener('click', It.is(param => typeof param === 'function')))
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

        devToolStoreMock.setup(store => store.addChangedListener(It.isAny())).verifiable(Times.once());
        userConfigStoreMock.setup(store => store.addChangedListener(It.isAny())).verifiable(Times.once());

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
            .setup(x => x.querySelector('body'))
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

        detailsDialogMock.setup(dialog => dialog.setState(It.isValue({ canInspect: false }))).verifiable(Times.once());
        detailsDialogMock
            .setup(dialog => dialog.setState(It.isValue({ userConfigurationStoreData: userConfigStoreData })))
            .verifiable(Times.once());

        setupDetailsDialogMockForShadowComponents(detailsDialogMock);

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
        const detailsDialogMock = Mock.ofType(DetailsDialog, MockBehavior.Strict);

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
        const detailsDialogMock = Mock.ofType(DetailsDialog, MockBehavior.Strict);
        const devToolStoreMock = Mock.ofType(DevToolStore, MockBehavior.Strict);
        const userConfigStoreMock = Mock.ofType(UserConfigurationStore, MockBehavior.Strict);

        devToolStoreMock.setup(store => store.removeChangedListener(It.isAny())).verifiable(Times.once());
        userConfigStoreMock.setup(store => store.removeChangedListener(It.isAny())).verifiable(Times.once());

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

    test('hasStore', () => {
        testHasStoreGivenPropsReturns(undefined, false);
        testHasStoreGivenPropsReturns({}, false);
        testHasStoreGivenPropsReturns({ devToolStore: {} }, true);
    });

    test('closeWindow will remove listener', () => {
        const shadowRootMock: IMock<Element> = Mock.ofInstance({
            querySelector: selector => {
                return null;
            },
        } as any);

        shadowRootMock
            .setup(x => x.querySelector('#insights-shadow-container'))
            .returns(selector => {
                return container;
            })
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(x => x.querySelector('body'))
            .returns(() => body)
            .verifiable(Times.once());

        (testSubject as any).closeWindow(shadowRootMock.object);

        expect(body.classList.length).toEqual(0);
        expect(container.querySelector('.insights-shadow-dialog-container')).toBeNull();
        shadowRootMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
    });

    function setupInspectButtonQuerySelector(shadowRootMock: IMock<Element>, clickableMock: IMock<any>): void {
        shadowRootMock
            .setup(x => x.querySelector('.insights-dialog-button-inspect'))
            .returns(selector => {
                return clickableMock.object;
            })
            .verifiable(Times.once());
    }

    function setupDialogContainerQuerySelector(shadowRootMock: IMock<Element>, clickableMock: IMock<any>): void {
        shadowRootMock
            .setup(x => x.querySelector('.insights-dialog-main-override-shadow'))
            .returns(selector => {
                return clickableMock.object;
            })
            .verifiable(Times.once());
    }

    function setupCloseButtonQuerySelector(shadowRootMock: IMock<Element>, clickableMock: IMock<any>): void {
        shadowRootMock
            .setup(x => x.querySelector('.insights-dialog-close'))
            .returns(selector => {
                return clickableMock.object;
            })
            .verifiable(Times.once());
    }

    function setupNextButtonQuerySelector(shadowRootMock: IMock<Element>, clickableMock: IMock<any>): void {
        shadowRootMock
            .setup(x => x.querySelector('.insights-dialog-button-right'))
            .returns(selector => {
                return clickableMock.object;
            })
            .verifiable(Times.once());
    }

    function setupBackButtonQuerySelector(shadowRootMock: IMock<Element>, clickableMock: IMock<any>): void {
        shadowRootMock
            .setup(x => x.querySelector('.insights-dialog-button-left'))
            .returns(selector => {
                return clickableMock.object;
            })
            .verifiable(Times.once());
    }

    function testIsInspectButtonDisabledShouldReflectCanInspect(canInspect: boolean): void {
        const detailsDialogMock = Mock.ofType(DetailsDialog, MockBehavior.Strict);

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
        const detailsDialogMock = Mock.ofType(DetailsDialog, MockBehavior.Strict);
        const devToolStoreMock = Mock.ofType(DevToolStore, MockBehavior.Strict);

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

        detailsDialogMock.setup(dialog => dialog.setState(It.isValue({ canInspect: isOpen }))).verifiable(Times.once());

        testSubject.onDevToolChanged(detailsDialogMock.object);

        devToolStoreMock.verifyAll();
        detailsDialogMock.verifyAll();
    }

    function testOnUserConfigChangedUpdateState(itp: string): void {
        const detailsDialogMock = Mock.ofType(DetailsDialog, MockBehavior.Strict);
        const userConfigStoreMock = Mock.ofType(UserConfigurationStore, MockBehavior.Strict);
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

        detailsDialogMock.setup(dialog => dialog.setState(It.isValue({ userConfigurationStoreData: storeData }))).verifiable(Times.once());

        testSubject.onUserConfigChanged(detailsDialogMock.object);

        userConfigStoreMock.verifyAll();
        detailsDialogMock.verifyAll();
    }

    function testCanInspectEqualsIsOpen(isOpen: boolean): void {
        const detailsDialogMock = Mock.ofType(DetailsDialog, MockBehavior.Strict);
        const devToolStoreMock = Mock.ofType(DevToolStore, MockBehavior.Strict);

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
        const detailsDialogMock = Mock.ofType(DetailsDialog, MockBehavior.Strict);

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

    function setupDetailsDialogMockForShadowComponents(detailsDialogMock: IMock<DetailsDialog>): void {
        setupVerificationForBackButton(detailsDialogMock);
        setupVerificationForNextButton(detailsDialogMock);
        setupVerificationForInspectButton(detailsDialogMock);
    }

    function setupVerificationForBackButton(detailsDialogMock: IMock<DetailsDialog>): void {
        detailsDialogMock
            .setup(dialog => dialog.isBackButtonDisabled())
            .returns(() => false)
            .verifiable(Times.once());

        detailsDialogMock.setup(dialog => dialog.onClickBackButton()).verifiable(Times.once());
    }

    function setupVerificationForNextButton(detailsDialogMock: IMock<DetailsDialog>): void {
        detailsDialogMock
            .setup(dialog => dialog.isNextButtonDisabled())
            .returns(() => false)
            .verifiable(Times.once());

        detailsDialogMock.setup(dialog => dialog.onClickNextButton()).verifiable(Times.once());
    }

    function setupVerificationForInspectButton(detailsDialogMock: IMock<DetailsDialog>): void {
        detailsDialogMock
            .setup(dialog => dialog.isInspectButtonDisabled())
            .returns(() => false)
            .verifiable(Times.once());

        detailsDialogMock.setup(dialog => dialog.onClickInspectButton(It.isAny())).verifiable(Times.once());
    }
});
