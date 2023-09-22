<?php

namespace App\Models;

use App\Facades\SparkpostFacade;
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
      $message->conversation_id = SparkpostFacade::generateConversationID($message->subject, $message->to, $message->from);
      $message->hash = uniqid();
    });
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

  public static function latestMessages($conversationIds)
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
      ->whereIn('id', function ($query) use ($conversationIds) {
        $query->select(DB::raw('MAX(id)'))
        ->from('messages')
        ->whereIn('conversation_id', $conversationIds)
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

  public static function getConversationsWithLatestMessages()
  {
    $recentConversations = self::recentConversations();
    $conversationIds = $recentConversations->pluck('conversation_id');
    $latestMessages = self::latestMessages($conversationIds);

    // Combine conversation data with latest messages
    foreach ($recentConversations as $conversation) {
      $conversation->latest_message = $latestMessages
        ->where('conversation_id', $conversation->conversation_id)
        ->first();
    }

    return $recentConversations;
  }

  public static function getMessagesByConversation($conversationId){
    return Message::where('conversation_id', $conversationId)
      ->orderBy('id', 'desc')
      ->limit(50)
      ->get();
  }
}
