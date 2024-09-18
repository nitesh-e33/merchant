import { NextResponse } from 'next/server';
export async function POST(request) {
  const { apiUrl, requestData, headers } = await request.json();
  try {
    const externalResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(requestData),
    });

    const result = await externalResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calling external API:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const apiUrl = searchParams.get('apiUrl');
  const queryParams = searchParams.get('queryParams') || '';
  const authorizationHeader = request.headers.get('authorization');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: authorizationHeader,
  };

  try {
    const externalResponse = await fetch(`${apiUrl}?${queryParams}`, {
      method: 'GET',
      headers,
    });

    const result = await externalResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calling external API:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
