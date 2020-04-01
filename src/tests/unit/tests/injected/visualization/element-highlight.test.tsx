// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { ClientRectOffset, ClientUtils } from '../../../../../injected/client-utils';
import { RenderDialog } from '../../../../../injected/dialog-renderer';
import { HtmlElementAxeResults } from '../../../../../injected/scanner-utils';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import {
    ElementHighlight,
    ElementHighlightDeps,
    ElementHighlightProps,
} from '../../../../../injected/visualization/element-highlight';
import {
    BoxConfig,
    DrawerConfiguration,
    GetBoundingRect,
} from '../../../../../injected/visualization/formatter';

describe('ElementHighlight', () => {
    let deps: ElementHighlightDeps;
    let drawerConfiguration: DrawerConfiguration;
    let failureBoxConfigStub: BoxConfig;
    let textBoxConfigStub: BoxConfig;
    let props: ElementHighlightProps;
    let drawerUtilsMock: IMock<DrawerUtils>;
    let clientUtilsMock: IMock<ClientUtils>;
    let elementStub: Element;
    let elementResultStub: HtmlElementAxeResults;
    let bodyStyleStub: CSSStyleDeclaration;
    let docStyleStub: CSSStyleDeclaration;
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let dialogRenderMock: IMock<RenderDialog>;
    let getBoundingRect: IMock<GetBoundingRect>;
    let elementBoundingClientRectStub: ClientRect;
    let documentMock: IMock<Document>;
    let offsetStub: ClientRectOffset;

    beforeEach(() => {
        drawerUtilsMock = Mock.ofType(DrawerUtils);
        clientUtilsMock = Mock.ofType(ClientUtils);
        dialogRenderMock = Mock.ofType<RenderDialog>();
        getBoundingRect = Mock.ofType<GetBoundingRect>();
        documentMock = Mock.ofType<Document>();

        elementResultStub = {} as HtmlElementAxeResults;
        featureFlagStoreDataStub = {} as FeatureFlagStoreData;
        elementStub = {} as Element;
        elementBoundingClientRectStub = {
            bottom: 1,
            left: 2,
            height: 3,
            right: 4,
            top: 5,
            width: 6,
        };
        offsetStub = {
            left: 11,
            top: 22,
        };
        bodyStyleStub = {} as CSSStyleDeclaration;
        docStyleStub = {} as CSSStyleDeclaration;
        failureBoxConfigStub = {} as BoxConfig;
        textBoxConfigStub = {} as BoxConfig;

        drawerConfiguration = {
            showVisualization: true,
            borderColor: 'red',
            outlineStyle: 'solid',
            failureBoxConfig: failureBoxConfigStub,
            textBoxConfig: textBoxConfigStub,
            toolTip: 'some tool tip',
        };

        deps = {
            clientUtils: clientUtilsMock.object,
            drawerUtils: drawerUtilsMock.object,
        } as ElementHighlightDeps;

        props = {
            deps: deps,
            drawerConfig: drawerConfiguration,
            element: elementStub,
            elementResult: elementResultStub,
            bodyStyle: bodyStyleStub,
            docStyle: docStyleStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            dialogRender: dialogRenderMock.object,
            getBoundingRect: getBoundingRect.object,
        };
    });

    test('renders null when drawerConfig showVisualization is false', () => {
        drawerConfiguration.showVisualization = false;
        const testObject = shallow(<ElementHighlight {...props} />);
        expect(testObject.getElement()).toMatchSnapshot();
    });

    test('renders null when element is outside of document', () => {
        getBoundingRect
            .setup(mock => mock(elementStub))
            .returns(() => elementBoundingClientRectStub);
        drawerUtilsMock.setup(mock => mock.getDocumentElement()).returns(() => documentMock.object);
        drawerUtilsMock
            .setup(mock =>
                mock.isOutsideOfDocument(
                    elementBoundingClientRectStub,
                    documentMock.object,
                    bodyStyleStub,
                    docStyleStub,
                ),
            )
            .returns(() => true);
        const testObject = shallow(<ElementHighlight {...props} />);
        expect(testObject.getElement()).toMatchSnapshot();
    });

    test('renders elements appropriately', () => {
        const styleTopStub = 111;
        const styleLeftStub = 222;
        const minWidthStub = 333;
        const minHeightStub = 444;

        getBoundingRect
            .setup(mock => mock(elementStub))
            .returns(() => elementBoundingClientRectStub);
        drawerUtilsMock.setup(mock => mock.getDocumentElement()).returns(() => documentMock.object);

        drawerUtilsMock
            .setup(mock =>
                mock.isOutsideOfDocument(
                    elementBoundingClientRectStub,
                    documentMock.object,
                    bodyStyleStub,
                    docStyleStub,
                ),
            )
            .returns(() => false);

        clientUtilsMock.setup(mock => mock.getOffset(elementStub)).returns(() => offsetStub);
        drawerUtilsMock
            .setup(mock => mock.getContainerTopOffset(offsetStub))
            .returns(() => styleTopStub);
        drawerUtilsMock
            .setup(mock => mock.getContainerLeftOffset(offsetStub))
            .returns(() => styleLeftStub);

        drawerUtilsMock
            .setup(mock =>
                mock.getContainerWidth(
                    offsetStub,
                    documentMock.object,
                    elementBoundingClientRectStub.width,
                    bodyStyleStub,
                    docStyleStub,
                ),
            )
            .returns(() => minWidthStub);

        drawerUtilsMock
            .setup(mock =>
                mock.getContainerHeight(
                    offsetStub,
                    documentMock.object,
                    elementBoundingClientRectStub.height,
                    bodyStyleStub,
                    docStyleStub,
                ),
            )
            .returns(() => minHeightStub);

        dialogRenderMock
            .setup(mock => mock(elementResultStub, featureFlagStoreDataStub))
            .verifiable();

        const testObject = shallow(<ElementHighlight {...props} />);
        const failureHighlightBox = testObject.findWhere(
            node => node.prop('onClickHandler') != null,
        );
        failureHighlightBox.prop('onClickHandler')();

        expect(testObject.getElement()).toMatchSnapshot();
        dialogRenderMock.verifyAll();
    });
});
