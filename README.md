# Defect - Flow Action custom config page using `<AppProvider>` cannot trigger Remix 

This reproduction is based on [Shopify/shopify-app-template-remix](https://github.com/Shopify/shopify-app-template-remix), combined with a basic implementation of a Shopify Flow Custom Action from the [Flow dev docs](https://shopify.dev/docs/apps/flow/actions/create-an-action).

The implementation is **bare bones**, and there is **no HMAC validation** being performed on requests to the `/flow/*` routes. This is intentional to present a minimal example.

## Problem statement

When using the `<AppProvider>` component from `@shopify/shopify-app-remix/react` on the custom config page for a Shopify Flow custom action, requests Remix Actions are not successfully dispatched to the server side.

## Steps to reproduce

Prerequisites:
- NodeJS
- A Shopify Partners account
- A Shopify Development store with the Shopify Flow app installed

1. Clone this repository
2. Install dependencies
    ```
    npm i
    ```
3. Run Local Development environment
    ```
    npm run dev
    ```
    Follow the CLI prompts and then press P to open the app in your browser. Accept the permissions request to install it in your development store.
4. Open `extensions/place-bid/shopify.extension.toml`, and replace all occurrences of `https://example.com` with the Cloudflare Tunnel URL from `shopify.app.toml` (see `application_url` field)
5. In your development store, navigate to the Shopify Flow app
6. Click "Create workflow"
7. Click "Select a trigger", search for "order created", and choose the first trigger
8. Click the "+" button next to the trigger on the workflow UI, select "Action"
9. In the "Actions" panel, you should see the `flow-app-provider-demo` app listed. Click the app name, and then click "place-bid" (the example action).
10. The action UI should load, and you should see requests in your Local Development logs to `/flow/validate` and `flow/preview`. Click the "Configure" button, which will take you to the custom config page.
11. By default, `shopify.extension.toml` is configured to present the `/flow/config-app-provider` route. **This demonstrates the issue!**
  - Open your in-browser Developer Tools to view the Console and Network tabs
  - Click the "Test" button
  - Observe that client-side console logging is produced
  - Observe that no POST request is made to `/flow/config-app-provider`, and no console logging is produced in the server-side console
12. To see the expected behaviour, update `shopify.extension.toml` - comment out line 8, and uncomment line 7. Save the file, and the change should automatically get picked up. Navigate back to the Flow UI, and then click the "Configure button again.
  - Open your in-browser Developer Tools to view the Console and Network tabs
  - Click the "Test" button
  - Observe that client-side console logging is produced
  - Observe that a POST request is made to `/flow/config-app-provider`, and console logging is produced in the server-side console. You will also see `status: ` change to `status: success`.

## Observations

During investigation of this issue, the following notes were made.

- The native browser `fetch` function is being patched by the App Bridge script
- Anecdotally, it appears that the following chain of events occurs:
  - `submit` function executes
  - Logic to form Action request begins executing, including assigning event listeners to abort the request if an "aborted" signal is received
  - Re-render of the React component tree occurs - *unclear exactly when*, and this appears to trigger an "aborted" event
  - Request fails to be dispatched
- Using the raw `AppProvider` from `@shopify/polaris`, without using the App Bridge CDN script, appears to work without any of these problems.
