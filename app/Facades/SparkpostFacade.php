<?php
namespace App\Facades;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

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
          , "meta" => json_encode([
            "origSubject" => $value->msys->relay_message->content->subject
          ])
          , "content" => $value->msys->relay_message->content->text
          , "direction" => "in"
        ];
      }
    }

    return $inboundMessages;
  }

  static function generateConversationID($subject, $to, $from){
    $subject = self::getBaseSubject($subject);
    $arr = [$subject, $to, $from];
    sort($arr);
    $merged = implode($arr);
    $lowered = strtolower($merged);

    $formatted = Str::slug($lowered);

    // $conversationID = uuid_create(UUID_TYPE_NAME, $formatted, $formatted);
    // $conversationID = sha1($formatted);
    // $conversationID = hash('sha256', $formatted);
    // $conversationID = bin2hex($formatted);
    // $conversationID = dechex(crc32($formatted)); // has collisions up to 4 billion
    $conversationID = md5($formatted); // best option so far

    return $conversationID;
  }

  private static function getBaseSubject($subject){
    $string = str_ireplace("re:", "", $subject);
    $string = Str::squish($string);

    return $string;
  }

  public static function sendOutbound($from, $to, $subject, $content){
    $fromName = config('app.name');
    Mail::raw($content, function ($content) use ($to, $subject, $from, $fromName) {
      $content->to($to)
        ->from($from, $fromName)
        ->subject($subject);
    });

    return "Email sent successfully!";
  }
}