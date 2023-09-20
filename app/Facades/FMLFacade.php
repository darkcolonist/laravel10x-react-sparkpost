<?php
namespace App\Facades;

use Goutte\Client;

class FMLFacade{
  static function random(){
    $client = new Client();

    try {
      $crawler = $client->request('GET', 'https://www.fmylife.com/random');
      // $fmlEntry = $crawler->filter('.panel-content p.block a')->text();
      // $fmlEntry = $crawler->filter('a.block')->text();
      $fmlEntry = $crawler->filter('div#content a.block')->text();

      return $fmlEntry;
    } catch (\Exception $e) {
      // return $e->getMessage();

      // Handle any errors that occur during the scraping process
      return "we're having a scraping problem :(";
    }
  }
}