// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { WindowUtils } from '../../../../../common/window-utils';
import { RenderDialog } from '../../../../../injected/dialog-renderer';
import { AxeResultsWithFrameLevel } from '../../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import { DrawerConfiguration, Formatter } from '../../../../../injected/visualization/formatter';
import {
    HighlightVisualization,
    HighlightVisualizationDeps,
    HighlightVisualizationProps,
} from '../../../../../injected/visualization/highlight-visualization';
import { NodeListBuilder } from '../../../common/node-list-builder';

describe('HighlightVisualization', () => {
    let drawerUtilsMock: IMock<DrawerUtils>;
    let windowUtilsMock: IMock<WindowUtils>;
    let formatterMock: IMock<Formatter>;
    let documentMock: IMock<Document>;
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let renderDialogStub: RenderDialog;
    let deps: HighlightVisualizationDeps;
    let props: HighlightVisualizationProps;
    let elementResults: AxeResultsWithFrameLevel[];
    let bodyStub: HTMLBodyElement;
    let bodyStyleStub: CSSStyleDeclaration;
    let docStyleStub: CSSStyleDeclaration;
    let documentElementStub: HTMLElement;

    beforeEach(() => {
        drawerUtilsMock = Mock.ofType(DrawerUtils);
        windowUtilsMock = Mock.ofType(WindowUtils);
        formatterMock = Mock.ofType<Formatter>();
        documentMock = Mock.ofType<Document>();
        featureFlagStoreDataStub = {};
        renderDialogStub = () => {};
        elementResults = [];
        bodyStyleStub = {
            height: '1',
        } as CSSStyleDeclaration;
        docStyleStub = {
            width: '1',
        } as CSSStyleDeclaration;
        documentElementStub = {} as HTMLElement;
        bodyStub = {} as HTMLBodyElement;

        drawerUtilsMock.setup(mock => mock.getDocumentElement()).returns(() => documentMock.object);
        documentMock.setup(mock => mock.querySelector('body')).returns(() => bodyStub);
        windowUtilsMock.setup(mock => mock.getComputedStyle(bodyStub)).returns(() => bodyStyleStub);
        documentMock.setup(mock => mock.documentElement).returns(() => documentElementStub);
        windowUtilsMock.setup(mock => mock.getComputedStyle(documentElementStub)).returns(() => docStyleStub);

        deps = {
            drawerUtils: drawerUtilsMock.object,
            windowUtils: windowUtilsMock.object,
        } as HighlightVisualizationDeps;

        props = {
            deps,
            formatter: formatterMock.object,
            featureFlagStoreData: featureFlagStoreDataStub,
            renderDialog: renderDialogStub,
            elementResults,
        };
    });

    test('it should return an empty fragment', () => {
        elementResults = [];
        props.elementResults = elementResults;

        const testSubject = shallow(<HighlightVisualization {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('it should return highlight visualizations with default configuration', () => {
        const elementResultStubOne = getElementResultStub();
        const elementResultStubTwo = getElementResultStub();
        const elementStub = {} as Element;
        const elementStubList = NodeListBuilder.createNodeList([elementStub]);
        elementResults = [elementResultStubOne, elementResultStubTwo];
        props.elementResults = elementResults;
        props.formatter = null;

        elementResults.forEach(elementResultStub => {
            documentMock
                .setup(mock => mock.querySelectorAll(elementResultStub.target[elementResultStub.targetIndex]))
                .returns(() => elementStubList);
        });

        const testSubject = shallow(<HighlightVisualization {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('it should return highlight visualizations with formatter configuration', () => {
        const elementResultStubOne = getElementResultStub();
        const elementResultStubTwo = getElementResultStub();
        const elementStub = {} as Element;
        const elementStubList = NodeListBuilder.createNodeList([elementStub]);
        const drawerConfigStub: DrawerConfiguration = {
            getBoundingRect: someElement => null,
        } as DrawerConfiguration;
        elementResults = [elementResultStubOne, elementResultStubTwo];
        props.elementResults = elementResults;

        elementResults.forEach(elementResultStub => {
            documentMock
                .setup(mock => mock.querySelectorAll(elementResultStub.target[elementResultStub.targetIndex]))
                .returns(() => elementStubList);

            formatterMock.setup(mock => mock.getDrawerConfiguration(elementStub, elementResultStub)).returns(() => drawerConfigStub);
        });

        const testSubject = shallow(<HighlightVisualization {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    function getElementResultStub(): AxeResultsWithFrameLevel {
        return {
            target: ['some target'],
            targetIndex: 0,
        } as AxeResultsWithFrameLevel;
    }
});
