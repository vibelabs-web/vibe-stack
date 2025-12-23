#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const chalk = require('chalk');
const ora = require('ora');
const degit = require('degit');

const TEMPLATE_REPO = 'vibelabs-web/vibe-stack';

async function init() {
    console.log(chalk.bold.hex('#FF6B00')('\n🍊 Welcome to Vibe Community CLI!\n'));

    // 1. 프로젝트 이름 입력 받기
    const response = await prompts({
        type: 'text',
        name: 'projectName',
        message: 'What is your project name?',
        initial: 'my-vibe-app'
    });

    if (!response.projectName) {
        console.log(chalk.red('❌ Operation cancelled'));
        process.exit(1);
    }

    const projectDir = path.join(process.cwd(), response.projectName);

    // 2. 폴더 확인
    if (fs.existsSync(projectDir)) {
        console.log(chalk.red(`❌ Directory "${response.projectName}" already exists.`));
        process.exit(1);
    }

    // 3. 템플릿 다운로드 (degit 사용)
    const spinner = ora(`Downloading template from ${TEMPLATE_REPO}...`).start();

    try {
        const emitter = degit(TEMPLATE_REPO, {
            cache: false,
            force: true,
            verbose: true,
        });

        await emitter.clone(projectDir);

        spinner.succeed(chalk.green('Template downloaded successfully!'));
    } catch (err) {
        spinner.fail(chalk.red('Failed to download template.'));
        console.log(chalk.yellow('\nTip: Make sure the repository exists and is public.'));
        // 로컬 테스트용: 실제 리포가 없을 때를 대비한 메시지
        console.log(chalk.gray(`(Error details: ${err.message})`));
        process.exit(1);
    }

    // 4. 완료 메시지
    console.log('\nDone! Now run:\n');
    console.log(chalk.cyan(`  cd ${response.projectName}`));
    console.log(chalk.cyan('  npm install'));
    console.log(chalk.cyan('  npm run dev'));
    console.log('\nHappy Coding! 🚀\n');
}

init().catch((e) => {
    console.error(e);
});
