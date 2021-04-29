// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { getDefaultFeatureFlagsWeb } from '../../../../../common/feature-flags';
import { HtmlElementAxeResults } from '../../../../../injected/scanner-utils';
import { DrawerInitData } from '../../../../../injected/visualization/drawer';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import { SingleTargetDrawerConfiguration } from '../../../../../injected/visualization/formatter';
import { SingleTargetDrawer } from '../../../../../injected/visualization/single-target-drawer';
import { SingleTargetFormatter } from '../../../../../injected/visualization/single-target-formatter';
import { TestDocumentCreator } from '../../../common/test-document-creator';

describe('SingleTargetDrawer Tests', () => {
    let drawerUtilsMock: IMock<DrawerUtils>;
    let formatterMock: IMock<SingleTargetFormatter>;

    beforeEach(() => {
        drawerUtilsMock = Mock.ofType(DrawerUtils);
        formatterMock = Mock.ofType(SingleTargetFormatter);
    });

    test('initializer', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                    <body id='id1'></body>
                `);

        setupDrawerUtilsMockDefault(dom);

        const testSubject = new SingleTargetDrawer(drawerUtilsMock.object, formatterMock.object);

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

    test('drawLayout', async () => {
        const dom = TestDocumentCreator.createTestDocument(`
                    <body id='id1'></body>
                `);

        setupDrawerUtilsMockDefault(dom);
        setupFormatterMock();

        const testSubject = new SingleTargetDrawer(drawerUtilsMock.object, formatterMock.object);

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

        await testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toBe(true);

        drawerUtilsMock.verifyAll();
        formatterMock.verifyAll();
    });

    test('initialize empty instances when visualization already enabled', async () => {
        const dom = TestDocumentCreator.createTestDocument(`
                    <body id='id1'></body>
                `);

        setupDrawerUtilsMockDefault(dom);
        setupFormatterMock();

        const testSubject = new SingleTargetDrawer(drawerUtilsMock.object, formatterMock.object);

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

        await testSubject.drawLayout();
        testSubject.initialize({ data: [], featureFlagStoreData: getDefaultFeatureFlagsWeb() });

        expect(testSubject.isOverlayEnabled).toBe(false);

        drawerUtilsMock.verifyAll();
        formatterMock.verifyAll();
    });

    test('removeLayout', async () => {
        const dom = TestDocumentCreator.createTestDocument(`
                    <body id='id1'></body>
                `);

        setupDrawerUtilsMockDefault(dom);
        setupFormatterMock();

        const testSubject = new SingleTargetDrawer(drawerUtilsMock.object, formatterMock.object);

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

        await testSubject.drawLayout();
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
                } as SingleTargetDrawerConfiguration;
            })
            .verifiable(Times.atLeastOnce());
    }
});
