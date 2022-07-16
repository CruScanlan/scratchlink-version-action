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
    const scratchLinkVersionPath = path.join(dir, 'commitVersion.json');

    const lastEditConfigCommit = (await octokit.rest.repos.listCommits({
        owner: 'CruScanlan',
        repo: 'scratchlinkcodes-config'
    })).data[0];

    const lastCodesCommit = (await octokit.rest.repos.listCommits({
        owner: 'CruScanlan',
        repo: 'scratchlinkcodes'
    })).data[0];

    const scratchLinkVersion = {
        app: {
            commitUrl: lastCodesCommit.html_url,
            commitTime: new Date(lastCodesCommit.commit.committer.date).toLocaleString('en-US', { timeZone: 'Australia/Brisbane' })
        },
        editConfig: {
            commitUrl: lastEditConfigCommit.html_url,
            commitTime: new Date(lastEditConfigCommit.commit.committer.date).toLocaleString('en-US', { timeZone: 'Australia/Brisbane' })
        },
    }

    await fs.writeFile(scratchLinkVersionPath, JSON.stringify(scratchLinkVersion, null, 2));

    console.log('ScratchLink Version Control Updated Commit Version: ' + JSON.stringify(scratchLinkVersion));
}

main().catch(err => core.setFailed(err.message));