<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\User;
use Socialite;
use Auth;
use Exception;
use Laravel\Socialite\Two\InvalidStateException;

class SocialAuthGoogleController extends Controller {
  public function redirect() {
    return Socialite::driver('google')->redirect();
  }

  public function callback() {

    try {
      $googleUser = Socialite::driver('google')->user();
      Auth::loginUsingId($googleUser->email);
      if(Auth::check()){ // login success!
        // Auth::loginUsingId($googleUser->email);
        // Auth::user()->avatar = $googleUser->avatar;
        session([
          'name'=> $googleUser->name
          ,'avatar'=> $googleUser->avatar
        ]);
        // Log::info(json_encode($googleUser->avatar));
        return redirect()->to('login'); // our login front-end will set the states as the user is already logged in
      }else{
        return redirect("login?noaccess={$googleUser->email}");
      }

      /**
       * use code below if you wish to implement eloquent
       *
       * $existUser = User::where('email', $googleUser->email)->first();
       * $ipAddress = \Util::ip();
       * if ($existUser) {
       *   Auth::loginUsingId($existUser->id);
       *   $existUser->first_name = $googleUser->user['given_name'];
       *   $existUser->last_name = $googleUser->user['family_name'];
       *   $existUser->full_name = $googleUser->name;
       *   $existUser->avatar = $googleUser->avatar;
       *   $existUser->password = md5(rand(1, 10000));
       *   $existUser->ip = $ipAddress;
       *   $existUser->save();
       * } else {
       *   $user = new User;
       *   $user->first_name = $googleUser->user['given_name'];
       *   $user->last_name = $googleUser->user['family_name'];
       *   $user->full_name = $googleUser->name;
       *   $user->avatar = $googleUser->avatar;
       *   $user->email = $googleUser->email;
       *   $user->google_id = $googleUser->id;
       *   $user->password = md5(rand(1, 10000));
       *   $user->ip = $ipAddress;
       *   $user->save();
       *   $user->assignRole('employee');
       *   Auth::loginUsingId($user->id);
       * }
       * return redirect()->to('/home');
       */
    } catch (InvalidStateException $e) {
      return redirect()->to('auth/google');
    } catch (Exception $e) {
      return 'error: <pre>'.$e."</pre>";
    }
  }

  public function whoami(){
    return response()->json([
      'email' => Auth::id()
      , 'name' => session('name')
      , 'avatar' => session('avatar')
    ]);
  }

  public function logout(){
    Auth::logout();
    session([
      'name' => null, 'avatar' => null
    ]);
    return redirect('login');
  }
}