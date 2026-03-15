import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const call = await req.json();
  
  const { name, args } = call;

  let result: any = { status: "success" };

  if (name === 'getWeather') {
    const location = args.location || 'Unknown';
    result = {
      location,
      temperature: Math.floor(Math.random() * 30) + 10, // 10 to 40
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 50) + 30 + '%'
    };
  } else if (name === 'getCryptoPrice') {
    const symbol = (args.symbol || 'BTC').toUpperCase();
    const basePrice = symbol === 'BTC' ? 65000 : symbol === 'ETH' ? 3500 : 100;
    result = {
      symbol,
      price: `$${(basePrice + (Math.random() * basePrice * 0.05)).toFixed(2)}`,
      change24h: `${(Math.random() * 10 - 5).toFixed(2)}%`
    };
  } else {
    result = { error: `Function ${name} not implemented.` };
  }

  return NextResponse.json(result);
}
