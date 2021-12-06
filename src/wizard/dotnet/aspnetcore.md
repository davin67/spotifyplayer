---
name: ASP.NET Core
doc_link: https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/
support_level: production
type: framework
---

Install the **NuGet** package:

Package Manager:

```shell
Install-Package Sentry.AspNetCore -Version {{ packages.version('sentry.dotnet') }}
```

.NET Core CLI:

```shell
dotnet add package Sentry.AspNetCore -v {{ packages.version('sentry.dotnet') }}
```

Add Sentry to `Program.cs` through the `WebHostBuilder`:

ASP.NET Core 2.x:

C#:
```csharp
public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        // Add the following line:
        .UseSentry("___PUBLIC_DSN___");
```

F#:
```fsharp
let BuildWebHost args =
    WebHost.CreateDefaultBuilder(args)
        // Add the following line:
        .UseSentry("___PUBLIC_DSN___")
```

ASP.NET Core 3 or later;

C#:
```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            // Add the following line:
            webBuilder.UseSentry("___PUBLIC_DSN___");
        });
```

F#:
```fsharp
let CreateHostBuilder args =
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(fun webBuilder ->
            // Add the following line:
            webBuilder.UseSentry("___PUBLIC_DSN___") |> ignore
        )
```

### Verification

You can verify your setup by throwing an exception from a controller:

```csharp
[Route("api/[controller]")]
public class BadController
{
    [HttpGet]
    public string Get() => throw null;
}
```

And make a request to that lambda:

```sh
curl -X GET -I https://url.of.server/api/bad
```

### Documentation

Once you've verified the package is initialized properly and sent a test event, consider visiting our [complete ASP.NET Core docs](https://docs.sentry.io/platforms/dotnet/guides/aspnetcore/).

### Samples

See the following examples that demonstrate how to integrate Sentry with various frameworks.

- [Multiple samples in the `dotnet` SDK repository](https://github.com/getsentry/sentry-dotnet/tree/main/samples) (**C#**)
- [Basic F# sample](https://github.com/sentry-demos/fsharp) (**F#**)
- [Giraffe F# sample](https://github.com/sentry-demos/giraffe) (**F#**)
