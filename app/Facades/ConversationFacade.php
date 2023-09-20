<?php
namespace App\Facades;

use App\Jobs\FetchMessageJob;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ConversationFacade{
  static function send($message, $conversationID)
  {
    $message = self::addToCache($message, "out", $conversationID);

    // fetch response
    // $totalMessagesInCache = self::addToCache(FMLFacade::random(), "in", $conversationID);
    // $totalMessagesInCache = self::addToCache("[".uniqid()."] response for ".$message, "in", $conversationID);
    FetchMessageJob::dispatch($message, $conversationID)->onQueue('default');
    return $message;
  }

  static function receive($message, $conversationID){
    $message = self::addToCache($message, "in", $conversationID);

    Log::channel("appdebug")->info(json_encode([
      $message,
      $conversationID,
      'added to cache'
    ]));

    return $message;
  }

  private static function getCacheKey($conversationID)
  {
    return "message_". $conversationID;
  }

  // private static function getCacheKeyLatest($conversationID)
  // {
  //   return self::getCacheKey($conversationID) . "_latest";
  // }

  // private static function addToLatestMessageCache($messageArray, $conversationID){
  //   $latestKey = self::getCacheKeyLatest($conversationID);
  //   Cache::put($latestKey, $messageArray, config('app.cache_messages_expiry'));
  // }

  private static function addToCache($message, $type, $conversationID)
  {
    $key = self::getCacheKey($conversationID);
    $existing = Cache::get($key, []);
    $id = 1;

    // Remove the oldest message if the array exceeds the limit
    if (count($existing) >= config('app.cache_max_messages_per_session')) {
      array_shift($existing);
    }

    if(count($existing) && isset($existing[count($existing) - 1]["id"]))
      $id = $existing[count($existing)-1]["id"];

    $messageArray;
    if(is_array($message)){
      $messageArray = [
        "id" => $id + 1,
        "message" => $message["message"],
        "meta" => $message["meta"],
        "type" => $type,
        "time" => date('r')
      ];
    }else{
      $messageArray = [
        "id" => $id + 1,
        "message" => $message,
        "type" => $type,
        "time" => date('r')
      ];
    }

    $existing[] = $messageArray;

    Cache::put($key, $existing, config('app.cache_messages_expiry'));

    // if this is an "in" message, we will add to latest for the long
    // polling to pull later
    // if($type === 'in'){
    //   self::addToLatestMessageCache($messageArray, $conversationID);
    // }


    return $messageArray;
  }

  static function history($conversationID)
  {
    $key = self::getCacheKey($conversationID);
    return Cache::get($key, []);
  }

  /**
   * LONG POLLING
   */
  // static function fetch($conversationID, $lastID)
  // {
  //   // Log::channel('appdebug')->info("fetch poller started by ".session()->getId());
  //   $startTime = time();
  //   $timeout = config("app.long_polling_max_duration"); // Timeout in seconds

  //   while (true) {
  //     // Perform your operations here
  //     $lastMessage = Cache::pull(self::getCacheKeyLatest($conversationID), false);

  //     if($lastMessage){
  //       // Log::channel('appdebug')->info($lastMessage["message"] . " has been pulled from cache");
  //       return $lastMessage;
  //     }

  //     // Check if the time limit has exceeded
  //     $elapsedTime = time() - $startTime;
  //     if ($elapsedTime >= $timeout) {
  //       break; // Exit the loop if the time limit is reached
  //     }

  //     // Optionally, you can sleep for a certain duration before the next iteration
  //     sleep(1); // Sleep for 1 second before the next iteration
  //   }
  // }

  private static function fetchLatestByID($conversationID, $lastID)
  {
    $history = self::history($conversationID);

    // Filter messages based on ID greater than $lastID
    $filteredMessages = array_filter($history, function ($message) use ($lastID) {
      return $message['id'] > $lastID;
    });

    // Reset the array keys
    $filteredMessages = array_values($filteredMessages);

    // Return the filtered messages
    return $filteredMessages;
  }

  static function fetch($conversationID, $lastID)
  {
    // Log::channel('appdebug')->info("fetch poller started by ".session()->getId());
    $startTime = time();
    $timeout = config("app.long_polling_max_duration"); // Timeout in seconds

    while (true) {
      // Perform your operations here
      $lastMessages = self::fetchLatestByID($conversationID, $lastID);

      if (count($lastMessages)) {
        // Log::channel('appdebug')->info($lastMessage["message"] . " has been pulled from cache");
        return $lastMessages;
      }

      // Check if the time limit has exceeded
      $elapsedTime = time() - $startTime;
      if ($elapsedTime >= $timeout) {
        break; // Exit the loop if the time limit is reached
      }

      // Optionally, you can sleep for a certain duration before the next iteration
      sleep(1); // Sleep for 1 second before the next iteration
    }
  }
}