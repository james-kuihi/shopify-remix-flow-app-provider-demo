import type { ActionFunctionArgs } from '@remix-run/node';

type ValidateRequestBody = {
    steps: { step_reference: string; properties: Record<string, any> }[];
  };

export const action = async ({ request }: ActionFunctionArgs) => {
    const body = await request.json() as ValidateRequestBody;

    const responseBody = await Promise.all(
        body.steps.map(async ({ step_reference }) => 
        ({
            step_reference,
            step_errors: [],
            properties_errors: [],
        })
        ),
    );

    return new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { 'content-type': 'application/json' },
    });
};
