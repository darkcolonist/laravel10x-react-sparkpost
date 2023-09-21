<?php
namespace App\Facades;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SparkpostFacade{
  static function parseInboundMessages(Request $request){
    $inboundMessages = [];

    $payLoad = json_decode($request->getContent());

    foreach ($payLoad as $value) {
      if(isset($value->msys->relay_message)){
        $inboundMessages[] = [
          "to" => $value->msys->relay_message->rcpt_to
          , "from" => $value->msys->relay_message->msg_from
          , "subject" => self::getBaseSubject($value->msys->relay_message->content->subject)
          , "origSubject" => $value->msys->relay_message->content->subject
          , "content" => $value->msys->relay_message->content->text
        ];
      }
    }

    return $inboundMessages;
  }

  private static function getBaseSubject($subject){
    $string = str_ireplace("re:", "", $subject);
    $string = Str::squish($string);

    return $string;
  }
}