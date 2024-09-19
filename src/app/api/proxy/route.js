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

        // Create a new FormData object for the external request
        const externalFormData = new FormData();
        formData.forEach((value, key) => {
          if (value instanceof File) {
            externalFormData.append(key, value);
          } else {
            externalFormData.append(key, value);
          }
        });

        headers = {
          Authorization: request.headers.get('authorization'),
        };

        // Send the request with the FormData directly
        const externalResponse = await fetch(apiUrl, {
          method,
          headers,
          body: externalFormData,
        });

        const result = await externalResponse.json();
        return NextResponse.json(result);

      } else {
        // Handle JSON
        const body = await request.json();
        apiUrl = body.apiUrl;
        requestData = body.requestData || {};
        headers = {
          'Content-Type': 'application/json',
          ...body.headers,
        };

        // Send the request with JSON body
        const externalResponse = await fetch(apiUrl, {
          method,
          headers,
          body: JSON.stringify(requestData),
        });

        const result = await externalResponse.json();
        return NextResponse.json(result);
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

      // Send the request with GET method
      const externalResponse = await fetch(apiUrl, {
        method,
        headers,
      });

      const result = await externalResponse.json();
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Error calling external API:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export const POST = handler;
export const GET = handler;