<?php
namespace App\Facades;

use Goutte\Client;
use Illuminate\Http\Request;

class SparkpostFacade{
  static function parseInboundMessages(Request $request){
    $inboundMessages = [];

    $payLoad = json_decode($request->getContent());

    foreach ($payLoad as $value) {
      if(isset($value->msys->relay_message)){
        $inboundMessages[] = [
          "to" => $value->msys->relay_message->rcpt_to
          , "from" => $value->msys->relay_message->msg_from
          , "subject" => $value->msys->relay_message->content->subject
          , "content" => $value->msys->relay_message->content->text
        ];
      }
    }

    return $inboundMessages;
  }
}