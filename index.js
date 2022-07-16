const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs } = require('fs');
const path = require("path");

const workspace = process.env.GITHUB_WORKSPACE;

const main = async () => {
    const repo = core.getInput('repo');
    console.log('ScratchLink Version Control Running For Repo: ' + repo);

    const dir = path.resolve(workspace);

    console.log(await fs.readdir(dir));
    if(repo === 'editConfig') {
        const scratchLinkConfig = await fs.readFile(path.join(dir, 'config.json'), 'utf8');
        console.log(scratchLinkConfig);
    }
}

main().catch(err => core.setFailed(err.message));