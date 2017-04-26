<?php
/**
 * Yelp Fusion API code sample.
 *
 * This program demonstrates the capability of the Yelp Fusion API
 * by using the Business Search API to query for businesses by a
 * search term and location, and the Business API to query additional
 * information about the top result from the search query.
 *
 * Please refer to http://www.yelp.com/developers/v3/documentation
 * for the API documentation.
 *
 * Sample usage of the program:
 * `php sample.php --term="dinner" --location="San Francisco, CA"`
 */

$error = false;
// OAuth credential placeholders that must be filled in by users.
// You can find them on
// https://www.yelp.com/developers/v3/manage_app
define( 'CLIENT_ID', 'aZoS8TThDELadH3-NQVD1g' );
define( 'CLIENT_SECRET', 'rrbxrRqjXUs4t8so5q8kgTagIXkuML5wp8oWT1e7HDnnAObv9GtlZpiYObk6xgl3' );

// Complain if credentials haven't been filled out.
if( ! defined( 'CLIENT_ID' ) && empty( CLIENT_ID ) )
    $error = "Please supply your client_id.";

if( ! defined( 'CLIENT_SECRET' ) && empty( CLIENT_SECRET ) )
    $error = "Please supply your client_secret.";

// API constants, you shouldn't have to change these.
define( 'API_HOST', "https://api.yelp.com" );
define( 'SEARCH_PATH', "/v3/businesses/search" );
define( 'BUSINESS_PATH', '/v3/businesses/' );
define( 'TOKEN_PATH', "/oauth2/token" );
define( 'GRANT_TYPE', "client_credentials" );
define( 'SEARCH_LIMIT', 1 );
define( 'BUSINESS_CATEGORY', 'tattoo' );

/**
 * Given a bearer token, send a GET request to the API.
 *
 * @return   OAuth bearer token, obtained using client_id and client_secret.
 */
function obtain_bearer_token() {
    try {
        # Using the built-in cURL library for easiest installation.
        # Extension library HttpRequest would also work here.
        $curl = curl_init();
        if (FALSE === $curl)
            throw new Exception('Failed to initialize');
        $postfields = "client_id=" . CLIENT_ID .
            "&client_secret=" . CLIENT_SECRET .
            "&grant_type=" . GRANT_TYPE;
        curl_setopt_array($curl, array(
            CURLOPT_URL => API_HOST . TOKEN_PATH,
            CURLOPT_RETURNTRANSFER => true,  // Capture response.
            CURLOPT_ENCODING => "",  // Accept gzip/deflate/whatever.
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $postfields,
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache",
                "content-type: application/x-www-form-urlencoded",
            ),
        ));
        $response = curl_exec($curl);
        if (FALSE === $response)
            throw new Exception(curl_error($curl), curl_errno($curl));
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if (200 != $http_status)
            throw new Exception($response, $http_status);
        curl_close($curl);
    } catch(Exception $e) {
        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);
    }
    $body = json_decode($response);
    $bearer_token = $body->access_token;
    return $bearer_token;
}

/**
 * Makes a request to the Yelp API and returns the response
 *
 * @param    $bearer_token   API bearer token from obtain_bearer_token
 * @param    $host    The domain host of the API
 * @param    $path    The path of the API after the domain.
 * @param    $url_params    Array of query-string parameters.
 * @return   The JSON response from the request
 */
function request($bearer_token, $host, $path, $url_params = array()) {
    // Send Yelp API Call
    try {
        $curl = curl_init();
        if (FALSE === $curl)
            throw new Exception('Failed to initialize');
        $url = $host . $path . "?" . http_build_query($url_params);
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,  // Capture response.
            CURLOPT_ENCODING => "",  // Accept gzip/deflate/whatever.
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "authorization: Bearer " . $bearer_token,
                "cache-control: no-cache",
            ),
        ));
        $response = curl_exec($curl);
        if (FALSE === $response)
            throw new Exception(curl_error($curl), curl_errno($curl));
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        if (200 != $http_status)
            throw new Exception($response, $http_status);
        curl_close($curl);
    } catch(Exception $e) {
        trigger_error(sprintf(
            'Curl failed with error #%d: %s',
            $e->getCode(), $e->getMessage()),
            E_USER_ERROR);
    }
    return $response;
}

/**
 * Query the Search API by a search term and location
 *
 * @param    $bearer_token   API bearer token from obtain_bearer_token
 * @param    $term        The search term passed to the API
 * @param    $location    The search location passed to the API
 * @return   The JSON response from the request
 */
function search($bearer_token, $term, $location) {
    $url_params = array();

    $url_params['term'] = $term;
    $url_params['latitude'] = $location['latitude'];
    $url_params['longitude'] = $location['longitude'];
    $url_params['limit'] = SEARCH_LIMIT;
    $url_params['categories'] = BUSINESS_CATEGORY;

    return request($bearer_token, API_HOST, SEARCH_PATH, $url_params);
}

/**
 * Query the Business API by business_id
 *
 * @param    $bearer_token   API bearer token from obtain_bearer_token
 * @param    $business_id    The ID of the business to query
 * @return   The JSON response from the request
 */
function get_business($bearer_token, $business_id) {
    $business_path = BUSINESS_PATH . urlencode($business_id);

    return request($bearer_token, API_HOST, $business_path);
}
/**
 * Queries the API by the input values from the user
 *
 * @param    $term        The search term to query
 * @param    $location    The location of the business to query
 */
function query_api($term, $location) {
    $return = array(
        'status' => 'success',
        'found_results' => 0,
        'results' => ''
    );

    $bearer_token = obtain_bearer_token();
    $response = json_decode(search($bearer_token, $term, $location));

    $return['found_results'] = count($response->businesses);

    $allowed_fields = array(
        'image_url',
        'url',
        'phone',
        'display_phone'
    );

    if( $return['found_results'] > 0 ) {

        $business_id = $response->businesses[0]->id;

        $response = json_decode(get_business($bearer_token, $business_id));

        foreach( $response as $key => $value ) {
            if( in_array( $key, $allowed_fields ) )
                $return['results'][$key] = $value;
        }
    }

    return $return;
}

/**
 * User input is handled here
 */
$search_term = isset( $_GET['search_term'] ) ? $_GET['search_term'] : false;
$latitude = isset( $_GET['latitude'] ) ? $_GET['latitude'] : false;
$longitude = isset( $_GET['longitude'] ) ? $_GET['longitude'] : false;

if( ! $search_term || ! $latitude || ! $longitude )
    $error = "You must provide all required parameters!";

$search_location = array(
    'latitude' => $latitude,
    'longitude' => $longitude
);

if( $error ) {
    $json_res = array(
        'status' => 'error',
        'message' => $error
    );
}
else {
    $json_res = query_api($search_term, $search_location);
}

header( 'Content-Type: application/json; charset=UTF-8' );
echo $_GET['callback'] . '(' . json_encode($json_res) . ')';