import * as fs from 'fs';
import { platform } from 'os';
import * as path from 'path';
import * as pkg from 'pkg';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const stat = promisify(fs.stat);

export const mockAdbFolder = path.join(__dirname, 'bin');

const binPath = path.join(__dirname, 'bin.js');
const mockAdbName = platform() === 'win32' ? 'adb.exe' : 'adb';
const mockAdbPath = path.join(mockAdbFolder, mockAdbName);
const configPath = path.join(mockAdbFolder, 'mock_adb_config.json');

async function needsRebuild(): Promise<boolean> {
    const binExists = await exists(mockAdbPath);
    if (!binExists) {
        return true;
    }

    const binModified = (await stat(mockAdbPath)).mtimeMs;
    const binSrcModified = (await stat(binPath)).mtimeMs;

    return binModified < binSrcModified;
}

async function buildMockAdb(): Promise<void> {
    await pkg.exec([binPath, '-d', '--target', 'host', '--output', mockAdbPath]);
}

export type MockAdbConfig = {
    [inputCommand: string]: {
        stdout?: string;
        stderr?: string;
        exitCode?: number;
    };
};

export async function setupMockAdb(config: MockAdbConfig): Promise<void> {
    if (await needsRebuild()) {
        await buildMockAdb();
    }

    await writeFile(configPath, JSON.stringify(config));
}
