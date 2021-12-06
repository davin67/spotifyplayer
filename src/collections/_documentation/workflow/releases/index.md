---
title: Releases
sidebar_order: 0
---

A release is a version of your code that is deployed to an environment. When you give Sentry information about your releases, you unlock a number of new features:

- Determine the issues and regressions introduced in a new release
- Predict which commit caused an issue and who is likely responsible
- Resolve Sentry issues by including the issue number in your commit message
- Receive email notifications when your code gets deployed

Additionally, releases are used for JavaScript projects to unminify  error stack traces, by holding source maps as release "artifacts." To learn more, please check out our [JavaScript]({%- link _documentation/platforms/javascript/sourcemaps/index.md -%}) docs.

## Using Releases

Before you can use releases to their full potential, you'll need to add [an integration]({%- link _documentation/workflow/integrations/index.md -%}) with your source code management tool to your org, and make sure to configure it to include any repos from which you want to track commits. Note that you'll need to be an Owner or Manager of your Sentry organization to do this. You can read more about roles in Sentry [here]({%- link _documentation/accounts/membership.md -%}).

Once your integration is installed and you've linked the necessary repos, for each release you'll complete the following steps as part of your build process:

- [Create the release]({%- link _documentation/workflow/releases/creating.md -%})
- [Associate commits with the release]({%- link _documentation/workflow/releases/commits.md -%})
- [Tag your errors with the release ID]({%- link _documentation/workflow/releases/tagging.md -%})
- (_JavaScript projects_) [Upload source maps]({%- link _documentation/platforms/javascript/sourcemaps/index.md -%})
- (_optional_) [Tell Sentry when you deploy]({%- link _documentation/workflow/releases/deploying.md -%})
