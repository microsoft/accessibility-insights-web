// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { IMock, Mock, Times } from 'typemoq';

import { getDefaultFeatureFlagsWeb } from '../../../../../common/feature-flags';
import { DrawerInitData } from '../../../../../injected/visualization/drawer';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import { SingleTargetDrawerConfiguration } from '../../../../../injected/visualization/formatter';
import { SingleTargetFormatter } from '../../../../../injected/visualization/single-target-formatter';
import { TextSpacingDrawer } from '../../../../../injected/visualization/text-spacing-drawer';
import { TestDocumentCreator } from '../../../common/test-document-creator';

describe('TextSpacingDrawer', () => {
    const className = 'insights-formatted-text-spacing-container';
    let drawerUtilsMock: IMock<DrawerUtils>;
    let formatterMock: IMock<SingleTargetFormatter>;

    beforeEach(() => {
        drawerUtilsMock = Mock.ofType(DrawerUtils);
        formatterMock = Mock.ofType(SingleTargetFormatter);
    });

    function createTestSubject(
        dom: Document,
        data: AssessmentVisualizationInstance[],
    ): TextSpacingDrawer {
        drawerUtilsMock
            .setup(d => d.getDocumentElement())
            .returns(() => dom)
            .verifiable(Times.atLeastOnce());
        formatterMock
            .setup(f => f.getDrawerConfiguration())
            .returns(() => ({ injectedClassName: className }) as SingleTargetDrawerConfiguration);

        const testSubject = new TextSpacingDrawer(drawerUtilsMock.object, formatterMock.object);
        testSubject.initialize({
            data,
            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
        } as DrawerInitData);
        return testSubject;
    }

    const bodyTarget = [{ target: ['body'] } as AssessmentVisualizationInstance];

    async function flushMutations(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    test('drawLayout adds the injected class to the target', async () => {
        const dom = TestDocumentCreator.createTestDocument(`<body><p id="p">hi</p></body>`);
        const testSubject = createTestSubject(dom, bodyTarget);

        expect(testSubject.isOverlayEnabled).toBe(false);
        await testSubject.drawLayout();

        expect(dom.body.classList.contains(className)).toBe(true);
        expect(testSubject.isOverlayEnabled).toBe(true);
    });

    test('drawLayout forces all three properties inline with important priority', async () => {
        const dom = TestDocumentCreator.createTestDocument(`<body><p id="p">hi there</p></body>`);
        const testSubject = createTestSubject(dom, bodyTarget);

        await testSubject.drawLayout();

        const p = dom.getElementById('p')!;
        expect(p.style.getPropertyValue('line-height')).toBe('1.5');
        expect(p.style.getPropertyValue('letter-spacing')).toBe('0.12em');
        expect(p.style.getPropertyValue('word-spacing')).toBe('0.16em');
        expect(p.style.getPropertyPriority('letter-spacing')).toBe('important');
        expect(p.style.getPropertyPriority('word-spacing')).toBe('important');
        expect(p.style.getPropertyPriority('line-height')).toBe('important');
    });

    test('drawLayout overrides a pre-existing inline !important declaration', async () => {
        const dom = TestDocumentCreator.createTestDocument(
            `<body><span id="s" style="letter-spacing: 0.01em !important">x y</span></body>`,
        );
        const testSubject = createTestSubject(dom, bodyTarget);

        await testSubject.drawLayout();

        const span = dom.getElementById('s')!;
        expect(span.style.getPropertyValue('letter-spacing')).toBe('0.12em');
        expect(span.style.getPropertyPriority('letter-spacing')).toBe('important');
    });

    test('eraseLayout restores original inline values and priorities exactly', async () => {
        const dom = TestDocumentCreator.createTestDocument(
            `<body>
                <p id="plain">plain</p>
                <span id="withInline" style="letter-spacing: 0.01em !important; color: red">x</span>
            </body>`,
        );
        const testSubject = createTestSubject(dom, bodyTarget);

        await testSubject.drawLayout();
        testSubject.eraseLayout();

        const plain = dom.getElementById('plain')!;
        // Properties we added where none existed are removed entirely.
        expect(plain.style.getPropertyValue('letter-spacing')).toBe('');
        expect(plain.style.getPropertyValue('word-spacing')).toBe('');
        expect(plain.style.getPropertyValue('line-height')).toBe('');

        const withInline = dom.getElementById('withInline')!;
        // Original value + priority restored verbatim; unrelated properties untouched.
        expect(withInline.style.getPropertyValue('letter-spacing')).toBe('0.01em');
        expect(withInline.style.getPropertyPriority('letter-spacing')).toBe('important');
        expect(withInline.style.getPropertyValue('word-spacing')).toBe('');
        expect(withInline.style.getPropertyValue('color')).toBe('red');

        expect(dom.body.classList.contains(className)).toBe(false);
        expect(testSubject.isOverlayEnabled).toBe(false);
    });

    test('does not force spacing on the tool own UI container subtree', async () => {
        const dom = TestDocumentCreator.createTestDocument(
            `<body>
                <div id="accessibility-insights-root-container"><p id="toolUi">ui</p></div>
                <p id="page">page</p>
            </body>`,
        );
        const testSubject = createTestSubject(dom, bodyTarget);

        await testSubject.drawLayout();

        expect(dom.getElementById('toolUi')!.style.getPropertyValue('letter-spacing')).toBe('');
        expect(dom.getElementById('page')!.style.getPropertyValue('letter-spacing')).toBe('0.12em');
    });

    test('re-applies spacing to nodes added after toggle-on', async () => {
        const dom = TestDocumentCreator.createTestDocument(`<body><p id="p">hi</p></body>`);
        const testSubject = createTestSubject(dom, bodyTarget);

        await testSubject.drawLayout();

        const added = dom.createElement('span');
        added.id = 'added';
        dom.body.appendChild(added);
        await flushMutations();

        expect(dom.getElementById('added')!.style.getPropertyValue('letter-spacing')).toBe(
            '0.12em',
        );
        expect(dom.getElementById('added')!.style.getPropertyPriority('letter-spacing')).toBe(
            'important',
        );
    });

    test('re-forces spacing when an element inline style is overwritten', async () => {
        const dom = TestDocumentCreator.createTestDocument(`<body><p id="p">hi</p></body>`);
        const testSubject = createTestSubject(dom, bodyTarget);

        await testSubject.drawLayout();

        // Simulate a framework re-render replacing the inline style (stripping ours).
        dom.getElementById('p')!.setAttribute('style', 'letter-spacing: 0.03em');
        await flushMutations();

        const p = dom.getElementById('p')!;
        expect(p.style.getPropertyValue('letter-spacing')).toBe('0.12em');
        expect(p.style.getPropertyPriority('letter-spacing')).toBe('important');
        expect(p.style.getPropertyValue('word-spacing')).toBe('0.16em');
        expect(p.style.getPropertyValue('line-height')).toBe('1.5');
    });

    test('stops observing after eraseLayout so later mutations are not re-spaced', async () => {
        const dom = TestDocumentCreator.createTestDocument(`<body><p id="p">hi</p></body>`);
        const testSubject = createTestSubject(dom, bodyTarget);

        await testSubject.drawLayout();
        testSubject.eraseLayout();

        const added = dom.createElement('span');
        added.id = 'added';
        dom.body.appendChild(added);
        await flushMutations();

        expect(dom.getElementById('added')!.style.getPropertyValue('letter-spacing')).toBe('');
    });

    test('handles a null target without throwing', async () => {
        const dom = TestDocumentCreator.createTestDocument(`<body></body>`);
        const testSubject = createTestSubject(dom, []);

        await testSubject.drawLayout();
        expect(testSubject.isOverlayEnabled).toBe(true);

        testSubject.eraseLayout();
        expect(testSubject.isOverlayEnabled).toBe(false);
    });
});
