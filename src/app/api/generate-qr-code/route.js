import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    const qrCodeDataUrl = await QRCode.toDataURL(url, { width: 200, errorCorrectionLevel: 'H' });

    return NextResponse.json({ qrCodeDataUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
