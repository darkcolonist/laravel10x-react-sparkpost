<?php

namespace App\Helpers;

class CollectionHelper
{
  public static function diff($collection1, $collection2, $comparisonFields = null)
  {
    $array1 = json_decode(json_encode($collection1), true);
    $array2 = json_decode(json_encode($collection2), true);

    // If $comparisonFields is null, use all fields from the combined arrays
    if (is_null($comparisonFields)) {
      $combinedFields = array_unique(array_merge(self::getFields($array1), self::getFields($array2)));
      $comparisonFields = array_values($combinedFields);
    }

    // Initialize an empty array to store the differences
    $differences = [];

    // Iterate through $array1
    foreach ($array1 as $item1) {
      $found = false;

      // Iterate through $array2 to find a matching item based on specified fields
      foreach ($array2 as $item2) {
        // Check if all specified fields match
        $fieldsMatch = true;
        foreach ($comparisonFields as $field) {
          if ($item1[$field] !== $item2[$field]) {
            $fieldsMatch = false;
            break;
          }
        }

        if ($fieldsMatch) {
          $found = true;
          break; // Found a match, no need to check further
        }
      }

      // If no match was found, add $item1 to the differences array
      if (!$found) {
        $differences[] = $item1;
      }
    }

    return $differences;
  }

  private static function getFields($array)
  {
    $fields = [];

    foreach ($array as $item) {
      $fields = array_merge($fields, array_keys($item));
    }

    return array_unique($fields);
  }

  public static function areEqual($collection1, $collection2)
  {
    $array1 = json_decode(json_encode($collection1), true);
    $array2 = json_decode(json_encode($collection2), true);

    array_multisort($array1);
    array_multisort($array2);
    return ( serialize($array1) === serialize($array2) );
  }
}
