// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as fs from 'fs';
import * as path from 'path';
import { generateUID } from 'common/uid-generator';

function sanitizeFilename(s: string): string {
    return s.replace(/[^a-z0-9.-]+/gi, '_');
}

// Makes a directory for the fileType if one does not already exist.
// Does *not* make the actual file.
export async function prepareTestResultFilePath(
    resultsSubdirectoryName: string,
    fileExtension: string,
): Promise<string> {
    const subdirectoryPath = path.resolve(
        __dirname,
        '../../../../test-results/e2e',
        resultsSubdirectoryName,
    );

    await fs.promises.mkdir(subdirectoryPath, { recursive: true });
    const fileName = `${sanitizeFilename(generateUID())}.${fileExtension}`;
    const filePath = path.join(subdirectoryPath, fileName);
    return filePath;
}
