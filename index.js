const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs } = require('fs');
const path = require("path");

const workspace = process.env.GITHUB_WORKSPACE;

const main = async () => {
    const repo = core.getInput('repo');
    console.log('ScratchLink Version Control Running For Repo: ' + repo);
    const dir = path.resolve(workspace);

    if(repo === 'editConfig') {
        const scratchLinkConfigString = await fs.readFile(path.join(dir, 'config.json'), 'utf8');
        const scratchLinkConfig = JSON.parse(scratchLinkConfigString);

        scratchLinkConfig.versionDetails = {
            commitUrl: `${github.context.repo.repoUrl}/commit/${github.context.sha}`,
            commitCount: github.context.payload.pull_request.commits.length,
            time: (new Date()).toTimeString()
        }

        await fs.writeFile(path.join(dir, 'config.json'), JSON.stringify(scratchLinkConfig, null, 2));

        console.log('ScratchLink Version Control: Updated config.json');
        console.log('ScratchLink Version Control: ' + JSON.stringify(scratchLinkConfig.versionDetails));
    }
}

main().catch(err => core.setFailed(err.message));