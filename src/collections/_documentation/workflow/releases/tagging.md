---
title: Tagging Errors with the Release ID
sidebar_title: Tagging Your Errors
sidebar_order: 1
release_identifier: "my-project-name@2.3.12"
---

In order to associate your errors with a particular release, you need to include a release ID (a.k.a version) where you configure your client SDK: 

{% include components/platform_content.html content_dir='set-release' %}

The release ID is a string, and is commonly a git SHA or a custom version number. How you get the release ID value is up to you -- many users use an environment variable that is set during the build process, but any method which makes the ID available to Sentry at initialization time is fine.

{% capture __alert_content -%}
Releases (and therefore release IDs) are global per organization, so make sure to prefix the ID with something project-specific if needed.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

Setting a release value in your SDK configuration lets each error be annotated with a release tag. We recommend that you [create a release record in Sentry]({%- link _documentation/workflow/releases/creating.md -%}) prior to deploying that release, but if you don’t, Sentry will automatically create one in the system the first time it sees an error with that release ID.

After this, you should see information about the release, such as new issues and regressions introduced in the release.

{% asset releases-overview.png %}
