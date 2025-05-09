<!DOCTYPE html>
<html lang="en">

<?php $title="Study - Introduction"; include('template/head.php'); ?>

<?php include('template/body.html') ?>

<hr class="featurette-divider">
<div class="row">
    <div class="col-lg-6"  style="text-align: justify;">
    
<h2>Introduction</h2>
<p>
  This study examines how developers learn to write Rust code and which resources they rely on. 
  You will be provided with a code editor to complete the tasks, as well as an in-app web browser to search for resources. 
  Please use the in-app browser for any searches you need, as we're interested in understanding what materials you turn to for help.
</p>

<p>
  You will be tasked with creating four methods for a linked list in Rust:
  <ul>
    <li>printing the list</li>
    <li>inserting a node into a list</li>
    <li>removing a node from a list</li>
    <li>swapping two nodes in the list</li>
  </ul>
</p>

<p>
  We will provide you with the definition of the list and the node and a function to create a new node.
  Nodes have only two variables - a mutable <code>next</code> pointer and an immutable value.
  The <code>new(val: i32)</code> function will return a new node with the provided value and set
  the <code>next</code> pointer to <code>None</code>. We will provide you with function definitions to ensure
  consistency across solutions and make testing simple. We provide you with a set of basic tests to
  aid you in testing for functionality.
</p>

<p>
  You wil have <strong>2 hours</strong> to complete all four tasks. Given this time limit, we suggest
  You complete all the tasks in one go, but you can leave and return to this page at any time. Your progress will
  be saved automatically. However, once the two-hour time limit is reached, your most recently compiled code for
  each task will be submitted, and no further changes will be allowed.
</p>





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
