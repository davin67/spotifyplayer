---
title: Deploying
sidebar_order: 4
---

## Tell Sentry When You Deploy a Release

Tell Sentry when you deploy a release and we’ll automatically send an email to Sentry users who have committed to the release that is being deployed.

{% asset deploy-emails.png %}

You must have environment [context]({%- link _documentation/enriching-error-data/context.md -%}) set in your SDK in order to use this feature. To let Sentry know you’ve deployed, just send an additional request after creating a release:

```bash
sentry-cli releases deploys VERSION new -e ENVIRONMENT
```

You can also use our [API]({%- link _documentation/api/releases/post-release-deploys.md -%}) to create a deploy.
