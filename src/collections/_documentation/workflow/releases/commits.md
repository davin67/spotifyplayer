---
title: Associating Commits with a Release
sidebar_title: Associating Commits
sidebar_order: 2
---

{% capture __alert_content -%}
Stop! Have you installed [an integration]({%- link _documentation/workflow/integrations/index.md -%}) with your source code management tool in your Sentry organization, and have you configured it to include the necessary repos?

If not, please go [do that]({%- link _documentation/workflow/integrations/index.md -%}) first.
{%- endcapture -%}
{%- include components/alert.html
  title="Required Prerequisites"
  content=__alert_content
  level="warning"
%}

In this step you tell Sentry which commits are associated with a release, allowing Sentry to pinpoint which commits likely caused an issue, and allowing you to resolve a Sentry issue by including the issue number in your commit message.

In your release process, add a step to [create a release object in Sentry]({%- link _documentation/workflow/releases/creating.md -%}) and associate it with commits in your repository. There are two ways of doing this:

- Using Sentry’s [Command Line Interface](#cli) (**recommended**)
- Using the [API](#api)

{% capture __alert_content -%}
For either method, you need to make sure you’re using [Auth Tokens]({%- link _documentation/api/auth.md -%}#auth-tokens) (**not** [API Keys]({%- link _documentation/api/auth.md -%}#api-keys), which are deprecated). You can find your Auth Tokens [here](https://sentry.io/settings/account/api/auth-tokens/).
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

## Using the CLI {#cli}

```bash
# Assumes you're in a git repository
export SENTRY_AUTH_TOKEN=...
export SENTRY_ORG=my-org
VERSION=$(sentry-cli releases propose-version)

# Create a release
sentry-cli releases new -p project1 -p project2 $VERSION

# Associate commits with the release
sentry-cli releases set-commits --auto $VERSION
```

In the above example, we’re using the `propose-version` sub-command to automatically determine a release ID. Then we’re creating a release tagged `VERSION` for the organization `my-org` for projects `project1` and `project2`. Finally we’re using the `--auto` flag to automatically determine the repository name, and associate the commits between the previous release’s commit and the current head commit with the `VERSION` release. (The first time you associate commits, we use the latest 10 commits.)

If you want more control over which commits to associate, or are unable to execute the command inside the repository, you can manually specify a repository and range. In this case, you'd replace the last line above with:

`sentry-cli releases set-commits --commit "my-repo@from..to" $VERSION`

Here we are associating commits (or refs) between `from` and `to` with the current release, `from` being the previous release’s head commit. The repository name `my-repo` is of the form `org-name/repo-name` and must match the name you see when you configure your integration and select repos. The `from` commit is optional and we’ll use the previous release’s head commit as the baseline if it is excluded.

For more information, see the [CLI docs]({%- link _documentation/cli/releases.md -%}).

## Using the API {#api}

{% capture __alert_content -%}
We changed releases to be an org-level entity instead of a project-level entity, so if you are attempting to add commits to a pre-existing releases configuration that uses the project releases endpoint, you will need to change the url.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

```bash
# Create a new release and associate the relevant commits
curl https://sentry.io/api/0/organizations/:organization_slug/releases/ \
  -X POST \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Content-Type: application/json' \
  -d '
 {
 "version": "2da95dfb052f477380608d59d32b4ab9",
 "refs": [{
 "repository":"owner-name/repo-name",
 "commit":"2da95dfb052f477380608d59d32b4ab9",
 "previousCommit":"1e6223108647a7bfc040ef0ca5c92f68ff0dd993"
 }],
 "projects":["my-project","my-other-project"]
}
'
```

If you’d like to have more control over what order the commits appear in, you can send us a list of all commits. That might look like this:

```python
import subprocess
import requests

SENTRY_API_TOKEN = <my_api_token>
sha_of_previous_release = <previous_sha>

log = subprocess.Popen([
    'git',
    '--no-pager',
    'log',
    '--no-merges',
    '--no-color',
    '--pretty=%H',
    '%s..HEAD' % (sha_of_previous_release,),
], stdout=subprocess.PIPE)

commits = log.stdout.read().strip().split('\n')

data = {
    'commits': [{'id': c, 'repository': 'my-repo-name'} for c in commits],
    'version': commits[0],
    'projects': ['my-project', 'my-other-project'],
}

res = requests.post(
    'https://sentry.io/api/0/organizations/my-org/releases/',
    json=data,
    headers={'Authorization': 'Bearer {}'.format(SENTRY_API_TOKEN)},
)
```

For more information, see the [API reference]({%- link _documentation/api/releases/post-organization-releases.md -%}).

## Results

After you've linked your repo and associated the relevant commits, **suspect commits** and **suggested assignees** will start appearing on the issue page. We determine these by tying together the commits in the release, files touched by those commits, files observed in the stack trace, authors of those files, and [ownership rules]({%- link _documentation/workflow/issue-owners.md -%}).

{% asset suspect-commits-highlighted.png %}

Additionally, you will be able to resolve issues by including the issue ID in your commit message. You can find the issue id at the top of the issue details page, next to the assignee dropdown. For example, a commit message might look like this:

```bash
Prevent empty queries on users

Fixes SENTRY-317
```

When Sentry sees this commit, we’ll reference the commit in the issue, and when you create a release in Sentry we’ll mark the issue as resolved in that release.

{% capture __alert_content -%}
If you’re using GitHub, you may have a privacy setting enabled which prevents Sentry from identifying the user’s real email address. If you wish to use the suggested owners feature, you’ll need to ensure “Keep my email address private” is unchecked in GitHub’s [account settings](https://github.com/settings/emails).
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}
