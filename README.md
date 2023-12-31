<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Laravel10x + React + Sparkpost In And Out Simulation
### sparkpost process
* create sending domain
* verify sending domain (DKIM/SPF)
* begin setting up inbound domain
* add mx records
* create inbound domain using rest api client (i used postman)
* create relay webhook using rest api client (i used postman)
* send an email to domain
* verify that endpoint receives email

### database queue
```
.env
  DB_CONNECTION=sqlite
  DB_DATABASE=/absolute/path/to/database.sqlite
  QUEUE_CONNECTION=database

bash
  touch /absolute/path/to/database.sqlite
  php artisan migrate
  php artisan queue:work
```

### useful links
* https://support.sparkpost.com/docs/tech-resources/inbound-email-relay-webhook
* https://developers.sparkpost.com/api/relay-webhooks/
* https://developers.sparkpost.com/api/#header-endpoints
* https://app.sparkpost.com/webhooks/details/26f4c480-56c7-11ee-b479-f5e781c43c13/test (requires sparkpost login)