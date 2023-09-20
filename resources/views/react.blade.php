<!doctype html>
<html>
  <head>
    <script>
      const SESSION_ID="{{session()->getId()}}";
      const APP_NAME="{{config("app.name")}}";
      const APP_URL="{{config("app.url")}}";
      const APP_ENV="{{config("app.env")}}";
      const APP_DEBUG="{{config("app.debug")}}";
      const APP_VISITOR="{{request()->getClientIP()}}";
      const WIDGET_MAX_MESSAGES="{{config("app.widget_max_messages")}}";
      const ONE_MESSAGE_AT_A_TIME="{{config("app.one_message_at_a_time")}}";
      const PAGE_LOAD="{{date("r")}}";
    </script>

    @viteReactRefresh
    @vite('resources/js/bootstrap.jsx')
  </head>
  <body>
    <div id="root">
      javascript must be enabled
    </div>
  </body>
<html>