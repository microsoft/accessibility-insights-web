// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BoundRectAccessor, ClientUtils } from './client-utils';
import { ErrorMessageContent } from './frameCommunicators/error-message-content';
import { FrameCommunicator } from './frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from './frameCommunicators/window-message-handler';
import { ScannerUtils } from './scanner-utils';

export interface ElementFinderByPositionMessage {
    x: number;
    y: number;
}

export class ElementFinderByPosition {
    public static readonly findElementByPositionCommand = 'insights.findElementByPositionCommand';
    private scannerUtils: ScannerUtils;
    private frameCommunicator: FrameCommunicator;
    private clientUtils: ClientUtils;
    private dom: Document;

    constructor(
        frameCommunicator: FrameCommunicator,
        clientUtils: ClientUtils,
        scannerUtils: ScannerUtils,
        dom: Document,
    ) {
        this.frameCommunicator = frameCommunicator;
        this.scannerUtils = scannerUtils;
        this.clientUtils = clientUtils;
        this.dom = dom;
    }

    public initialize(): void {
        this.frameCommunicator.subscribe(
            ElementFinderByPosition.findElementByPositionCommand,
            this.onfindElementByPosition,
        );
    }

    protected onfindElementByPosition = (
        message: ElementFinderByPositionMessage,
        error: ErrorMessageContent,
        sourceWin: Window,
        responder?: FrameMessageResponseCallback,
    ): void => {
        this.processRequest(message).then(
            result => {
                responder(result, null, sourceWin);
            },
            err => {
                responder(null, err, sourceWin);
            },
        );
    };

    public async processRequest(message: ElementFinderByPositionMessage): Promise<string[]> {
        let path = [];
        const element = this.getElementByPosition(message);

        if (element == null) {
            return path;
        }

        path.push(this.scannerUtils.getUniqueSelector(element));

        if (element.tagName.toLocaleLowerCase() !== 'iframe') {
            return path;
        }

        const elementRect = this.clientUtils.getOffset(element as BoundRectAccessor);

        const descendentElements = await this.frameCommunicator.sendMessage<
            ElementFinderByPositionMessage,
            string[]
        >({
            command: ElementFinderByPosition.findElementByPositionCommand,
            frame: element as HTMLIFrameElement,
            message: {
                x: message.x + window.scrollX - elementRect.left,
                y: message.y + window.scrollY - elementRect.top,
            } as ElementFinderByPositionMessage,
        });

        path = path.concat(descendentElements);
        return path;
    }

    private getElementByPosition(message: ElementFinderByPositionMessage): HTMLElement {
        const elements = this.dom.elementsFromPoint(message.x, message.y) as HTMLElement[];

        for (let pos = 0; pos < elements.length; pos++) {
            if (elements[pos].id === 'insights-shadow-host') {
                continue;
            }
            return elements[pos];
        }
    }
}
