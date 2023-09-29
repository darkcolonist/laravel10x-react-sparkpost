<?php

namespace App\Http\Controllers;

use App\Facades\ConversationFacade;
use App\Facades\FMLFacade;
use App\Models\Message;
use Illuminate\Http\Request;

class MessagesController extends Controller
{
  public function send()
  {
    return response()->json(Message::respondToConversation(request()->all())
      , 200);
  }

  // /**
  //  * TODO not implemented
  //  */
  // public function fetch()
  // {
  //   $lastMessage = ConversationFacade::fetch(session()->getId(), request()->get('lastID'));
  //   return response()->json($lastMessage, 200);
  // }

  public function history()
  {
    $messages = Message::getMessagesByConversation(request()->input('conversation'));

    if(count($messages))
      return response()->json($messages, 200);

    return response()->json("empty resultset", 404);
  }

  /**
  * Display a listing of the resource.
  */
  public function index()
  {
    //
  }

  /**
  * Show the form for creating a new resource.
  */
  public function create()
  {
    //
  }

  /**
  * Store a newly created resource in storage.
  */
  public function store(Request $request)
  {
    //
  }

  /**
  * Display the specified resource.
  */
  public function show(string $id)
  {
    //
  }

  /**
  * Show the form for editing the specified resource.
  */
  public function edit(string $id)
  {
    //
  }

  /**
  * Update the specified resource in storage.
  */
  public function update(Request $request, string $id)
  {
    //
  }

  /**
  * Remove the specified resource from storage.
  */
  public function destroy(string $id)
  {
    //
  }
}
