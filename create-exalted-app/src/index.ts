#!/usr/bin/env node

import inquirer, { QuestionCollection } from "inquirer";
import shelljs from 'shelljs';
const { which, exec } = shelljs;
import chalk from 'chalk';
import { resolve } from 'node:path';
import { readdirSync, writeFileSync, readFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';

const cwd = process.cwd();
const root = resolve(process.argv[1], '../../');
const dataPath = resolve(root, './data');
const prefix = chalk.cyan.bold('[create-exalted-app] ');

const warn = (str: string) => console.warn(prefix + chalk.yellow(str));
const info = (str: string) => console.log(prefix + chalk.blue(str));
const error = (str: string) => console.error(prefix + chalk.red(str));

const filesInCwd = readdirSync(cwd);
if (filesInCwd.length > 0) {
    error('Current directory is not empty');
    process.exit(1);
}

const questions: QuestionCollection = [
    {
        type: "input",
        name: "projectName",
        message: "Select new project's name:",
        validate: (projectName: string) => projectName?.length !== 0
            ? (/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName)
                ? true
                : "Project name has to be a valid package name"
            )
            : "Project name is required"
    },
    {
        type: 'list',
        name: 'packageManager',
        message: "Select new project's package manager:",
        choices: [
            'npm',
            'yarn'
        ]
    },
    {
        type: 'list',
        name: 'targetJs',
        message: "Select new project's target JS version:",
        choices: [
            'ES3',
            'ES5',
            'ES6',
            'ES2016',
            'ES2017',
            'ES2018',
            'ES2019',
            'ES2020',
            'ES2021',
            'ES2022',
            'ESNext'
        ],
        loop: false
    }
];
inquirer.prompt(questions).then(answers => {
    
    const filesInCwd = readdirSync(cwd);
    if (filesInCwd.length > 0) {
        warn('Current directory is not empty');
        process.exit(1);
    }

    const paths = { cwd, dataPath };
    generatePackageJson(answers, paths);
    generateTsConfigJson(answers, paths);
    copyFileSync(resolve(paths.dataPath, './.gitignore'), resolve(paths.cwd, './.gitignore'));
    generateIndexFile(answers, paths);
    createGitRepo(cwd);
    addPackages(answers, cwd);

    info('Project initialized');
});

type Paths = {
    cwd: string,
    dataPath: string
}

function generatePackageJson(answers: Record<string, string>, paths: Paths) {
    info('Generating package.json...');
    const packageJsonPath = resolve(paths.cwd, './package.json');
    const projectName = answers['projectName'];
    const packageManagerCall = answers['packageManager'] === 'yarn' ? 'yarn' : 'npm run';

    const packageData = readFileSync(resolve(paths.dataPath, './package.json'), { encoding: 'utf-8' });
    writeFileSync(packageJsonPath, packageData
        .replace('${projectName}', projectName)
        .replace('${packageManagerCall}', packageManagerCall)
    )
}

function generateTsConfigJson(answers: Record<string, string>, paths: Paths) {
    info('Generating tsconfig.json...');
    const tsConfigPath = resolve(paths.cwd, './tsconfig.json');
    const targetJs = answers['targetJs'];

    const tsconfigData = readFileSync(resolve(paths.dataPath, './tsconfig.json'), { encoding: 'utf-8' });
    writeFileSync(tsConfigPath, tsconfigData
        .replace('${TARGET}', targetJs)
        .replace('${TARGET}', targetJs)
    )
}

function generateIndexFile(answers: Record<string, string>, paths: Paths) {
    info('Generating index.tsx...');
    const projectName = answers['projectName'];

    const srcPath = resolve(paths.cwd, './src');
    const indexPath = resolve(srcPath, './index.tsx');
    if (!existsSync(srcPath)){
        mkdirSync(srcPath);
    }

    const indexData = readFileSync(resolve(paths.dataPath, './index.tsx'), { encoding: 'utf-8' });
    writeFileSync(indexPath, indexData
        .replace('${projectName}', projectName)
    )
}

function createGitRepo(cwd: string) {
    info('Initializing git repository...');
    if (!which('git')) {
        warn('No Git installation detected, not creating a repository');
        return;
    }
    const result = exec('git init', {
        cwd,
    });
    if (result.code === 0) {
        info('Git repository initialized');
    } else {
        error(result);
        process.exit(1);
    }
}

function addPackages(answers: Record<string, string>, cwd: string) {
    info('Adding required packages...');
    const packageManagerCall = answers['packageManager'] === 'yarn' ? 'yarn add' : 'npm i';
    // const result = exec(packageManagerCall + ' exalted', {
    //     cwd,
    // });
    // if (result.code === 0) {
    //     info('Dependencies installed');
    // } else {
    //     error(result);
    //     process.exit(1);
    // }

    const resultDev = exec(packageManagerCall + ' typescript tslib -D', {
        cwd,
    });
    if (resultDev.code === 0) {
        info('Development dependencies installed');
    } else {
        error(resultDev);
        process.exit(1);
    }
}