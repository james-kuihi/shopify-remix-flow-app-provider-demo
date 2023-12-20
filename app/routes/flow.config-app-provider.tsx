import type { HeadersFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData, useRouteError, useSubmit } from '@remix-run/react';
import { Button } from '@shopify/polaris';
import polarisStyles from '@shopify/polaris/build/esm/styles.css';
import { AppProvider } from '@shopify/shopify-app-remix/react';
import { boundary } from '@shopify/shopify-app-remix/server';

export const loader = () => {
    return json({apiKey: process.env.SHOPIFY_API_KEY || ''});
}

export const action = () => {
    console.log("Action triggered successfully!")
    return { status: 'success' }
}

export default () => {
    const { apiKey } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const submit = useSubmit();

    const onClick = () => {
        console.log("Triggering action request");
        submit({}, {method: 'post'});
        console.log("Action request triggered");
    }
    
    return (
        <>
            <div>With <code>AppProvider</code>:</div>
            <AppProvider isEmbeddedApp apiKey={apiKey}>
                <Button onClick={onClick}>Test</Button>
                <p>status: {actionData?.status}</p>
            </AppProvider>
        </>
    )
}

export const links = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const ErrorBoundary = () => boundary.error(useRouteError());

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);