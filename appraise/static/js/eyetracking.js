var activeRegion = 0;
var timeRegion = 0;
var eyeTribeData = [];
var eyeTribeActive = 0;

$(function(){
  var iosocket = io.connect('http://192.168.0.107:8080');
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext('2d');
  var shadows =[];



  $(".eyeTracking").each(function() {

      elem = $(this);
      x = elem.offset().left
      y = elem.offset().top
      width = elem.width()
      height = elem.height()    
      console.log("Creating shadow for object:" + elem);
      shadows.push(new eyetrackObject(x,y,width,height));
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
      console.log("Creating shadow for object:" + elem);
      shadows.push(new eyetrackObject(x,y,width,height));
     
  });

  var myCanvasDraw = function( ){
      if(eyeTribeActive == 1) {
          //ctx.fillStyle= col ;
          ctx.beginPath();
          ctx.arc(50,50,50,0,2*Math.PI);
          ctx.fillStyle= "#ffe629"; 
          ctx.fill(); 

          ctx.fillStyle="#000000";
          ctx.fillRect(50,50,3,3);
          

        }
  };
  var myCanvasMove = function(x,y ){
      if(eyeTribeActive == 1) {
          var canvas = $("#canvasWrapper");
          canvas.style.left=x;
          canvas.style.top=y;


        }
  };

  var msg_manager=document.createElement("div");

  function eyetrackObject(x, y, width, height) {
      var self = this;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      console.log("Created object at:" + x+","+ y + ":"+ width + ","+ height);
      
      // gaze parameter holds the eye coordinates
      $(msg_manager).on('handleEyeTrack',function(e,gaze) {
          //console.log("got the event" + gaze.x +", "+ gaze.y);
          //console.log(self + self.x +"," + self.y)
          
          // perform hit test between bounding box 
          // and mouse coordinates

          if (self.x <= gaze.x &&
              self.x + self.width >= gaze.x &&
              self.y <= gaze.y &&
              self.y + self.height >= gaze.y) {

              // hit test succeeded, handle the gaze event!
              console.log("You looked at this:" + self.x +","+ self.y + ":"+self.width+ "," + self.height )   
              eyeTribeData.push("{'task':'"+$("#task_progress").text()+"','Region':'"+self.attr("id")+"','time':'"+Date().getTime()+"'}");         
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

          var obj = jQuery.parseJSON( message );
          var curTime = new Date().getTime();
          if( obj != null) {
              var d = document.getElementById("canvasWrapper");
              
              gaze={x:(obj.x-50-0),y:(obj.y-50-50-Math.log(obj.y))};
              myCanvasMove(gaze.x,gaze.y);
              $(msg_manager).trigger('handleEyeTrack',[gaze]);

              
              //ctx.canvas.left = obj.x+ 'px';
              //ctx.canvas.top = obj.y+ 'px';
              /*
              possrc0 = $("#divsrc0").position();
              possrc1 = $("#divsrc1").position();
              possrc2 = $("#divsrc2").position();                        
              posref0 = $("#divref0").position();
              posref1 = $("#divref1").position();
              posref2 = $("#divref2").position();
              postrn = $("#divtrn").position();

              if(typeof(possrc0) !== "undefined") 
                if(possrc0.top<(obj.y) && (possrc0.top+$("#divsrc0").height())>(obj.y) && possrc0.left<(obj.x) && (possrc0.left+$("#divsrc0").width())>(obj.x)) {
                  //console.log("src,"+obj.x+","+obj.y+","+curTime);
                  curRegion = "Src0";
                  curRegionColor = "#ff5b4c";
                }

              if(typeof(possrc1) !== "undefined") 
                if(possrc1.top<(obj.y) && (possrc1.top+$("#divsrc1").height())>(obj.y) && possrc1.left<(obj.x) && (possrc1.left+$("#divsrc1").width())>(obj.x)) {
                  //console.log("src,"+obj.x+","+obj.y+","+curTime);
                  curRegion = "Src1";
                  curRegionColor = "#ff5b4c";
                }

              if(typeof(possrc2) !== "undefined") 
                if(possrc2.top<(obj.y) && (possrc2.top+$("#divsrc2").height())>(obj.y) && possrc2.left<(obj.x) && (possrc2.left+$("#divsrc2").width())>(obj.x)) {
                  //console.log("src,"+obj.x+","+obj.y+","+curTime);
                  curRegion = "Src2";
                  curRegionColor = "#ff5b4c";
                }

              if(typeof(posref0) !== "undefined") 
                if(posref0.top<(obj.y) && (posref0.top+$("#divref0").height())>(obj.y) && posref0.left<(obj.x) && (posref0.left+$("#divref0").width())>(obj.x)) {
                  //console.log("ref,"+obj.x+","+obj.y+","+curTime);
                  curRegion = "Ref0";
                  curRegionColor = "#67ff3d";
                }

              if(typeof(posref1) !== "undefined") 
                if(posref1.top<(obj.y) && (posref1.top+$("#divref1").height())>(obj.y) && posref1.left<(obj.x) && (posref1.left+$("#divref1").width())>(obj.x)) {
                  //console.log("ref,"+obj.x+","+obj.y+","+curTime);
                  curRegion = "Ref1";
                  curRegionColor = "#67ff3d";
                }

              if(typeof(posref2) !== "undefined") 
                if(posref2.top<(obj.y) && (posref2.top+$("#divref2").height())>(obj.y) && posref2.left<(obj.x) && (posref2.left+$("#divref2").width())>(obj.x)) {
                  //console.log("ref,"+obj.x+","+obj.y+","+curTime);
                  curRegion = "Ref2";
                  curRegionColor = "#67ff3d";
                }

              if(typeof(postrn) !== "undefined") 
                if(postrn.top<(obj.y) && (postrn.top+$("#divtrn").height())>(obj.y) && postrn.left<(obj.x) && (postrn.left+$("#divtrn").width())>(obj.x)) {
                  //console.log("trn,"+obj.x+","+obj.y+","+curTime);
                  curRegion = "Trn"
                  curRegionColor = "#735dff";
                }
              
              if(curRegion === "Out"){
                //console.log("out,"+obj.x+","+obj.y+","+curTime);
                curRegion = "Out";
                timeRegion = curTime;
                curRegionColor = "#ffe629";
              }
              
              if(curRegion != activeRegion) {
                
                eyeTribeData.push("{'task':'"+$("#task_progress").text()+"','Region':'"+activeRegion+"','time':'"+(curTime-timeRegion)+"'}");
                console.log($("#task_progress").text()+", Region:"+activeRegion+" time:"+curTime+", "+timeRegion+", "+(curTime-timeRegion));
                timeRegion = curTime;
                activeRegion = curRegion;
              }*/

          
              
              
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


  var ChangeStatus = function() {

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

});