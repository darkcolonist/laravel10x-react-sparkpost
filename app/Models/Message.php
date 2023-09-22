<?php

namespace App\Models;

use App\Facades\SparkpostFacade;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

  public static function conversations(){
    // First query: Fetch recent conversations with counts
    $recentConversations = DB::table('messages')
      ->select([
        'conversation_id',
        DB::raw('COUNT(id) as total'),
        DB::raw('SUM(CASE WHEN direction = "in" THEN 1 ELSE 0 END) as total_in'),
        DB::raw('SUM(CASE WHEN direction = "out" THEN 1 ELSE 0 END) as total_out'),
      ])
      ->groupBy('conversation_id')
      ->orderBy('created_at', 'desc')
      ->limit(20)
      ->get();

    // Second query: Fetch latest messages for recent conversations
    $conversationIds = $recentConversations->pluck('conversation_id');
    $latestMessages = DB::table('messages')
      ->select([
        'conversation_id',
        'subject',
        'to',
        'from',
        'created_at',
      ])
      ->whereIn('conversation_id', $conversationIds)
      ->orderBy('created_at', 'desc')
      ->get();

    // Combine conversation data with latest messages
    foreach ($recentConversations as $conversation) {
      $conversation->latest_message = $latestMessages
        ->where('conversation_id', $conversation->conversation_id)
        ->first();
    }

    return $recentConversations;
  }
}
