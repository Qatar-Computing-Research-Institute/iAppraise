var activeRegion = 0;
var timeRegion = 0;
var eyeTribeData = [];
var eyeTribeActive = 0;
var eyeTrackReplay = 0;
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
          $(newdiv).text(text[word]+" ");
          elem.append(newdiv);
          //elem.append(" ");
      }
     

     
  });

  $(".eyeTrackingWord").each(function() {

      elem = $(this);
      //x = elem.offset().left
      //y = elem.offset().top
      //width = elem.width()
      //height = elem.height()    
      //console.log("Creating shadow for object:" + JSON.stringify(elem)+" at ");
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
          //console.log("Move canvas to :" + x +","+ y )       
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
 //self.width=function(){return Math.round((self.elem.width()*zoom()));}
 //self.height = function(){return Math.round((self.elem.height()*zoom()));} 

       //this.text = text;
      //console.log("Created object at:" + x+","+ y + ":"+ width + ","+ height+":"+text);
      //console.log("Created object '"+self.id+"' at:" + self.x()+","+ self.y() + ":"+ self.width() + ","+ self.height());
      //$("#eyedatamap").val(JSON.stringify(shadows));
      // gaze parameter holds the eye coordinates
      //$(self.elem).onxclick=function(e) {
        /*self.x = self.elem.offset().left;
      self.y = self.elem.offset().top;
      self.width = self.elem.width()*zoom();
      self.height = self.elem.height()*zoom();
      self.id = $(self.elem).attr("id");*/
        //console.log("offsets:X "+(e.screenX-e.pageX)+" Y "+(e.screenY-e.pageY));
        //console.log("You hovered over  this:" + self.x() +","+ self.y() + ":"+self.width()+ "," + self.height()+ ","+self.id+",mouseX:"+e.pageX+";mouseY:"+e.pageY+ " mouseXX" +e.screenX + " mouseYY" +e.screenY);
      //}
      $("#myCanvas").on('handleEyeTrack',function(e,gaze) {
          //console.log("got the event" + gaze.x +", "+ gaze.y);
          //console.log(self + self.x +"," + self.y)
          
          self.id = $(self.elem).attr("id");
          // perform hit test between bounding box 
          // and mouse coordinates
          var cTime = new Date().getTime();
          if ( self.x() <= gaze.x &&
               self.x() + self.width() >= gaze.x &&
               self.y() <= gaze.y &&
               self.y() + self.height() >= gaze.y) {
                 
                  // hit test succeeded, handle the gaze event!
 
                  if (eyeTribeActive == 1)
                    if($(self.elem).attr("class") == "eyeTrackingWord"){
                      $(self.elem).css("background","#ffeeaa");
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
        
                  eyeTribeData.push('{"Region":"'+ self.id + '","time":"'+cTime+'","mouseX":"'+mouseX+'","mouseY":"'+mouseY+'","mouseXX":"'+mouseXX+'","mouseYY":"'+mouseYY+'","ScreenHeight":"'+Math.round(screen.height*window.devicePixelRatio)+'","ScreenWidth":"'+Math.round(screen.width*window.devicePixelRatio)+'","zoom":"'+zoom()+'","ScreenX":"'+window.screenX+'","ScreenY":"'+window.screenY+'","ScrollX":"'+window.scrollX+'","ScrollY":"'+window.scrollY+'","Div_first":"'+$('div:first').height()+'","innerHeight":"'+Math.round(window.innerHeight*getScaling())+'","outerHeight":"'+Math.round(window.outerHeight*getScaling())+'","clientWidth":"'+Math.round(document.body.clientWidth*getScaling())+'","clientHeight":"'+Math.round(document.body.clientHeight*getScaling())+'","data":'+$('#eyedatafull').val()+'}');         
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
              
              

              //var objX = obj.x/window.devicePixelRatio + window.scrollX - window.screenX - 7.45/window.devicePixelRatio;
              //var objY = obj.y/window.devicePixelRatio + window.scrollY - window.screenY +(window.innerHeight - window.outerHeight) + 5.1/window.devicePixelRatio;

             // gaze2={x:objX2,y:objY2};

 	      //obj.x=mouseXX;
	      //obj.y=mouseYY;

              var objX = (obj.x - window.screenX*getScaling())/zoom() +window.scrollX  ;//- 7.45/window.devicePixelRatio;
              var objY = (obj.y - window.screenY*getScaling() - (window.outerHeight -window.innerHeight)*getScaling() )/zoom() +window.scrollY;//+ 5.1/window.devicePixelRatio;

              gaze={x:objX,y:objY};
              //gaze ={x:mouseXX,y:mouseYY};

              myCanvasMove(gaze.x,gaze.y); 
              if (eyeTribeActive == 1) {
                $(".eyeTrackingWord").css("background","transparent");
		 $(".eyeTrackingWord").css("border","0px");
              }
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

  function ReplayStatus() {

    //alert("Change status!!!"+eyeTribeActive);
    if (eyeTrackReplay == 1) {

      eyeTrackReplay = 0;
      $("#myCanvas").width(0);
      $("#myRCanvas").width(0);      
      $("#replayEyeTrack").text("Replay on");

    } else {

      eyeTrackReplay = 1;
      $("#myCanvas").width(100);
      //$("#myRCanvas").width(100);
      $("#replayEyeTrack").text("Replay off");
    }

  }
