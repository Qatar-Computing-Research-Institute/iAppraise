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
      //x = elem.offset().left
      //y = elem.offset().top
      //width = elem.width()
      //height = elem.height()    
      console.log("Creating shadow for object:" + elem);
      //shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id"),elem.text()));
      shadows.push(new eyetrackObject(elem));      
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
      //x = elem.offset().left
      //y = elem.offset().top
      //width = elem.width()
      //height = elem.height()    
      console.log("Creating shadow for object:" + JSON.stringify(elem)+" at ");
      //shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id"),elem.text()));
      //shadows.push(new eyetrackObject(x,y,width,height,elem.attr("id")));
      shadows.push(new eyetrackObject(elem));

  });

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
          var canvas = $("#canvasWrapper");
          var canvas = document.getElementById("canvasWrapper");
          console.log("Move canvas to :" + x +","+ y )       
          canvas.style.left= x +'px';
          canvas.style.top = y +'px';
          myCanvasDraw();

        }
  };

  //var msg_manager=document.createElement("div");
  //$(msg_manager).attr("id","msg_manager");

  function eyetrackObject(elem) {  //,text
      var self = this;
      this.elem = elem;
      self.x = self.elem.offset().left;
      self.y = self.elem.offset().top;
      self.width = self.elem.width()*window.devicePixelRatio;
      self.height = self.elem.height()*window.devicePixelRatio;
      self.id = $(self.elem).attr("id");
      //this.text = text;
      //console.log("Created object at:" + x+","+ y + ":"+ width + ","+ height+":"+text);
      console.log("Created object at:" + self.x+","+ self.y + ":"+ self.width + ","+ self.height);
      //$("#eyedatamap").val(JSON.stringify(shadows));
      // gaze parameter holds the eye coordinates
      $(elem).on('click',function(e) {
        self.x = self.elem.offset().left;
      self.y = self.elem.offset().top;
      self.width = self.elem.width()*window.devicePixelRatio;
      self.height = self.elem.height()*window.devicePixelRatio;
      self.id = $(self.elem).attr("id");
        console.log("offsets:X "+(e.screenX-e.pageX)+" Y "+(e.screenY-e.pageY));
        console.log("You hovered over  this:" + self.x +","+ self.y + ":"+self.width+ "," + self.height+ ","+self.id+",mouseX:"+e.pageX+";mouseY:"+e.pageY+ " mouseXX" +e.screenX + " mouseYY" +e.screenY);
      });
      $("#myCanvas").on('handleEyeTrack',function(e,gaze) {
          //console.log("got the event" + gaze.x +", "+ gaze.y);
          //console.log(self + self.x +"," + self.y)
          self.x = self.elem.offset().left;
          self.y = self.elem.offset().top;
          self.width = self.elem.width()*window.devicePixelRatio;
          self.height = self.elem.height()*window.devicePixelRatio;
          self.id = $(self.elem).attr("id");
          // perform hit test between bounding box 
          // and mouse coordinates
          var cTime = new Date().getTime();
          if ( self.x <= gaze.x &&
               self.x + self.width >= gaze.x &&
              self.y <= gaze.y &&
               self.y + self.height >= gaze.y) {
              document.onmousemove = function(e){
               mouseX = e.pageX;
               mouseY = e.pageY;
              }
              // hit test succeeded, handle the gaze event!
              if (eyeTribeActive == 1)
               if($(self.elem).attr("class") == "eyeTrackingWord"){
                 $(self.elem).css("background","#ffeeaa");
               }
              console.log("You looked at this:" + self.x +","+ self.y + ":"+self.width+ "," + self.height+ ","+self.id+",mouseX:"+mouseX+";mouseY:"+mouseY);
	      var additionalInfo =""; 
              //additionalInfo = ",'divclientWidth':'"+$("#"+self.id).clientWidth+"','divclientHeight':'"+$("#"+self.id).clientHeight+"'";
              //additionalInfo = additionalInfo + ",'divclientLeft':'"+$("#"+self.id).clientLeft+"','divclientTop':'"+$("#"+self.id).clientTop+"'");
              //additionalInfo = additionalInfo + ",'divscrollWidth':'"+$("#"+self.id).scrollWidth+"','divscrollHeight':'"+$("#"+self.id).scrollHeight+"'");
              //additionalInfo = additionalInfo + ",'divscrollLeft':'"+$("#"+self.id).scrollLeft+"','divscrollTop':'"+$("#"+self.id).scrollTop+"'");
              //additionalInfo = additionalInfo + ",'divoffsetWidth':'"+$("#"+self.id).offsetWidth+"','divoffsetHeight':'"+$("#"+self.id).offsetHeight+"'");
              //additionalInfo = additionalInfo + ",'divoffsetLeft':'"+$("#"+self.id).offsetLeft+"','divoffsetTop':'"+$("#"+self.id).offsetTop+"'");
   
              eyeTribeData.push("{'Region':'"+ self.id +"','time':'"+cTime+"','mouseX':'"+mouseX+"','mouseY':'"+mouseY+"','ScreenHeight':'"+Math.round(screen.height*window.devicePixelRatio)+"','ScreenWidth':'"+Math.round(screen.width*window.devicePixelRatio)+"','zoom':'"+window.devicePixelRatio+"','ScreenX':'"+window.screenX+"','ScreenY':'"+window.screenY+"','ScrollX':'"+window.scrollX+"','ScrollY':'"+window.scrollY+"','Div_first':'"+$("div:first").height()+"','innerHeight':'"+window.innerHeight+"','outerHeight':'"+window.outerHeight+"','clientWidth':'"+document.body.clientWidth+"','clientHeight':'"+document.body.clientHeight+"','clientLeft':'"+document.body.clientLeft+"','clientTop':'"+document.body.clientTop+"','scrollWidth':'"+document.body.scrollWidth+"','scrollHeight':'"+document.body.scrollHeight+"','scrollLeft':'"+document.body.scrollLeft+"','scrollTop':'"+document.body.scrollTop+"','offsetWidth':'"+document.body.offsetWidth+"','offsetHeight':'"+document.body.offsetHeight+"','offsetLeft':'"+document.body.offsetLeft+"','offsetTop':'"+document.body.offsetTop+"','data':"+$("#eyedatafull").val()+"}");         
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
              
              var objX = obj.x/window.devicePixelRatio + window.scrollX - window.screenX - 7.45/window.devicePixelRatio;
              var objY = obj.y/window.devicePixelRatio + window.scrollY - window.screenY +(window.innerHeight - window.outerHeight) + 5.1/window.devicePixelRatio;

              var objX2 = obj.x/window.devicePixelRatio + window.scrollX - window.screenX - 7.45/window.devicePixelRatio;
              var objY2 = obj.y/window.devicePixelRatio + window.scrollY - window.screenY +(window.innerHeight - window.outerHeight) + 5.1/window.devicePixelRatio;

              gaze2={x:objX2,y:objY2};

              gaze={x:objX,y:objY};
              myCanvasMove((gaze.x-50)/window.devicePixelRatio,(gaze.y-50)/window.devicePixelRatio);
              if (eyeTribeActive == 1)
              $(".eyeTrackingWord").css("background","transparent");
              $("#myCanvas").trigger('handleEyeTrack',[gaze2]);
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
      $("#updateEyeTrack").text("EyeTracking On");

    } else {

      eyeTribeActive = 1;
      $("#myCanvas").width(100);
      $("#updateEyeTrack").text("EyeTracking Off");
    }

  }

  function ReplayStatus() {

    //alert("Change status!!!"+eyeTribeActive);
    if (eyeTrackReplay == 1) {

      eyeTrackReplay = 0;
      $("#myCanvas").width(0);
      $("#replayEyeTrack").text("Replay on");

    } else {

      eyeTrackReplay = 1;
      $("#myCanvas").width(100);
      $("#replayEyeTrack").text("Replay off");
    }

  }
