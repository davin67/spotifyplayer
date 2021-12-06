---
name: C#
doc_link: https://docs.sentry.io/platforms/dotnet/
support_level: production
type: language
---

## Install the NuGet package

```shell
# Using Package Manager
Install-Package Sentry -Version {{ packages.version('sentry.dotnet') }}

# Or using .NET Core CLI
dotnet add package Sentry -v {{ packages.version('sentry.dotnet') }}

# Or using Paket
paket add Sentry --version {{ packages.version('sentry.dotnet') }}
```

<div class="alert alert-info" role="alert"><h5 class="no_toc">Using .NET Framework prior to 4.6.1?</h5>
    <div class="alert-body content-flush-bottom">
        <a href="https://docs.sentry.io/clients/csharp/">Our legacy SDK</a> supports .NET Framework as early as 3.5.
    </div>
</div>

## Initialize the SDK

Initialize the SDK as early as possible, like in the `Main` method in `Program.cs`:

C#
```csharp
using (SentrySdk.Init("___PUBLIC_DSN___"))
{
    // App code
}
```

F#
```fsharp
use __ = SentrySdk.Init ("___PUBLIC_DSN___")
// App code
```

### Verification

Verify Sentry is capturing unhandled exceptions by raising an exception. For example, you can use the following snippet to raise a `NullReferenceException`:

C#
```csharp
using (SentrySdk.Init("___PUBLIC_DSN___"))
{
    throw null;
}
```

F#
```fsharp
use __ = SentrySdk.Init ("___PUBLIC_DSN___")
raise <| NullReferenceException ()
```

### Documentation

Once you've verified the package is initialized properly and sent a test event, consider visiting our [complete ASP.NET Core docs](https://docs.sentry.io/platforms/dotnet/).

### Samples

See the following examples that demonstrate how to integrate Sentry with various frameworks.

- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)
