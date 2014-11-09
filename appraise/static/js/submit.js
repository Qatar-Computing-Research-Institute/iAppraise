    // define the function within the global scope
    var submitForm = function() {

        //eyeTribeData.push('{"task":"val"}');
        //eyeTribeData.push('{"task":"car"}');
        if($('button.btn').text()==' Submit') {

        $("#eyedata").val(eyeTribeData);
        $("#sscore").val($("#output").text());
        var eval = Math.round(Math.abs($("#sscore").val() - $("#oscore").val())/10);

        switch (eval) {
        case 0: $("#feedback").text("** Your Score is great! The actual score is "+Math.round($("#oscore").val()));
          break;
        case 1: $("#feedback").text("** Your Score is good. The actual score is "+Math.round($("#oscore").val()));
          break;
        case 2: $("#feedback").text("** Your Score is Okay. The actual score is "+Math.round($("#oscore").val()));
          break;
        case 3: $("#feedback").text("** Are you allright!. The actual score is "+Math.round($("#oscore").val()));
          break;
        case 4: $("#feedback").text("** Did you have your breakfast today!!. The actual score is "+Math.round($("#oscore").val()));
          break;
        case 5: $("#feedback").text("** Are you insane, you are missing it!!!. The actual score is "+Math.round($("#oscore").val()));
          break;
        default: $("#feedback").text("** Your are loosing it!!! The actual score is "+Math.round($("#oscore").val()));
        }
        //$('.cd-popup').addClass('is-visible');
         $('button.btn').html('<i class="icon-ok"></i> Next');
      }
      else {
        $("#myform").submit();
        $('button.btn').html('<i class="icon-ok"></i> Submit');
      };
    }


