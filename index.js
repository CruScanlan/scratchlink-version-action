const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs } = require('fs');
const path = require("path");

const workspace = process.env.GITHUB_WORKSPACE;

const main = async () => {
    const token = core.getInput('token');

    console.log('ScratchLink Version Control Running');
    const dir = path.resolve(workspace);

    const octokit = github.getOctokit(token)

    const scratchLinkConfigPath = path.join(dir, 'node_modules/scratchlinkcodes-config/config.json');

    const scratchLinkConfigString = await fs.readFile(scratchLinkConfigPath, 'utf8');
    const scratchLinkConfig = JSON.parse(scratchLinkConfigString);

    const lastEditConfigCommit = (await octokit.rest.repos.listCommits({
        owner: 'CruScanlan',
        repo: 'scratchlinkcodes-config'
    })).data[0];

    scratchLinkConfig.versionDetails = {
        commitUrl: lastEditConfigCommit.html_url,
        time: new Date(lastEditConfigCommit.commit.committer.date).toLocaleString('en-US', { timeZone: 'Australia/Brisbane' })
    }

    await fs.writeFile(scratchLinkConfigPath, JSON.stringify(scratchLinkConfig, null, 2));

    console.log('ScratchLink Version Control: Updated config.json');
    console.log('ScratchLink Version Control: ' + JSON.stringify(scratchLinkConfig.versionDetails));
}

main().catch(err => core.setFailed(err.message));