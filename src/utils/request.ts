export const clientName = 'MyarnMC Client (https://github.com/myarnmc)'

export const request = async (...args: Parameters<typeof fetch>) => {
  const req: RequestInit = args[1] || {};
  if (!req.headers) req.headers = new Headers();
  
  if (req.headers instanceof Headers) req.headers.set('User-Agent', clientName);
  else if (Array.isArray(req.headers)) req.headers.push(['User-Agent', clientName]);
  else req.headers['User-Agent'] = clientName;

  const response = await fetch(args[0], req);

  if (!response.ok) throw new Error(`Request to ${args[0]} failed.`);

  return response;
}
