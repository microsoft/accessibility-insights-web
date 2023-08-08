// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { A11YSelfValidator } from '../../common/a11y-self-validator';
import { HTMLElementUtils } from '../../common/html-element-utils';
import { ScannerUtils } from '../../injected/scanner-utils';
import { scan } from '../../scanner/exposed-apis';
import { rendererDependencies } from './electron-dependencies';
import { renderer } from './renderer';

renderer(rendererDependencies());

const a11ySelfValidator = new A11YSelfValidator(new ScannerUtils(scan), new HTMLElementUtils());
(window as any).A11YSelfValidator = a11ySelfValidator;
