export const userAgent = 'MyarnMC Client (https://github.com/myarn)'

export const request = async (...args: Parameters<typeof fetch>) => {
  const req: RequestInit = args[1] || {};
  if (!req.headers) req.headers = new Headers();
  
  if (req.headers instanceof Headers) req.headers.set('User-Agent', userAgent);
  else if (Array.isArray(req.headers)) req.headers.push(['User-Agent', userAgent]);
  else req.headers['User-Agent'] = userAgent;

  const response = await fetch(args[0], req);

  if (!response.ok) throw new Error(`Request to ${args[0]} failed.`);

  return response;
};
