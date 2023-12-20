import type { HeadersFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData, useRouteError, useSubmit } from '@remix-run/react';
import polarisStyles from '@shopify/polaris/build/esm/styles.css';
import { boundary } from '@shopify/shopify-app-remix/server';

export const loader = () => {
    return json({apiKey: process.env.SHOPIFY_API_KEY || ''});
}

export const action = () => {
    console.log("Action triggered successfully!")
    return { status: 'success' }
}

export default () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            <div>Without <code>AppProvider</code>:</div>
            <button onClick={onClick}>Test</button>
            <p>status: {actionData?.status}</p>
        </>
    )
}

export const links = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const ErrorBoundary = () => boundary.error(useRouteError());

export const headers: HeadersFunction = (headersArgs) => boundary.headers(headersArgs);