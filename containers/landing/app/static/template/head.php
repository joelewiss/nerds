<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="">
  <meta name="author" content="">
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  <link href="/static/css/main.css" rel="stylesheet">
  
<?php 
  if (!empty($title)) {
    echo "<title>$title</title>";
  }
  if($webpageRedirect){
    echo '<meta http-equiv="refresh" content="'.$webpageRedirectTime.';url='.$webpageRedirectUrl.'" />';
  }
?>
</head>
