// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const { startMockService } = require('./mock-service');

startMockService(9051, path.join(__dirname, 'AccessibilityInsights'));
