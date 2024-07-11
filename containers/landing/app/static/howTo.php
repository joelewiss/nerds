<!DOCTYPE html>
<html lang="en">

<?php $title="Study - How To"; include('template/head.php'); ?>

<?php include('template/body.html') ?>

<hr class="featurette-divider">
<div class="row">
    <div class="col-lg-6" style="text-align: justify;">


<h2>Study Instructions</h2>

<p>For this study, you will be tasked with completing a linked list
implementation emulating a shopping list. You will be asked to implement four
different tasks in an online C editor:

<ul>
<li>adding an item to the list</li>
<li>updating an item in the list</li>
<li>removing an item in the list</li>
<li>swapping two items in the list.</li>
</ul></p>

<p>Before you implement each task, you will be presented with five AI generated
code suggestions to help you complete that task. You must choose one of the
five suggestions to serve as the starting point for your implementation. Before
selecting and editing any suggestion, please read the task description
carefully. Once you find a suggestion that you would like to use, press the
“pick” button. Once you select a suggestion, you will be able to edit, compile,
run, and test the code.</p>

<p>If you find that for any reason you are unable to complete a particular
task, please click the button labeled “Skip Task." We appreciate your effort!
You can stop and return to the study at any point; your progress is
automatically saved. To return to the study, click on the original link given
to you by the study administrators using the same computer you used to start
the study. We use cookies to track your progress, so please ensure they are
enabled for our site.</p>


<h2>Need to look something up? Do it within the app</h2>
<p>If you need to use any online resources to complete this task, please use
the in-study browser window provided to you. You can find this browser window
by clicking on the second tab at the top of the page. Please do any and all
searches for this study in this browser window, to allow us to understand what
resources you are using.</p>


<p>Please wait while we start your editor, this will only take a couple of seconds. You can start as soon as the button shows “Start Study.”</p>
        </div>
        <div class="col-lg-6">
            <img src="static/img/example_interface.png" style="width:100%;border:1px solid black" alt="Screenshot of study interface" />
            <p>Interface screenshot</p>
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
