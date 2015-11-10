var activeRegion = 0;
var timeRegion = 0;
var eyeTribeData = [];
var timeouts =[];
var eyeTribeActive = 0;
var eyeTrackReplay = 0;
var stoppedReplay = 0;
var counter = 0;
var mouseX = 0;
var mouseY = 0;
var mouseXX=0;
var mouseYY=0;

var isChrome= navigator.userAgent.indexOf("Chrome") != -1 ;
var isFirefox= navigator.userAgent.indexOf("Firefox") != -1 ;

var zoom=function(){return window.devicePixelRatio;};
var getScaling=function(){ 
        if(isFirefox){
          return zoom() ;}
          else{return 1;}
        };
$(function(){

  var shadows =[];
  var iosocket = io.connect('http://localhost:8080');

  var c    = document.getElementById("myCanvas");
  var ctx  = c.getContext('2d');
  var rc   =  document.getElementById("myRCanvas");
  var rctx = rc.getContext('2d');

  document.onmousemove = function(e){
                    mouseX  = e.pageX;
                    mouseY  = e.pageY;
                    mouseYY = e.screenY;
                    mouseXX = e.screenX;
                   }


  $(".eyeTracking").each(function() {

      elem = $(this);
      x = elem.offset().left
      y = elem.offset().top
      width = elem.width()
      height = elem.height()    
      console.log("Creating shadow for object:" + elem.attr("id"));
      //shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id"),elem.text()));
      //shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id")));
      //shadows.push('{x:'+x+',y:'+y+',width:'+width+',height:'+height+',id:'+elem.attr("id")+',text:div}');
      shadows.push(new shadowObject(x,y,width,height,elem.attr("id"),"div"));
      text=elem.text().split(" ")
      elem.text("")
      
      var totalsamples=  text.length;
      var subsamples = Math.max(3,Math.min(0.2 * totalsamples,10));
      var sampledindices =[];
      for (j =0; j<subsamples; j++)
      { 
        sampledindices.push(Math.floor(Math.random()*totalsamples))
      }
      console.log(sampledindices)

      var sampled_counter = 0
      for (word in text)
      {
          newdiv=  document.createElement("span");
          if (sampledindices.indexOf(sampled_counter) !=-1)
          {
            $(newdiv).attr('class',"eyeTrackingWord sampled");
            console.log("Sampled")

          }
          else
          {
            $(newdiv).attr('class',"eyeTrackingWord");
          }
          $(newdiv).attr('id',elem.attr("id")+"_"+word);
          $(newdiv).attr('isViewed',false);
          $(newdiv).text(text[word]+" ");
          elem.append(newdiv);
          sampled_counter ++;
          //elem.append(" ");
      }
     

     
  });

  $(".eyeTrackingWord").each(function() {

      elem = $(this);
      x = elem.offset().left
      y = elem.offset().top
      width = elem.width()
      height = elem.height()    
      //console.log("Creating shadow for object:" + JSON.stringify(elem)+" at ");
      console.log("Created object at:" + x+","+ y + ":"+ elem.width() + ","+ elem.height()+"::"+elem.attr("id")+"::"+elem.text());
      //shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id"),elem.text()));
      //shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id")));
      //shadows.push('{x:'+x+',y:'+y+',width:'+width+',height:'+height+',id:'+elem.attr("id")+',text:'+elem.text()+'}');
      shadows.push(new shadowObject(x,y,width,height,elem.attr("id"),elem.text()));
      new eyetrackObject(elem);
      //$("#eyedatamap").val(JSON.stringify(shadows)); 
  });

  $("#eyedatamap").val(JSON.stringify(shadows));

  var myCanvasDraw = function( ){
      if(eyeTribeActive == 1) {
          ctx.fillStyle= "#ffe629" ;
          ctx.beginPath();
          ctx.arc(50,50,50,0,2*Math.PI);
          ctx.fillStyle= "#ffe629"; 
          ctx.fillRect(50,50,3,3);
          ctx.fill(); 
        }
  };
  
  var myCanvasMove = function(x,y ){
      if(eyeTribeActive == 1) {
          //var canvas = $("#canvasWrapper");
          x = x * window.screen.availWidth/1680 - window.screenX;
          y = y * window.screen.availHeight/1050 -window.screenY - $("div:first").height() + $(window).scrollTop();
          var canvas = document.getElementById("canvasWrapper");
          console.log("Move canvas to :" + x +","+ y )       
          canvas.style.left= x +'px';
          canvas.style.top = y +'px';
          myCanvasDraw();

        }
  };
  var myCanvasMove_Orig = function(x,y ){
      if(eyeTribeActive == 1) {
          var canvas = $("#canvasWrapper");
          var canvas = document.getElementById("canvasWrapper");
          canvas.style.left= (x-50) +'px';
          canvas.style.top = (y-50) +'px';
          myCanvasDraw();

        }
  };

  var myRDraw = function(h,w){
      if(eyeTribeActive == 1) {
          rctx.beginPath();
          rctx.rect(0,0,w,h);
          rctx.fillStyle= "#f06629"; 
          rctx.fill();
	        rctx.lineWidth = 0;
	        rctx.strokeStyle = "black";
	        rctx.stroke();
        }
  };
  
  var myRMove = function(x,y,h,w ){
      if(eyeTribeActive == 1) {
          var rcanvas = $("#RWrapper");
          var rcanvas = document.getElementById("RWrapper");
          var xrcanvas = document.getElementById("myRCanvas");
          xrcanvas.width=x;
	        xrcanvas.height=y;
          rcanvas.style.left= x +'px';
          rcanvas.style.top = y +'px';
          myRDraw(h,w);

        }
  };
  //var msg_manager=document.createElement("div");
  //$(msg_manager).attr("id","msg_manager");
  function shadowObject(x,y,w,h,id,text){
    var self = this;
    self.x=x;
    self.y=y;
    self.width=w;
    self.height=h;
    self.id=id;
    self.text=text;

  }
  function gazeObject(id,x,y,zoom,scrollx,scrolly,div0_height,innerHeight,outerHeight,clientWidth,eyedata,scaling)
  {
     self=this;
     self.region=id;
     self.gazex = x;
     self.gazey=y;
     self.zoom = zoom;
     self.scrollx= scrollx;
     self.scrolly=scrolly;
     self.div0Height= div0_height;
     self.innerHeight=innerHeight;
     self.outerHeight=outerHeight;
     self.clientWidth=clientWidth;
     self.data=eyedata;
     self.scaling=scaling;
     self.isViewed=false;
   }
     
  function eyetrackObject(elem) {  //,text
      var self = this;
      this.elem = elem;
      
      //self.x = function(){return self.elem.offset().left - parseInt(self.elem.css('padding-left'),10)*zoom(); }
      //self.y = function(){return self.elem.offset().top - parseInt(self.elem.css('padding-top'),10)*zoom();}
      

      self.x = function(){return self.elem.offset().left;  - parseInt(self.elem.css('padding-left'),10)}
      self.y = function(){return self.elem.offset().top  - parseInt(self.elem.css('padding-top'),10);}

//      self.width=function(){return Math.round((self.elem.width() +( (parseInt(self.elem.css('padding-left'),10)+parseInt(self.elem.css('padding-right'),10))*zoom())));}
//      self.height = function(){return Math.round((self.elem.height() +( (parseInt(self.elem.css('padding-top'),10)+parseInt(self.elem.css('padding-bottom'),10))*zoom())));}
      
     self.width=function(){return Math.round((self.elem.width()+ (parseInt(self.elem.css('padding-left'),10)+parseInt(self.elem.css('padding-right'),10))));}
     self.height = function(){return Math.round((self.elem.height()+ (parseInt(self.elem.css('padding-top'),10)+parseInt(self.elem.css('padding-bottom'),10))));} 


      $("#myCanvas").on('handleEyeTrack',function(e,gazeObj) {
          
          self.id = $(self.elem).attr("id");
          gaze={x:gazeObj.gazex,y:gazeObj.gazey};


          // perform hit test between bounding box 
          // and mouse coordinates
          var cTime = new Date().getTime();

          /*gazeObj= new gazeObject( 
            self.id,
            gaze.x,
            gaze.y,
            cTime,
            zoom(),
            window.scrollX,
            window.scrollY,
            $('div:first').height(),
            Math.round(window.innerHeight*getScaling()),
            Math.round(window.outerHeight*getScaling()),
            Math.round(document.body.clientWidth*getScaling()),
            $("#eyedatafull").val(),
            getScaling()));*/

          //eyeTribeData.push('{"Region":"'+ self.id + '","gazeX":"'+gaze.x+ '","gazeY":"'+gaze.y+'","time":"'+cTime+'","zoom":"'+zoom()+'","ScrollX":"'+window.scrollX+'","ScrollY":"'+window.scrollY+'","Div_first":"'+$('div:first').height()+'","innerHeight":"'+Math.round(window.innerHeight*getScaling())+'","outerHeight":"'+Math.round(window.outerHeight*getScaling())+'","clientWidth":"'+Math.round(document.body.clientWidth*getScaling())+'","data":'+$('#eyedatafull').val()+'}');   

          if ( self.x() <= gaze.x &&
               self.x() + self.width() >= gaze.x &&
               self.y() <= gaze.y &&
               self.y() + self.height() >= gaze.y) {
                 
                  // hit test succeeded, handle the gaze event!
                $(self.elem).attr("isViewed",true);
                gazeObj.isViewed=true;
                gazeObj.region =self.id;
 
                  if (eyeTribeActive == 1)
                    if($(self.elem).attr("class") == "eyeTrackingWord" || $(self.elem).attr("class") == "eyeTrackingWord sampled"){
                      $(self.elem).css("background","#F09E7E");
                      $(self.elem).css("border","1px solid #666");
                      //myRMove(self.x(),self.y(),self.height(), self.width());
                    }
 

              
                  //console.log("You looked at this:" + self.x() +","+ self.y() + ":"+self.width()+ "," + self.height()+ ","+self.id+",mouseX:"+mouseX+";mouseY:"+mouseY);
	            
                  var additionalInfo =""; 
                  //additionalInfo = ",'divclientWidth':'"+$("#"+self.id).clientWidth+"','divclientHeight':'"+$("#"+self.id).clientHeight+"'";
                  //additionalInfo = additionalInfo + ",'divclientLeft':'"+$("#"+self.id).clientLeft+"','divclientTop':'"+$("#"+self.id).clientTop+"'");
                  //additionalInfo = additionalInfo + ",'divscrollWidth':'"+$("#"+self.id).scrollWidth+"','divscrollHeight':'"+$("#"+self.id).scrollHeight+"'");
                  //additionalInfo = additionalInfo + ",'divscrollLeft':'"+$("#"+self.id).scrollLeft+"','divscrollTop':'"+$("#"+self.id).scrollTop+"'");
                  //additionalInfo = additionalInfo + ",'divoffsetWidth':'"+$("#"+self.id).offsetWidth+"','divoffsetHeight':'"+$("#"+self.id).offsetHeight+"'");
                  //additionalInfo = additionalInfo + ",'divoffsetLeft':'"+$("#"+self.id).offsetLeft+"','divoffsetTop':'"+$("#"+self.id).offsetTop+"'");
        
                  //eyeTribeData.push('{"Region":"'+ self.id + '","time":"'+cTime+'","mouseX":"'+mouseX+'","mouseY":"'+mouseY+'","mouseXX":"'+mouseXX+'","mouseYY":"'+mouseYY+'","ScreenHeight":"'+Math.round(screen.height*window.devicePixelRatio)+'","ScreenWidth":"'+Math.round(screen.width*window.devicePixelRatio)+'","zoom":"'+zoom()+'","ScreenX":"'+window.screenX+'","ScreenY":"'+window.screenY+'","ScrollX":"'+window.scrollX+'","ScrollY":"'+window.scrollY+'","Div_first":"'+$('div:first').height()+'","innerHeight":"'+Math.round(window.innerHeight*getScaling())+'","outerHeight":"'+Math.round(window.outerHeight*getScaling())+'","clientWidth":"'+Math.round(document.body.clientWidth*getScaling())+'","clientHeight":"'+Math.round(document.body.clientHeight*getScaling())+'","data":'+$('#eyedatafull').val()+'}');         
                  
                  return true;
                }

          
          // hit test did not succeed
          

          return false;
      });
  }

  iosocket.on('connect', function () {
      $('#incomingChatMessages').append($('<li>Connected</li>'));

      iosocket.on('message', function(message) {
          var curRegion  = "Out";
          var curRegionColor = "#ffe629";
          if(($('#submit_button').text()!=' Submit') ||  ($('#submit_stop_button').text()!=' Stop Recording'))
              return;
          var fullobj = jQuery.parseJSON( message );
          $("#eyedatafull").val(message);
          var obj = fullobj.values.frame.avg;
          var curTime = new Date().getTime();
          if( obj != null &&  $('#submit_button').text() != ' Next') {
              if(obj.x=='0' && obj.y=='0') { 
                  $("#feedback").html("<img src='/appraise/files/img/Blind_signal.png' width='40'> Error reading the Eye Tracking signal!!!");
              } else {
                $("#feedback").text("");
              var d = document.getElementById("canvasWrapper");  

              var objX = (obj.x - window.screenX*getScaling())/zoom() +window.scrollX  - 7.45/window.devicePixelRatio;
              var objY = (obj.y - window.screenY*getScaling() - (window.outerHeight -window.innerHeight)*getScaling() )/zoom() +window.scrollY + 5.1/window.devicePixelRatio;

              gaze={x:objX,y:objY};
              gazeObj= new gazeObject( 
              null,
              gaze.x,
              gaze.y,
              zoom(),
              window.scrollX,
              window.scrollY,
              $('div:first').height(),
              Math.round(window.innerHeight*getScaling()),
              Math.round(window.outerHeight*getScaling()),
              Math.round(document.body.clientWidth*getScaling()),
              fullobj,
              getScaling());
              //gaze ={x:mouseXX,y:mouseYY};
              eyeTribeData.push(gazeObj);

              //myCanvasMove(gaze.x,gaze.y); 
              if (eyeTribeActive == 1) {
                $(".eyeTrackingWord").css("background","transparent");
		            $(".eyeTrackingWord").css("border","0px");
              }
              
                $("#myCanvas").trigger('handleEyeTrack',[gazeObj]);
              
          }
        }
         
      });
      

      iosocket.on('disconnect', function() {
          //$('#incomingChatMessages').append('<li>Disconnected</li>');
      });
  });

  $('#outgoingChatMessage').keypress(function(event) {
      if(event.which == 13) {
          event.preventDefault();
          iosocket.send($('#outgoingChatMessage').val());
          //$('#incomingChatMessages').append($('<li></li>').text($('#outgoingChatMessage').val()));
          $('#outgoingChatMessage').val('');
      }
  });


  

});

