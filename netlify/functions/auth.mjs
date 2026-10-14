const upstream='https://ep-holy-mode-b5qcgfo9.neonauth.c-7.us-east-2.aws.neon.tech/neondb/auth';
const routes=new Map([['/get-session',['GET']],['/token',['GET']],['/token/anonymous',['GET']],['/email-otp/send-verification-otp',['POST']],['/sign-in/email-otp',['POST']],['/sign-out',['POST']]]);
const noStore={'Cache-Control':'private, no-store','Netlify-CDN-Cache-Control':'no-store'};
export default async function auth(request){
 const url=new URL(request.url),path=url.pathname.slice('/api/auth'.length);
 if(!url.pathname.startsWith('/api/auth/')||!routes.has(path))return new Response('Not found',{status:404,headers:noStore});
 if(!routes.get(path).includes(request.method))return new Response('Method not allowed',{status:405,headers:noStore});
 const origin=request.headers.get('origin');
 if((origin&&origin!==url.origin)||(request.method==='POST'&&!origin)||request.headers.get('sec-fetch-site')==='cross-site')return new Response('Forbidden',{status:403,headers:noStore});
 const headers=new Headers({Accept:'application/json',Origin:url.origin});
 for(const key of ['content-type','cookie']){const value=request.headers.get(key);if(value)headers.set(key,value);}
 try{
 const body=request.method==='POST'?await request.text():undefined;
 if(body&&body.length>8192)return new Response('Request too large',{status:413,headers:noStore});
 const result=await fetch(upstream+path+url.search,{method:request.method,headers,body,redirect:'manual',signal:AbortSignal.timeout(15000)});
 if(result.status>=300&&result.status<400)return new Response('Unexpected auth redirect',{status:502,headers:noStore});
 const responseHeaders=new Headers(noStore);
 for(const key of ['content-type','set-auth-jwt','retry-after']){const value=result.headers.get(key);if(value)responseHeaders.set(key,value);}
 for(const cookie of result.headers.getSetCookie()){
 const parts=cookie.split(';').map(part=>part.trim());
 const safe=parts.filter((part,index)=>index===0||!/^(domain|path|samesite)=/i.test(part)&&!/^(secure|httponly|partitioned)$/i.test(part));
 responseHeaders.append('Set-Cookie',[...safe,'Path=/','SameSite=Lax','Secure','HttpOnly'].join('; '));
 }
 return new Response(result.body,{status:result.status,headers:responseHeaders});
 }catch{return Response.json({message:'登录服务暂时无法连接，请稍后再试。'},{status:502,headers:noStore});}
}
export const config={path:'/api/auth/*'};
