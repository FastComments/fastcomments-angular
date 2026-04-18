#!/usr/bin/env node
// Builds the fastcomments-angular workspace demo as static files.
// --base-href ./ produces a bundle that works under any URL prefix.
import { execSync } from 'node:child_process';
import { rmSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(ROOT, 'demo-dist');

const sh = (cmd, cwd = ROOT) => {
    console.log('$', cmd, `(${cwd})`);
    execSync(cmd, { stdio: 'inherit', cwd });
};

sh('npm ci');
sh('npx ng build --base-href ./');

rmSync(OUT, { recursive: true, force: true });
renameSync(resolve(ROOT, 'dist/fastcomments-angular-workspace/browser'), OUT);
console.log('Built fastcomments-angular demo at', OUT);
