<?
function doEdit($data) {
	global $errorCode;

	$ch = null;

	// First fetch the username
	$res = doApiQuery( array(
		'format' => 'json',
		'action' => 'query',
		'meta' => 'userinfo',
	), $ch );

	if ( isset( $res->error->code ) && $res->error->code === 'mwoauth-invalid-authorization' ) {
		// We're not authorized!
		echo 'You haven\'t authorized this application yet! Go <a href="' . htmlspecialchars( $_SERVER['SCRIPT_NAME'] ) . '?action=authorize">here</a> to do that.';
		echo '<hr>';
		return;
	}

	if ( !isset( $res->query->userinfo ) ) {
		header( "HTTP/1.1 $errorCode Internal Server Error" );
		echo 'Bad API response: <pre>' . htmlspecialchars( var_export( $res, 1 ) ) . '</pre>';
		exit(0);
	}
	if ( isset( $res->query->userinfo->anon ) ) {
		header( "HTTP/1.1 $errorCode Internal Server Error" );
		echo 'Not logged in. (How did that happen?)';
		exit(0);
	}
	$page = 'User talk:' . $res->query->userinfo->name;

	// Next fetch the edit token
	$res = doApiQuery( array(
		'format' => 'json',
		'action' => 'tokens',
		'type' => 'edit',
	), $ch );
	if ( !isset( $res->tokens->edittoken ) ) {
		header( "HTTP/1.1 $errorCode Internal Server Error" );
		echo 'Bad API response: <pre>' . htmlspecialchars( var_export( $res, 1 ) ) . '</pre>';
		exit(0);
	}
	$token = $res->tokens->edittoken;

    // add the token to $data
    $data['token'] = $token;
	// Now perform the edit
	$res = doApiQuery( $data, $ch );
    return $res;
	// echo 'API edit result: <pre>' . htmlspecialchars( var_export( $res, 1 ) ) . '</pre>';
	// echo '<hr>';
}

$post = $_POST;
$filename = $post['filename'] ?? '';
$url = $post['url'] ?? '';

$data = [
    'action' => 'upload',
    'format' => 'json',
    'filename' => $filename,
    // 'file' => $post['file'],
    'comment' => $post['comment'] ?? '',
    // 'title' => $post['title'],
    // 'text' => $post['text'],
    'url' => $url,
];

if ($filename != '' && $url != '') {
    $uu = doEdit($data);
    var_export($uu, 1);
}

?>