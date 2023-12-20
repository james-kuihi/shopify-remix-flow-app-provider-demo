export const action = async () => {
  const responseBody = {
    label_text: '-',
    text_preview: 'Configure this action',
    button_text: 'Configure',
    image_preview: null,
    last_updated_at: null,
  };

  return new Response(JSON.stringify(responseBody), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
