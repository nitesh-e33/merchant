import { NextResponse } from 'next/server';
export async function handler(request) {
  const method = request.method;
  let apiUrl, requestData, headers = {};

  try {
    if (method === 'POST') {
      const contentType = request.headers.get('content-type') || '';

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        apiUrl = formData.get('apiUrl');
        requestData = {};
        formData.forEach((value, key) => {
          requestData[key] = value;
        });

        headers = {
          'Content-Type': 'application/json',
          Authorization: request.headers.get('authorization'),
        };
      } else {
        // Handle JSON
        const body = await request.json();
        apiUrl = body.apiUrl;
        requestData = body.requestData || {};
        headers = {
          'Content-Type': 'application/json',
          ...body.headers,
        };
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
    }

    // Send the request to the external API
    const externalResponse = await fetch(apiUrl, {
      method,
      headers,
      ...(method === 'POST' && {
        body: headers['Content-Type'] === 'application/json' ? JSON.stringify(requestData) : requestData,
      }),
    });

    const result = await externalResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calling external API:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export const POST = handler;
export const GET = handler;