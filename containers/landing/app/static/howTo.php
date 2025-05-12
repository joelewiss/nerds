<!DOCTYPE html>
<html lang="en">

<?php $title="Study - How To"; include('template/head.php'); ?>

<?php include('template/body.html') ?>

<hr class="featurette-divider">
<div class="row">
    <div class="col-lg-6" style="text-align: justify;">


<h2>Study Instructions</h2>

<video width="1200" height="600" controls>
    <source src="static/video/nerds-demo.webm" type="video/webm">
    <source src="static/video/nerds-demo.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

<p>
  Each task will appear with a task description on the left side of the screen.
  This panel will remain visible while you work, so you can refer back to it at any time.
  At the bottom of the panel, you'll find buttons to navigate between tasks and to submit your code when you're finished.
</p>

<p>
  On the right, you'll find three tabs to help you complete each task:
  <ul>
    <li><strong>Reference:</strong> The definition of the <code>LinkedList</code> and <code>LinkedListNode</code> types you'll be implementing.</li>
    <li><strong>Code:</strong> The space where you'll write and compile your Rust code for each task.</li>
    <li><strong>Browser:</strong> A built-in web browser you can use to look up documentation or other resources. Please use this instead of external browsers.</li>
  </ul>
</p>

<p>
  For each task, we'll provide the function signature you need to implement, along with a set of basic tests 
  to help you verify your code's functionality.
</p>

<p>
  If at any point you want to start over on a task, you can reset the code to its original state 
  by clicking the <code>Reset Code</code> button located in the top-right corner of the editor. 
  This will restore the starter code provided for that task and remove any changes you've made.
</p>

<p>
  When you're ready to test your code, click the green <code>Run</code> button located in the upper-left corner of the editor. 
  This will automatically compile and execute your code using our built-in test suite, and the results will be displayed 
  in the output box at the bottom of the editor.
</p>






<p>Please wait while we start your editor, this will only take a couple of seconds. You can start as soon as the button shows “Start Study.”</p>
</div>
</div>
    <button class="btn btn-lg btn-warning" id="loadingButton">
        <span class="glyphicon glyphicon-refresh spinning"></span> Preparing your notebook...    
    </button>
    <hr class="featurette-divider">

    <script>
    function executeQuery() {
      $.post("getAssignedInstance.php",
        {
            userid: "<?php echo $uniqid; ?>",
            token2: "<?php echo $token2; ?>"
        },
        function(data, status){
            if(data != 'error'){
                if(data.length > 5){
                    $('#loadingButton').html("Start study");
                    $('#loadingButton').removeClass("btn-warning");
                    $('#loadingButton').addClass("btn-success");
                    $('#loadingButton').click(function() {
                       window.location = data;
                    });
                    //window.location = data;
                } else {
                    setTimeout(executeQuery, 5000);
                }
            } else {
                    $('#loadingButton').html("An error occured, please try again later.");
                    $('#loadingButton').removeClass("btn-warning");
                    $('#loadingButton').addClass("btn-danger");
            }
        });
    }

    // run the first time; all subsequent calls will take care of themselves
    setTimeout(executeQuery, 1000);
    </script>


<?php include('template/bodyend.html') ?>

</html>
