<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/auth/google', [App\Http\Controllers\SocialAuthGoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [App\Http\Controllers\SocialAuthGoogleController::class, 'callback']);
Route::get('/auth/google/logout', [App\Http\Controllers\SocialAuthGoogleController::class, 'logout']);
Route::post('/auth/google/whoami', [App\Http\Controllers\SocialAuthGoogleController::class, 'whoami']);

Route::group(['middleware' => ['auth']], function(){
  Route::prefix('message')->group(function(){
    Route::post('send', [App\Http\Controllers\MessagesController::class, 'send']);
    Route::post('history', [App\Http\Controllers\MessagesController::class, 'history']);
  });

  Route::post('sparkpost/conversations', [App\Http\Controllers\SparkpostMessageController::class, 'conversations']);
  Route::resource('sparkpost', App\Http\Controllers\SparkpostMessageController::class);
});

Route::get('/{any}', function () {
  return view('react');
})->where('any', '.*');