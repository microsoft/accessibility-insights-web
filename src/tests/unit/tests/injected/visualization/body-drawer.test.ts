// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { getDefaultFeatureFlagValues } from '../../../../../common/feature-flags';
import { IHtmlElementAxeResults } from '../../../../../injected/scanner-utils';
import { BodyDrawer } from '../../../../../injected/visualization/body-drawer';
import { BodyFormatter } from '../../../../../injected/visualization/body-formatter';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import { IDrawerInitData } from '../../../../../injected/visualization/idrawer';
import { IBodyDrawerConfiguration } from '../../../../../injected/visualization/iformatter';
import { TestDocumentCreator } from '../../../common/test-document-creator';

describe('BodyDrawerTests', () => {
    let drawerUtilsMock: IMock<DrawerUtils>;
    let formatterMock: IMock<BodyFormatter>;

    beforeEach(() => {
        drawerUtilsMock = Mock.ofType(DrawerUtils);
        formatterMock = Mock.ofType(BodyFormatter);
    });

    test('initializer', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                    <body id='id1'></body>
                `);

        setupDrawerUtilsMockDefault(dom);

        const testSubject = new BodyDrawer(drawerUtilsMock.object, formatterMock.object);

        const drawerInfo: IDrawerInitData<IHtmlElementAxeResults> = {
            data: [
                {
                    target: ['body'],
                },
            ] as IHtmlElementAxeResults[],
            featureFlagStoreData: getDefaultFeatureFlagValues(),
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

        const testSubject = new BodyDrawer(drawerUtilsMock.object, formatterMock.object);

        const drawerInfo: IDrawerInitData<IHtmlElementAxeResults> = {
            data: [
                {
                    target: ['body'],
                },
            ] as IHtmlElementAxeResults[],
            featureFlagStoreData: getDefaultFeatureFlagValues(),
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

        const testSubject = new BodyDrawer(drawerUtilsMock.object, formatterMock.object);

        const drawerInfo: IDrawerInitData<IHtmlElementAxeResults> = {
            data: [
                {
                    target: ['body'],
                },
            ] as IHtmlElementAxeResults[],
            featureFlagStoreData: getDefaultFeatureFlagValues(),
        };

        testSubject.initialize(drawerInfo);
        expect(testSubject.isOverlayEnabled).toBe(false);

        testSubject.drawLayout();
        testSubject.initialize({ data: [], featureFlagStoreData: getDefaultFeatureFlagValues() });

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

        const testSubject = new BodyDrawer(drawerUtilsMock.object, formatterMock.object);

        const drawerInfo: IDrawerInitData<IHtmlElementAxeResults> = {
            data: [
                {
                    target: ['body'],
                },
            ] as IHtmlElementAxeResults[],
            featureFlagStoreData: getDefaultFeatureFlagValues(),
        };

        testSubject.initialize(drawerInfo);

        expect(testSubject.isOverlayEnabled).toBe(false);

        testSubject.drawLayout();
        testSubject.eraseLayout();

        expect(testSubject.isOverlayEnabled).toBe(false);

        drawerUtilsMock.verifyAll();
        formatterMock.verifyAll();
    });

    function setupDrawerUtilsMockDefault(dom) {
        drawerUtilsMock
            .setup(d => d.getDocumentElement())
            .returns(() => {
                return dom.ownerDocument || (dom as Document);
            })
            .verifiable(Times.atLeastOnce());
    }

    function setupFormatterMock() {
        formatterMock
            .setup(f => f.getDrawerConfiguration())
            .returns(() => {
                return {
                    injectedClassName: 'insights-grey-scale-container',
                } as IBodyDrawerConfiguration;
            })
            .verifiable(Times.atLeastOnce());
    }
});
