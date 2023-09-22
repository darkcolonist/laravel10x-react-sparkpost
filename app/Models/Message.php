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
    return DB::table('messages')
      ->select([
        'messages.conversation_id',
        'messages.subject',
        'messages.to',
        'messages.from',
        'messages.created_at',
        DB::raw('COUNT(messages.id) as total'),
        DB::raw('SUM(CASE WHEN messages.direction = "in" THEN 1 ELSE 0 END) as total_in'),
        DB::raw('SUM(CASE WHEN messages.direction = "out" THEN 1 ELSE 0 END) as total_out')
      ])
      ->join(DB::raw('(SELECT MAX(created_at) AS max_created_at, conversation_id FROM messages GROUP BY conversation_id) latest'), function ($join) {
        $join->on('messages.conversation_id', '=', 'latest.conversation_id');
        $join->on('messages.created_at', '=', 'latest.max_created_at');
      })
      ->orderBy('messages.id', 'desc')
      ->limit(20)
      ->get();
  }
}
