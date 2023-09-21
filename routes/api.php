<?php

use App\Facades\SparkpostFacade;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::get('test', function(){
//   return response()->json(FMLFacade::random());
// });

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth.sparkpost'])->prefix('sparkpost')->group(function () {
  Route::post('receive', function(){
    $inboundMessages = SparkpostFacade::parseInboundMessages(request());
    $result = "";

    if(count($inboundMessages)){
      foreach ($inboundMessages as $anInboundMessageItem) {
        $message = new Message($anInboundMessageItem);
        $message->save();

        $result .= $message->conversation_id . "-" . $message->hash . " OK\n";
      }
      $result = rtrim($result, "\n");
    }else
      $result = "inboundMessages empty";

    Log::channel("appdebug")->info($result);
    return response()->json($result);
  });
});