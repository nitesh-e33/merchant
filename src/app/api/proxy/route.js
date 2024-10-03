import { NextResponse } from 'next/server';
const sendExternalRequest = async (apiUrl, method, headers, body = null) => {
  try {
    const externalResponse = await fetch(apiUrl, {
      method,
      headers,
      body,
    });

    if (!externalResponse.ok) {
      throw new Error(`External API error: ${externalResponse.status}`);
    }

    const result = await externalResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calling external API:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
};

const handler = async (request) => {
  const method = request.method;
  let apiUrl, requestData, headers = {};

  try {
    if (method === 'POST') {
      const contentType = request.headers.get('content-type') || '';

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        apiUrl = formData.get('apiUrl');

        const externalFormData = new FormData();
        formData.forEach((value, key) => {
          externalFormData.append(key, value);
        });

        headers = {
          Authorization: request.headers.get('authorization'),
        };

        return await sendExternalRequest(apiUrl, method, headers, externalFormData);

      } else {
        // Handle JSON request
        const body = await request.json();
        apiUrl = body.apiUrl;
        requestData = JSON.stringify(body.requestData || {});
        headers = {
          'Content-Type': 'application/json',
          ...body.headers,
        };

        return await sendExternalRequest(apiUrl, method, headers, requestData);
      }
    } else if (method === 'GET') {
      const { searchParams } = new URL(request.url);
      apiUrl = searchParams.get('apiUrl');
      const queryParams = searchParams.get('queryParams') || '';
      apiUrl = `${apiUrl}?${queryParams}`;
      headers = {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('authorization'),
      };

      return await sendExternalRequest(apiUrl, method, headers);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export const POST = handler;
export const GET = handler;