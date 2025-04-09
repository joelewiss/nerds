<!DOCTYPE html>
<html lang="en">

<?php $title="Study - Introduction"; include('template/head.php'); ?>

<?php include('template/body.html') ?>

<hr class="featurette-divider">
<div class="row">
    <div class="col-lg-6"  style="text-align: justify;">
        <p><h2>Introduction</h2></p>
            <p>This study is about how programmers learn to write Rust code and what kinds of
aids they find useful. We will ask you to complete some programming tasks. We
will also provide you with an in-app web browser to search for resources.</p>

            <p>There will be four tasks. <b>How long are we giving participants?</b></p>

    </div>
</div>
<form id="continue_form" method="post" action="howTo.php">
    <div id="recaptcha" class="g-recaptcha"
    data-sitekey="<?php echo $reCaptchaSiteKey; ?>"
    data-size="invisible"
    data-callback="onReCaptcha"
    ></div>
    <input type="hidden" id="pid" name="pid" value="<?php echo $pid ?>">
    <input type="hidden" id="origin" name="origin" value="<?php echo $originParam ?>">
    <button type="submit" class="btn btn-default" id="submit-btn">Continue</button>
</form>

<hr class="featurette-divider">

<?php include('template/bodyend.html') ?>

<script type="text/javascript">
  $("#submit-btn").click((e) => {
    grecaptcha.execute();
    e.preventDefault();
  });

  function onReCaptcha(resp) {
      $("#continue_form")[0].submit();
  }
</script>

<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<html>
