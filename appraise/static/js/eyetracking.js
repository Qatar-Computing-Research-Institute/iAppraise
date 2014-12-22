var activeRegion = 0;
var timeRegion = 0;
var eyeTribeData = [];
var eyeTribeActive = 0;
var eyeTrackReplay = 0;
var counter = 0;
var mouseX = 0;
var mouseY = 0;


$(function(){
  var shadows =[];
  var iosocket = io.connect('http://localhost:8080');
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext('2d');


  $(".eyeTracking").each(function() {

      elem = $(this);
      x = elem.offset().left
      y = elem.offset().top
      width = elem.width()
      height = elem.height()    
      console.log("Creating shadow for object:" + elem);
      //shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id"),elem.text()));
      shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id")));      
      text=elem.text().split(" ")
      elem.text("")
      for (word in text)
      {
          newdiv=  document.createElement("span");
          $(newdiv).attr('class',"eyeTrackingWord");
          $(newdiv).attr('id',elem.attr("id")+"_"+word);
          $(newdiv).text(text[word]);
          elem.append(newdiv);
          elem.append(" ");
      }
     

     
  });

  $(".eyeTrackingWord").each(function() {

      elem = $(this);
      x = elem.offset().left
      y = elem.offset().top
      width = elem.width()
      height = elem.height()    
      console.log("Creating shadow for object:" + elem+" at ");
      //shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id"),elem.text()));
      shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id")));

  });

  var myCanvasDraw = function( ){
      if(eyeTribeActive == 1) {
          //ctx.fillStyle= col ;
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
          var canvas = document.getElementById("canvasWrapper");
          //console.log("Move canvas to :" + x +","+ y )       
          //canvas.style.left= x +'px';
          //canvas.style.top = y +'px';
          //myCanvasDraw();

        }
  };

  //var msg_manager=document.createElement("div");
  //$(msg_manager).attr("id","msg_manager");

  function eyetrackObject(x, y, width, height,id) {  //,text
      var self = this;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      //this.text = text;
      this.id=id;
      //console.log("Created object at:" + x+","+ y + ":"+ width + ","+ height+":"+text);
      console.log("Created object at:" + x+","+ y + ":"+ width + ","+ height);
      $("#eyedatamap").val(JSON.stringify(shadows));
      // gaze parameter holds the eye coordinates
      $("#myCanvas").on('handleEyeTrack',function(e,gaze) {
          //console.log("got the event" + gaze.x +", "+ gaze.y);
          //console.log(self + self.x +"," + self.y)
          
          // perform hit test between bounding box 
          // and mouse coordinates
          var cTime = new Date().getTime();
          if (self.x <= gaze.x &&
              self.x + self.width >= gaze.x &&
              self.y <= gaze.y &&
              self.y + self.height >= gaze.y) {
              document.onmousemove = function(e){
               mouseX = e.pageX;
               mouseY = e.pageY;
              }
              // hit test succeeded, handle the gaze event!
              if (eyeTribeActive == 1)
               if($("#"+self.id).attr("class") == "eyeTrackingWord"){
                $("#"+self.id).css("background","#ffeeaa");
               }
              console.log("You looked at this:" + self.x +","+ self.y + ":"+self.width+ "," + self.height+ ","+self.id);
	      var additionalInfo =""; 
              //additionalInfo = ",'divclientWidth':'"+$("#"+self.id).clientWidth+"','divclientHeight':'"+$("#"+self.id).clientHeight+"'";
              //additionalInfo = additionalInfo + ",'divclientLeft':'"+$("#"+self.id).clientLeft+"','divclientTop':'"+$("#"+self.id).clientTop+"'");
              //additionalInfo = additionalInfo + ",'divscrollWidth':'"+$("#"+self.id).scrollWidth+"','divscrollHeight':'"+$("#"+self.id).scrollHeight+"'");
              //additionalInfo = additionalInfo + ",'divscrollLeft':'"+$("#"+self.id).scrollLeft+"','divscrollTop':'"+$("#"+self.id).scrollTop+"'");
              //additionalInfo = additionalInfo + ",'divoffsetWidth':'"+$("#"+self.id).offsetWidth+"','divoffsetHeight':'"+$("#"+self.id).offsetHeight+"'");
              //additionalInfo = additionalInfo + ",'divoffsetLeft':'"+$("#"+self.id).offsetLeft+"','divoffsetTop':'"+$("#"+self.id).offsetTop+"'");
   
              eyeTribeData.push("{'Region':'"+ self.id +"','time':'"+cTime+"','mouseX':'"+mouseX+"','mouseY':'"+mouseY+"','data':"+$("#eyedatafull").val()+"}");         
              return true;
          }

          
          // hit test did not succeed
          return false;
      });
  }

  iosocket.on('connect', function () {
      $('#incomingChatMessages').append($('<li>Connected</li>'));

      iosocket.on('message', function(message) {
          //$('#incomingChatMessages').append($('<li></li>').text(message));
          var curRegion  = "Out";
          var curRegionColor = "#ffe629";

          var fullobj = jQuery.parseJSON( message );
          $("#eyedatafull").val(message);
          var obj = fullobj.values.frame.avg;
          var curTime = new Date().getTime();
          if( obj != null &&  $('button.btn').text() != ' Next') {
              if(obj.x=='0' && obj.y=='0') { 
                  $("#feedback").html("<img src='/appraise/files/img/Blind_signal.png' width='40'> Error reading the Eye Tracking signal!!!");
              } else {
                $("#feedback").text("");
              var d = document.getElementById("canvasWrapper");  
              //gaze={x:(obj.x-50-0),y:(obj.y-50-50-Math.log(obj.y))};
              //gaze={x:obj.x ,y:obj.y};
              gaze={x:(obj.x - window.screenX),y:(obj.y -window.screenY - $("div:first").height() + $(window).scrollTop() )};
              myCanvasMove(gaze.x,gaze.y);
              if (eyeTribeActive == 1)
              $(".eyeTrackingWord").css("background","transparent");
              $("#myCanvas").trigger('handleEyeTrack',[gaze]);
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
      //$("#myCanvas").width(0);
      $("#updateEyeTrack").text("EyeTracking On");

    } else {

      eyeTribeActive = 1;
      //$("#myCanvas").width(100);
      $("#updateEyeTrack").text("EyeTracking Off");
    }

  }

  function ReplayStatus() {

    //alert("Change status!!!"+eyeTribeActive);
    if (eyeTrackReplay == 1) {

      eyeTrackReplay = 0;
      //$("#myCanvas").width(0);
      $("#replayEyeTrack").text("Replay on");

    } else {

      eyeTrackReplay = 1;
      //$("#myCanvas").width(100);
      $("#replayEyeTrack").text("Replay off");
    }

  }