function ChangeStatus() {

    //alert("Change status!!!"+eyeTribeActive);
    if (eyeTribeActive == 1) {

      eyeTribeActive = 0;
      $("#myCanvas").width(0);
      $("#myRCanvas").width(0);
      $("#updateEyeTrack").text("EyeTracking On");

    } else {

      eyeTribeActive = 1;
      $("#myCanvas").width(100);
      //$("#myRCanvas").width(100);
      $("#updateEyeTrack").text("EyeTracking Off");
    }

  }
function delayedAlert() {
  timeoutID = window.setTimeout(slowAlert, 4000);
}
function stopReplay(){

  stoppedReplay =1;
  for (var i=0; i<timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
  timeouts.length=0; // clear the array  
  $("#view_button").prop('disabled', false);

}
function slowAlert(d,i) {
  $(".eyeTrackingWord").css("background","transparent");
  $(".eyeTracking").css("background","transparent");            
  $("#"+d).css("background","#ffeeaa");
  //$("#feedback").text($("#feedback").text()+":"+i);
}


  function viewForm() {

    var obj_trackdata;
    var milliseconds = 1000;
    var tcounter = 0;
    var startTime = 0;
    stoppedReplay = 0;

    //alert ($("#trackdata").val());
    $("#view_button").prop('disabled', true);
    eyeTribeActive = 1;
    speedReplay = $('#speedlist option:selected').val();
    $("#feedback").text("Running at "+$('#speedlist option:selected').text()+" speed "+tcounter);
    obj_trackdata = jQuery.parseJSON("{\"data\":["+$("#eyedata").val()+"]}");
    $.each($.parseJSON("{\"data\":["+$("#eyedata").val()+"]}"), function (item, value) {
        $.each(value, function (i, object) {
           var tactiveRegion;
           var ttimeRegion;
           var c;

           if(tcounter ==0)
                startTime   = object.time;



           tcounter= tcounter+1;

           ttimeRegion   = (object.time-startTime)/100;

           //$("#feedback").text("Running at "+$('#speedlist option:selected').text()+" speed!!"+" :: "+i+" :: "+obj_trackdata.data.length+" Records");
           c = tcounter*100;
           if(object.data.values.frame.fix != "false")
           switch($('#datalist option:selected').val()) {
            case 'left': 
                  var obj = object.data.values.frame.lefteye.avg;
                  timeouts.push(window.setTimeout(function () {  
                                                    var b = myCanvasMove(obj.x,obj.y);
                                                    $("#feedback").text("Running at "+$('#speedlist option:selected').text()+" speed!!"+" :: "+(i+1)+" :: "+obj_trackdata.data.length+" Records");
                                                    console.log("Processing "+obj.x+":"+obj.y+" From data");  
                                                }, 
                                                tcounter*ttimeRegion/speedReplay));
                  
                break;
            case 'right': 
                  var obj = object.data.values.frame.righteye.avg;
                  timeouts.push(window.setTimeout(function () {
                                                    var b = myCanvasMove(obj.x,obj.y);
                                                    $("#feedback").text("Running at "+$('#speedlist option:selected').text()+" speed!!"+" :: "+(i+1)+" :: "+obj_trackdata.data.length+" Records");
                                                    console.log("Processing "+obj.x+":"+obj.y+" From data");  
                                                }, 
                                                tcounter*ttimeRegion/speedReplay));
                  
                break;
            case 'avg': 
                  tactiveRegion = object.Region;
                  var obj = object.data.values.frame.avg;
                  var objR = object.data.values.frame.righteye.avg;
                  var objL = object.data.values.frame.lefteye.avg;
                  timeouts.push(window.setTimeout(function () {
                                                    var b = myCanvasMove(obj.x,obj.y);
                                                    var r = myCanvasMoveR(objR.x,objR.y);
                                                    var l = myCanvasMoveL(objL.x,objL.y);
                                                    $("#feedback").text("Running at "+$('#speedlist option:selected').text()+" speed!!"+" :: "+(i+1)+" :: "+obj_trackdata.data.length+" Records");
                                                    console.log("Processing "+obj.x+":"+obj.y+" From data");
                                                    if(tactiveRegion.indexOf("_")>1)
                                                    slowAlert(tactiveRegion, c*ttimeRegion/speedReplay);  
                                                }, 
                                                tcounter*ttimeRegion/speedReplay));
                break;
                
            case 'words': 
                  tactiveRegion = object.Region;
                  $("#feedback").text("Running at "+$('#speedlist option:selected').text()+" speed "+tcounter+" time:"+c*ttimeRegion/speedReplay);
                  if(tactiveRegion.indexOf("_")>1)
                    timeouts.push(window.setTimeout(
                        function () {
                        slowAlert(tactiveRegion, c*ttimeRegion/speedReplay); 
                        $("#feedback").text("Running at "+$('#speedlist option:selected').text()+" speed!!"+" :: "+(i+1)+" :: "+obj_trackdata.data.length+" Records"); 
                        }, 
                        tcounter*ttimeRegion/speedReplay
                      ));
                break;

            default: 
                  tactiveRegion = object.Region;
                  timeouts.push(window.setTimeout(
                    function () {
                      slowAlert(tactiveRegion, c*ttimeRegion/speedReplay);
                    }, 
                    tcounter*ttimeRegion/speedReplay
                   ));
          }
            //$("#"+activeRegion).css("background","#ffeeaa");
            prevTime = ttimeRegion;
        });

    });
    //$("#view_button").prop('disabled', false);
  }
    
  function ReplayStatus() {

    //alert("Change status!!!"+eyeTribeActive);
    if (eyeTrackReplay == 1) {

      eyeTrackReplay = 0;
      $("#myCanvas").width(0);
      $("#myRCanvas").width(0);      
      $("#replayEyeTrack").text("Replay on");
      $("#view_button").prop('disabled', false);

    } else {

      eyeTrackReplay = 1;
      $("#myCanvas").width(100);
      //$("#myRCanvas").width(100);
      $("#replayEyeTrack").text("Replay off");
      $("#view_button").prop('disabled', true);


    }

  }

    // define the function within the global scope
   function submitForm() {

        //eyeTribeData.push('{"task":"val"}');
        //eyeTribeData.push('{"task":"car"}');
        if($('#submit_button').text()==' Submit') {

        $("#eyedata").val(JSON.stringify(eyeTribeData));
        $("#eyedatamap").val($("#eyedatamap").val());

        $("#sscore").val($("#output").text());
        var eval = Math.round(Math.abs($("#sscore").val() - $("#hscore").val())/10);
        var precision=0; 
        var total=$(".sampled").length
        $(".sampled").each(function () {
          // we go over all sampled words
          elem = $(this);
          if (elem.attr('isviewed')=="true"){
            precision+=1;
          }
        })
        
        precision/=total;
        precision*=100;
        $("#sscore").val(Math.round(precision*100)/100);
        console.log(precision);

	if($('#submit_button').text!="Next")
        /*switch (eval) {
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
        }*/
        //$('.cd-popup').addClass('is-visible');
         $('#submit_button').html('<i class="icon-ok"></i> Next');
         $("#feedback").text("Precision: " + precision +" % out of " + total + " highlighted words" );
      }
      else {
        $("#myform").submit();
        $('#submit_button').html('<i class="icon-ok"></i> Submit');
      };
    }

  // define the function within the global scope
   function SubmitStopForm() {
        //eyeTribeData.push('{"task":"val"}');
        //eyeTribeData.push('{"task":"car"}');
      if($('#submit_stop_button').text()==' Stop Recording') {
         eyeTrackReplay = 1;
        //$('.cd-popup').addClass('is-visible');
         $("#eyedata").val(JSON.stringify(eyeTribeData));
         $("#eyedatamap").val($("#eyedatamap").val());
         $("#view_button").prop('disabled', false);
         $('#submit_stop_button').html('<i class="icon-ok"></i> Resume');
         document.getElementById('replayBlc').style.display = 'block';
      } else
      if($('#submit_stop_button').text()==' Resume'){
        $('#submit_stop_button').html('<i class="icon-ok"></i> Stop Recording');
        $('#submit_button').html('<i class="icon-ok"></i> Submit');
         
        document.getElementById('replayBlc').style.display = 'none';
        $("#myform").onsubmit = function() {
          return false;
        }
      }
    }



