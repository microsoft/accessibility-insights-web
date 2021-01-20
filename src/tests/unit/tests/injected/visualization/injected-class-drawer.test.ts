// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { getDefaultFeatureFlagsWeb } from '../../../../../common/feature-flags';
import { HtmlElementAxeResults } from '../../../../../injected/scanner-utils';
import { DrawerInitData } from '../../../../../injected/visualization/drawer';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import { InjectedClassDrawerConfiguration } from '../../../../../injected/visualization/formatter';
import { InjectedClassDrawer } from '../../../../../injected/visualization/injected-class-drawer';
import { InjectedClassFormatter } from '../../../../../injected/visualization/injected-class-formatter';
import { TestDocumentCreator } from '../../../common/test-document-creator';
import { TargetType } from '../../../../../common/types/target-type';

describe('InjectedClassDrawer Tests', () => {
    let drawerUtilsMock: IMock<DrawerUtils>;
    let formatterMock: IMock<InjectedClassFormatter>;

    beforeEach(() => {
        drawerUtilsMock = Mock.ofType(DrawerUtils);
        formatterMock = Mock.ofType(InjectedClassFormatter);
    });

    test('initializer', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                    <body id='id1'></body>
                `);

        setupDrawerUtilsMockDefault(dom);
        setupFormatterMock();
        const testSubject = new InjectedClassDrawer(drawerUtilsMock.object, formatterMock.object);

        const drawerInfo: DrawerInitData<HtmlElementAxeResults> = {
            data: [
                {
                    target: ['body'],
                },
            ] as HtmlElementAxeResults[],
            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
        };

        testSubject.initialize(drawerInfo);

        drawerUtilsMock.verifyAll();
    });

    test('drawLayout', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                    <body id='id1'></body>
                `);

        setupDrawerUtilsMockDefault(dom);
        setupFormatterMock();

        const testSubject = new InjectedClassDrawer(drawerUtilsMock.object, formatterMock.object);

        const drawerInfo: DrawerInitData<HtmlElementAxeResults> = {
            data: [
                {
                    target: ['body'],
                },
            ] as HtmlElementAxeResults[],
            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
        };

        testSubject.initialize(drawerInfo);

        expect(testSubject.isOverlayEnabled).toBe(false);

        testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toBe(true);

        drawerUtilsMock.verifyAll();
        formatterMock.verifyAll();
    });

    test('initialize empty instances when visualization already enabled', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                    <body id='id1'></body>
                `);

        setupDrawerUtilsMockDefault(dom);
        setupFormatterMock();

        const testSubject = new InjectedClassDrawer(drawerUtilsMock.object, formatterMock.object);

        const drawerInfo: DrawerInitData<HtmlElementAxeResults> = {
            data: [
                {
                    target: ['body'],
                },
            ] as HtmlElementAxeResults[],
            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
        };

        testSubject.initialize(drawerInfo);
        expect(testSubject.isOverlayEnabled).toBe(false);

        testSubject.drawLayout();
        testSubject.initialize({ data: [], featureFlagStoreData: getDefaultFeatureFlagsWeb() });

        expect(testSubject.isOverlayEnabled).toBe(false);

        drawerUtilsMock.verifyAll();
        formatterMock.verifyAll();
    });

    test('removeLayout', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                    <body id='id1'></body>
                `);

        setupDrawerUtilsMockDefault(dom);
        setupFormatterMock();

        const testSubject = new InjectedClassDrawer(drawerUtilsMock.object, formatterMock.object);

        const drawerInfo: DrawerInitData<HtmlElementAxeResults> = {
            data: [
                {
                    target: ['body'],
                },
            ] as HtmlElementAxeResults[],
            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
        };

        testSubject.initialize(drawerInfo);

        expect(testSubject.isOverlayEnabled).toBe(false);

        testSubject.drawLayout();
        testSubject.eraseLayout();

        expect(testSubject.isOverlayEnabled).toBe(false);

        drawerUtilsMock.verifyAll();
        formatterMock.verifyAll();
    });

    function setupDrawerUtilsMockDefault(dom: Document): void {
        drawerUtilsMock
            .setup(d => d.getDocumentElement())
            .returns(() => dom)
            .verifiable(Times.atLeastOnce());
    }

    function setupFormatterMock(): void {
        formatterMock
            .setup(f => f.getDrawerConfiguration())
            .returns(() => {
                return {
                    injectedClassName: 'test-injected-classname',
                    targetType: TargetType.Single,
                } as InjectedClassDrawerConfiguration;
            })
            .verifiable(Times.atLeastOnce());
    }
});
