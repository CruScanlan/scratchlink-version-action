const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs } = require('fs');

const main = async () => {
    const repo = core.getInput('repo');
    console.log('ScratchLink Version Control Running For Repo: ' + repo);
    
    console.log(process.env.GITHUB_WORKSPACE);

    console.log(await fs.readdir(process.env.GITHUB_WORKSPACE+"../"));

    if(repo === 'editConfig') {
        const scratchLinkConfig = await fs.readFile(process.env.GITHUB_WORKSPACE+'/config.json', 'utf8');
        console.log(scratchLinkConfig);
    }
}

main().catch(err => core.setFailed(err.message));