---
name: Angular
doc_link: https://docs.sentry.io/platforms/javascript/angular/
support_level: production
type: framework
---

To use Sentry with your Angular application, you will need to use `@sentry/angular` (Sentry’s Browser Angular SDK).

<Alert level="info" title="Note"><markdown>

`@sentry/angular` is a wrapper around the `@sentry/browser` package, with added functionality related to Angular. All methods available in the `@sentry/browser` package can also be imported from `@sentry/angular`.

</markdown></Alert>

Add the Sentry SDK as a dependency using yarn or npm:

```bash
# Using yarn
$ yarn add @sentry/angular

# Using npm
$ npm install @sentry/angular
```

### Connecting the SDK to Sentry

After you've completed setting up a project in Sentry, Sentry will give you a value which we call a _DSN_ or _Data Source Name_. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

You should `init` the Sentry browser SDK as soon as possible during your application load up, before initializing Angular:

```javascript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { init } from '@sentry/angular';

import { AppModule } from './app/app.module';

init({
  dsn: '___PUBLIC_DSN___',
  // ...
});

// ...

enableProdMode();
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(success => console.log(`Bootstrap success`))
  .catch(err => console.error(err));
```

On its own, `@sentry/angular` will report any uncaught exceptions triggered by your application. Additionally, you can configure `@sentry/angular` to catch any Angular-specific exceptions reported through the [@angular/core/ErrorHandler](https://angular.io/api/core/ErrorHandler) provider.

### ErrorHandler

`@sentry/angular` exports a function to instantiate `ErrorHandler` provider that will automatically send Javascript errors captured by the Angular's error handler.

```javascript
import { NgModule, ErrorHandler } from '@angular/core';
import { createErrorHandler } from '@sentry/angular';

@NgModule({
  // ...
  providers: [
    {
      provide: ErrorHandler,
      useValue: createErrorHandler({
        showDialog: true,
      }),
    },
  ],
  // ...
})
export class AppModule {}
```

Additionally, `createErrorHandler` accepts a set of options that allows you to configure its behaviour. For more details see `ErrorHandlerOptions` interface in [our repository](https://github.com/getsentry/sentry-javascript/blob/master/packages/angular/src/errorhandler.ts).

## Tracing

`@sentry/angular` exports a Trace Service, Directive and Decorators that leverage the `@sentry/tracing` Tracing integration to add Angular related spans to transactions. If the Tracing integration is not enabled, this functionality will not work. The service itself tracks route changes and durations, where directive and decorators are tracking components initializations.

### Install

Registering a Trace Service is a 3 steps process.

1. Register and configure `@sentry/tracing` `BrowserTracing` integration, including custom Angular routing instrumentation:

```javascript
import { init, routingInstrumentation } from '@sentry/angular';
import { Integrations as TracingIntegrations } from '@sentry/tracing';

init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new TracingIntegrations.BrowserTracing({
      tracingOrigins: ['localhost', 'https://yourserver.io/api'],
      routingInstrumentation: routingInstrumentation,
    }),
  ],
  tracesSampleRate: 1,
});
```

2. Register `SentryTrace` as a provider in Angular's DI system, with a `Router` as its dependency:

```javascript
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { TraceService } from '@sentry/angular';

@NgModule({
  // ...
  providers: [
    {
      provide: TraceService,
      deps: [Router],
    },
  ],
  // ...
})
export class AppModule {}
```

3. Either require the `TraceService` from inside `AppModule` or use `APP_INITIALIZER` to force instantiate Tracing.

```javascript
@NgModule({
  // ...
})
export class AppModule {
  constructor(trace: TraceService) {}
}
```

or

```javascript
import { APP_INITIALIZER } from '@angular/core';

@NgModule({
  // ...
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [TraceService],
      multi: true,
    },
  ],
  // ...
})
export class AppModule {}
```

### Use

To track Angular components as part of your transactions, you have 3 options.

_TraceDirective:_ used to track a duration between `OnInit` and `AfterViewInit` lifecycle hooks in template:

```javascript
import { TraceDirective } from '@sentry/angular';

@NgModule({
  // ...
  declarations: [TraceDirective],
  // ...
})
export class AppModule {}
```

Then inside your components template (keep in mind that directive name attribute is required):

```html
<app-header [trace]="'header'"></app-header>
<articles-list [trace]="'articles-list'"></articles-list>
<app-footer [trace]="'footer'"></app-footer>
```

_TraceClassDecorator:_ used to track a duration between `OnInit` and `AfterViewInit` lifecycle hooks in components:

```javascript
import { Component } from '@angular/core';
import { TraceClassDecorator } from '@sentry/angular';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
})
@TraceClassDecorator()
export class HeaderComponent {
  // ...
}
```

_TraceMethodDecorator:_ used to track a specific lifecycle hooks as point-in-time spans in components:

```javascript
import { Component, OnInit } from '@angular/core';
import { TraceMethodDecorator } from '@sentry/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  @TraceMethodDecorator()
  ngOnInit() {}
}
```

You can also add your own custom spans by attaching them to the current active transaction using `getActiveTransaction`
helper. For example, if you'd like to track the duration of Angular boostraping process, you can do it as follows:

```javascript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { init, getActiveTransaction } from '@sentry/angular';

import { AppModule } from './app/app.module';

// ...

const activeTransaction = getActiveTransaction();
const boostrapSpan =
  activeTransaction &&
  activeTransaction.startChild({
    description: 'platform-browser-dynamic',
    op: 'angular.bootstrap',
  });

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => console.log(`Bootstrap success`))
  .catch(err => console.error(err));
  .finally(() => {
    if (bootstrapSpan) {
      boostrapSpan.finish();
    }
  })
```

## AngularJS 1.x

If you're using `AngularJS 1.x`, you can use Sentry's AngularJS integration.

First, install `@sentry/browser` and `@sentry/integrations`:

```bash
# Using yarn
yarn add @sentry/browser @sentry/integrations

# Using npm
npm install @sentry/browser @sentry/integrations
```

```javascript
import angular from "angular";
import * as Sentry from "@sentry/browser";
import { Angular as AngularIntegration } from "@sentry/integrations";

// Make sure to call Sentry.init after importing AngularJS.
// You can also pass {angular: AngularInstance} to the Integrations.Angular() constructor.
Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [new AngularIntegration()],
});

// Finally require ngSentry as a dependency in your application module.
angular.module("yourApplicationModule", ["ngSentry"]);
```

In case you're using the CDN version or the Loader, Sentry provides a standalone file for every integration:

```html
<!-- Note that we now also provide a es6 build only -->
<!-- <script src="https://browser.sentry-cdn.com/5.20.1/bundle.es6.min.js" integrity="sha384-vX2xdItiRzNmed/VJFb8J4h2p35hYqkdTI9+xNOueKEcr7iipZy17fplNS0ikHL0" crossorigin="anonymous"></script> -->
<script
  src="https://browser.sentry-cdn.com/5.20.1/bundle.min.js"
  integrity="sha384-O8HdAJg1h8RARFowXd2J/r5fIWuinSBtjhwQoPesfVILeXzGpJxvyY/77OaPPXUo"
  crossorigin="anonymous"
></script>

<!-- If you include the integration it will be available under Sentry.Integrations.Angular -->
<script
  src="https://browser.sentry-cdn.com/5.20.1/angular.min.js"
  crossorigin="anonymous"
></script>

<script>
  Sentry.init({
    dsn: "___PUBLIC_DSN___",
    integrations: [new Sentry.Integrations.Angular()],
  });
</script>
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
