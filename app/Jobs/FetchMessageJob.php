<?php

namespace App\Jobs;

use App\Facades\ConversationFacade;
use App\Facades\FMLFacade;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class FetchMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  var $message = 'NA';
  var $conversationID = 'NA';

    /**
     * Create a new job instance.
     */
    public function __construct($message, $conversationID)
    {
      // Log::channel("appdebug")->info($message." quing");
      $this->message = $message["message"];
      $this->conversationID = $conversationID;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
      $message;
      if(config('app.third_party_messages_api_enabled'))
        // separate this soon to a different facade as we might use
        // other 3rd party messages api based on message
        $message = FMLFacade::random();
      else
        $message = uniqid();

      // Log::channel("appdebug")->info($this->conversationID);
      sleep(rand(0,config('app.receive_job_delay_max_seconds'))); // for testing
      $message .= "\n[response to: ".$this->message."]";
      ConversationFacade::receive($message, $this->conversationID);
    }
}
