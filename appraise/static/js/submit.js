    // define the function within the global scope
   function submitForm() {


        //eyeTribeData.push('{"task":"val"}');
        //eyeTribeData.push('{"task":"car"}');
        if($('button.btn').text()==' Submit') {

        $("#eyedata").val(eyeTribeData);
        $("#eyedatamap").val($("#eyedatamap").val());

        $("#sscore").val($("#output").text());
        var eval = Math.round(Math.abs($("#sscore").val() - $("#hscore").val())/10);

        switch (eval) {
        case 0: //$("#feedback").text("** Your Score is great! The actual score is "+Math.round($("#hscore").val()));
                $("#feedback").html("<img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/star.jpg'>");
          break;
        case 1: //$("#feedback").text("** Your Score is good! The actual score is "+Math.round($("#hscore").val()));
                $("#feedback").html("<img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/estar.jpg'>");
          break;
        case 2: //$("#feedback").text("** Your Score is okay. The actual score is "+Math.round($("#hscore").val()));
                $("#feedback").html("<img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'>");
          break;
        case 3: //$("#feedback").text("** Are you allright.. The actual score is "+Math.round($("#hscore").val()));
                $("#feedback").html("<img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'>");
          break;
        case 4: //$("#feedback").text("** Did you have your breakfast today??. The actual score is "+Math.round($("#hscore").val()));
                $("#feedback").html("<img src='/appraise/files/img/star.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'>");
          break;
        case 5: //$("#feedback").text("** You are loosing it!!!. The actual score is "+Math.round($("#hscore").val()));
                $("#feedback").html("<img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'>");
          break;
        default: //$("#feedback").text("** Your are loosing it!!! The actual score is "+Math.round($("#hscore").val()));
                $("#feedback").html("<img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'><img src='/appraise/files/img/estar.jpg'>");
        }
        //$('.cd-popup').addClass('is-visible');
         $('button.btn').html('<i class="icon-ok"></i> Next');
      }
      else {
        $("#myform").submit();
        $('button.btn').html('<i class="icon-ok"></i> Submit');
      };
    }


