<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class SparkpostWebhookAuth
{
  const TOKEN_HEADER = "X-MessageSystems-Webhook-Token";

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
      if(!env('SPARKPOST_WEBHOOK_KEY', false))
        return $next($request);

      $authenticated = Str::of(env('SPARKPOST_WEBHOOK_KEY'))
        ->exactly($request->header(self::TOKEN_HEADER));

      if(!$authenticated){
        Log::info([
          'sparkpost api failure'
          , $request->ip()
          , self::TOKEN_HEADER.":".$request->header(self::TOKEN_HEADER)
        ]);
        return response('unauthorized', 401);
      }

      return $next($request);
    }
}
