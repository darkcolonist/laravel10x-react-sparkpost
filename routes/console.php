<?php

use App\Facades\SparkpostFacade;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('test:conversationID', function () {
  $this->comment(SparkpostFacade::generateConversationID(
    "hi :)",
    "a@b.c",
    "b@c.d"
  ));
  $this->comment(SparkpostFacade::generateConversationID(
    "re: hi :)",
    "b@c.d",
    "a@b.c"
  ));

  $this->comment(SparkpostFacade::generateConversationID(
    "hello there",
    "someone@example.net",
    "someone@example.org"
  ));
  $this->comment(SparkpostFacade::generateConversationID(
    "re: hello there",
    "someone@example.org",
    "someone@example.net"
  ));

  $this->comment(SparkpostFacade::generateConversationID(
    "a somewhat long subject line that is destined to hit your inbox one day. do not worry, this may not break your code as it may break the mail server first!!!",
    "someone@example.net",
    "someone@example.org"
  ));
  $this->comment(SparkpostFacade::generateConversationID(
    "re: a somewhat long subject line that is destined to hit your inbox one day. do not worry, this may not break your code as it may break the mail server first!!!",
    "someone@example.org",
    "someone@example.net"
  ));
})->purpose('Display an inspiring quote');

Artisan::command('password:generate {password}', function () {
  $this->comment(Hash::make($this->argument('password')));
})->describe('Generate a password from plaintext');