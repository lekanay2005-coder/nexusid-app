import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params.path);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params.path);
}

async function handleProxy(req: NextRequest, pathSegments: string[]) {
  const indexerUrl = process.env.NEXT_PUBLIC_INDEXER_URL || 'http://localhost:4000';
  const path = pathSegments.join('/');
  const url = `${indexerUrl}/api/${path}${req.nextUrl.search}`;

  try {
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text();
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Indexer proxy error' }, { status: 500 });
  }
}
