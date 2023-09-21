<?php

namespace App\Models;

use App\Facades\SparkpostFacade;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
