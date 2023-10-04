<?php

namespace App\Models;

use App\Facades\SparkpostFacade;
use App\Helpers\CollectionHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use Carbon\Carbon;

class Message extends Model
{
  use HasFactory;
  protected $guarded = ['id', 'conversation_id'];

  protected static function boot()
  {
    parent::boot();

    static::creating(function ($message) {
      $message->conversation_id = SparkpostFacade::generateconversationID($message->subject, $message->to, $message->from);
      $message->hash = uniqid();
    });
  }

  private static function recentConversationsSlim(){
    return DB::table('messages')
    ->select([
      'conversation_id',
      DB::raw('MAX(id) as last_id')])
      ->groupBy('conversation_id')
      ->orderBy('last_id', 'desc')
      ->limit(20)
      ->get();
  }

  public static function recentConversations()
  {
    return DB::table('messages')
    ->select([
      'conversation_id',
      DB::raw('MAX(id) as last_id'),
      DB::raw('COUNT(id) as total'),
      DB::raw('SUM(CASE WHEN direction = "in" THEN 1 ELSE 0 END) as total_in'),
      DB::raw('SUM(CASE WHEN direction = "out" THEN 1 ELSE 0 END) as total_out'),
    ])
      ->groupBy('conversation_id')
      ->orderBy('last_id', 'desc')
      ->limit(20)
      ->get();
  }

  public static function latestMessages($conversationIDs)
  {
    $messages = DB::table('messages')
    ->select([
      'conversation_id',
      'subject',
      'to',
      'from',
      'content',
      'created_at',
    ])
      ->whereIn('id', function ($query) use ($conversationIDs) {
        $query->select(DB::raw('MAX(id)'))
        ->from('messages')
        ->whereIn('conversation_id', $conversationIDs)
          ->groupBy('conversation_id');
      })
      ->orderBy('id', 'desc')
      ->get();

    // Format the created_at field using Carbon
    foreach ($messages as $message) {
      $message->created_at = Carbon::parse($message->created_at);
    }

    return $messages;
  }

  private static function getConversationsWithLatestMessagesInitial(){
    $recentConversations = self::recentConversations();
    $conversationIDs = $recentConversations->pluck('conversation_id');
    $latestMessages = self::latestMessages($conversationIDs);

    // Combine conversation data with latest messages
    foreach ($recentConversations as $conversation) {
      $conversation->latest_message = $latestMessages
        ->where('conversation_id', $conversation->conversation_id)
        ->first();
    }

    return $recentConversations;
  }

  private static function getConversationsWithLatestMessagesPolling($lastID){
    $startTime = time();
    $timeout = config("app.long_polling_max_duration"); // Timeout in seconds

    while (true) {
      $lastMessageInDB = self::getLastMessage();

      $equal = $lastMessageInDB->id === $lastID;

      if(!$equal)
        return self::getConversationsWithLatestMessagesInitial();

      // Check if the time limit has exceeded
      $elapsedTime = time() - $startTime;
      if ($elapsedTime >= $timeout) {
        break; // Exit the loop if the time limit is reached
      }

      sleep(1); // Sleep for 1 second before the next iteration
    }
  }

  public static function getConversationsWithLatestMessages($lastID = null)
  {
    if($lastID){
      return self::getConversationsWithLatestMessagesPolling($lastID);
    }

    return self::getConversationsWithLatestMessagesInitial();
  }

  private static function getMessagesByConversationInitial($conversationID){
    return Message::where('conversation_id', $conversationID)
      ->orderBy('id', 'desc')
      ->limit(50)
      ->get();
  }

  private static function getLastMessageByConversation($conversationID){
    return Message::where('conversation_id', $conversationID)
    ->orderBy('id', 'desc')
    ->first();
  }

  private static function getLastMessage(){
    return Message::orderBy('id', 'desc')
      ->first();
  }

  private static function getNextMessagesByConversation($conversationID, $lastID)
  {
    return Message::where('conversation_id', $conversationID)
      ->where('id', '>', $lastID)
      ->orderBy('id', 'desc')
      ->limit(50)
      ->get();
  }

  private static function getMessagesByConversationPolling($conversationID, $lastID){
    $startTime = time();
    $timeout = config("app.long_polling_max_duration"); // Timeout in seconds

    while (true) {
      $lastMessageInDB = self::getLastMessageByConversation($conversationID);

      $equal = $lastMessageInDB->id === $lastID;

      if (!$equal)
        return self::getNextMessagesByConversation($conversationID, $lastID);

      // Check if the time limit has exceeded
      $elapsedTime = time() - $startTime;
      if ($elapsedTime >= $timeout) {
        return [];
      }

      sleep(1); // Sleep for 1 second before the next iteration
    }
  }

  public static function getMessagesByConversation($conversationID, $lastID = null){
    if ($lastID) {
      return self::getMessagesByConversationPolling($conversationID, $lastID);
    }

    return self::getMessagesByConversationInitial($conversationID);
  }

  private static function getLastMessageFromConversationByDirection($conversationID, $direction = 'in'){
    return Message::where('conversation_id', $conversationID)
      ->where('direction', $direction)
      ->orderBy('id', 'desc')
      ->first();
  }

  public static function respondToConversation($rawPostMessage){
    $lastInbound = self::getLastMessageFromConversationByDirection($rawPostMessage["conversation_id"], 'in');

    $message = new Message([
      'to' => $lastInbound['from']
      , 'from' => $lastInbound['to']
      , 'subject' => $lastInbound['subject']
      , 'direction' => 'out'
      , 'content' => $rawPostMessage['message']
    ]);

    SparkpostFacade::sendOutbound(
      $message->from
      , $message->to
      , "Re: ".$message->subject
      , $message->content
    );

    $message->save();

    return $message;
    // return [
    //   ...$rawPostMessage
    //   , "time" => Carbon::now()
    //   // , "last_inbound" => $lastInbound
    //   // , "messageOBJ" => $message
    // ];
  }
}
