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

Route::get('/', function () {
    return view('react');
});

Route::prefix('message')->group(function(){
  Route::post('send', [App\Http\Controllers\MessagesController::class, 'send']);
  Route::post('history', [App\Http\Controllers\MessagesController::class, 'history']);
  Route::post('fetch', [App\Http\Controllers\MessagesController::class, 'fetch']);

  // Route::get('history', [App\Http\Controllers\MessagesController::class, 'history']); // testing only
});