
var c1 = new Path.Circle({
  center: [300,200],
  radius: 100,
  fillColor: 'white',
  strokeColor: 'black',
  id: 1,
  data: {
    circleId: 1 // "1" 
  }
  //insert: false
});
var c2 = new Path.Circle({
  center: [150,525],
  radius: 125,
  fillColor: 'white',
  strokeColor: 'black',
  id: 2
});
var c3 = new Path.Circle({
  center: [567,300],
  radius: 65,
  // parent: groups,
  fillColor: 'white',
  strokeColor: 'black',
  id: 3
});
var c4 = new Path.Circle({
  center: [100,300],
  radius: 88,
  fillColor: 'white',
  strokeColor: 'black',
  id: 4
});
var c5 = new Path.Circle({
  center: [445,505],
  radius: 110,
  fillColor: 'white',
  strokeColor: 'black',
  id: 5
});
// var circles = [undefined, c1, c2, c3, c4, c5];

// Circles = {
//   '1': Circle(),
//   '2': Circle(),
//   '3': Circle(),
//   '4': Circle(),
//   '5': Circle()
// }

console.log(project.layers);
console.log("===================");

project.layers[0].data.layerName = "circles";

// has all the circles
var circleLayer = project.layers[0];


// In console, can use the "getItem" and leverage the data field
// e.g., paper.project.getItem({data:{layerName: "circles"}}).getItem({data:{circleId: "1"}})




//everything above should be for circles only
//layer for adding intersections
// var secondLayer = new secondLayer();

var intersectionLayer = new Layer();
// project.addLayer(intersectionLayer);
intersectionLayer.data.layerName = "intersections";
//intersectionLayer.activate(); // not needed now, but later

var cir1 = project.layers[0].children[0];
console.log("cir1 below");
console.log(cir1);
var intersections = {};

for(var i=1;i<6;i++){
  for(var j=i+1;j<6;j++){
    intersections[""+i+j] = project.layers[0].children[i-1].intersect(project.layers[0].children[j-1]);
    for(var k=j+1;k<6;k++){
      intersections[""+i+j+k] = intersections[""+i+j].intersect(project.layers[0].children[k-1]);
      for(var l = k+1;l<6; l++){
        intersections[""+i+j+k+l] = intersections[""+i+j+k].intersect(project.layers[0].children[l-1]);
      }
    }
  }
}

intersections["12345"] = c5.intersect(intersections["1234"]);

//trying to add intersection to the group

// for(var i in intersections){
//     groups.addChild(intersections[i]);
// }

// for (var i in intersections){
//   intersections[i].moveAbove(c1);
//   intersections[i].moveAbove(c2);
//   intersections[i].moveAbove(c3);
//   intersections[i].moveAbove(c4);
//   intersections[i].moveAbove(c5);
//   intersections[i].moveAbove(group1);
//   intersections[i].moveAbove(group2);
//   intersections[i].moveAbove(group3);
//   intersections[i].moveAbove(group4);
//   intersections[i].moveAbove(group5);
//   intersections[i].moveBelow(text1);
//   intersections[i].moveBelow(text2);
//   intersections[i].moveBelow(text3);
//   intersections[i].moveBelow(text4);
//   intersections[i].moveBelow(text5);
// }








//layer for adding text and manipulating text, will be the top layer, grouping should be here as it ties everything together
var textLayer = new Layer();
textLayer.data.layerName = "text"; // should be same as project.layers[2].data.layerName

console.log(project.layers);

var text1 = new PointText(new Point(100,100));
text1.fillColor = 'black';
text1.content = 'Circle 1';
text1.position = c1.position;
text1.id = '1';

var text2 = new PointText(new Point(100,100));
text2.fillColor = 'black';
text2.content = 'Circle 2';


text3= new PointText(new Point(100, 100));
text3.fillColor = 'black';
text3.content= 'Circle 3';

var text4= new PointText(new Point(100, 100));
text4.fillColor = 'black';
text4.content= 'Circle 4';

var text5= new PointText(new Point(100, 100));
text5.fillColor = 'black';
text5.content= 'Circle 5';


var fixLayers = function(){
  // because of binding, may need to use project.layers...
  
  textLayer.sendToBack();
  intersectionLayer.sendToBack();
  circleLayer.sendToBack();

  console.log('Fixed layers...');
  console.log(textLayer);
  console.log(intersectionLayer);
  console.log(circleLayer);
}

var group1 = new Group([c1, text1]);
group1.data.id = 1;
// group1.visible = false;
text2.position = c2.position;
//console.log(group1);
var group2 = new Group([c2, text2]);
group2.data.id = 2;
// group2.visible = false;
text3.position = c3.position;
group3 = new Group([c3, text3]);
group3.data.id=3;
// group3.visible = false;
text4.position = c4.position;
var group4 = new Group([c4, text4]);
group4.data.id = 4;
// group4.visible = false;
//shouldnt be necessary?? c5.data.id=5;
text5.position = c5.position;
var group5 = new Group([c5, text5]);
group5.data.id=5;
// group5.visible = false;

var groups = new Group({
  children: [group1, group2, group3, group4, group5],
  insert: true
});
var textArray = [undefined, text1, text2, text3, text4, text5];
var groupArray = [undefined, group1, group2, group3, group4, group5];
text1.id = '1';
text2.id = '2';
text3.id = '3';
text4.id = '4';
text5.id = '5';



// Text = {
//   '1': Text(), //object for circle 1 text
//   '2': Text(),
//   '3': Text(),
//   '4': Text(),
//   '5': Text()
// }
// Text["1"].position = Circles["1"].position;
// Text["2"].position = Circles["2"].position;
// Text["3"].position = Circles["3"].position;
// Text["4"].position = Circles["4"].position;
// Text["5"].position = Circles["5"].position;

var activeItem; 
var handle;
var dragged = false; 
//end layering manipulation, starts functions and such
function onMouseDown(event) {
  handle = null;
  var hitResult = groups.hitTest(event.point);
  if(activeItem){
    //this is how we define the handles to resize the circle
    handle = activeItem.hitTest(event.point, 
      {
        segments: true,
        stroke: true,
        fill: true,
        tolerance: 5
      }
    );
    //logging the active items on click
      console.log("Active item has children:");
      console.log(activeItem.children);
      //de selecting everything when nothing clicked
      if(activeItem.isIntersection == undefined){
        for(var c in activeItem.children){
          activeItem.children[c].selected = false;
        }
      } else {
        activeItem.selected = false;
      }
  }
  //sets active item to whatever is clicked
  activeItem = hitResult && hitResult.item;
  //this activeItem keeps cirle with the text but when combined doesnt work??
  if(activeItem){
    activeItem.selected = true;
    if(activeItem.isIntersection == undefined){
      activeItem = activeItem.parent;
    }
  } 
  else {
    console.log('nothing hit');
    return;
  }
  //removes intersections on click
  // move to drag?
  for (var _int in intersections){
    if(!intersections[_int].selected){
      intersections[_int].remove();
    }
  }
} 
//end onmousedown function

var segment;

function onMouseDrag(event) {
  dragged = true;

  if ( activeItem ){
    // terrible and dirty.
    if( activeItem.isIntersection == "true" ){
      return false;
    }
    //if we hit a handle, resize the circle
    if(handle && (handle.type == 'stroke' || handle.type == 'segment')){
      var p = event.point; // old
      var p2 = p + event.delta; // new
      var c = activeItem.position;
      if ((c - p).length > (c - p2).length){
        activeItem.scaling -= 0.005*event.delta.length;
      } else {
        activeItem.scaling += 0.005*event.delta.length;
      }
    }
    //else move the circle
    else {
      //activeItem.translate(event.point - activeItem.position);
      // todo: only do this if movement isn't locked
      activeItem.translate(event.delta);// + activeItem.position);
    }

  } // end if(activeitem)
} // end onMouseDrag

function onMouseUp(event){

  console.log(activeItem);
  /*
   * activeItem is about to get removed!
   * need to remember which intersection it is, if any, and re-select it later
   * add an attribute, or use "isSelected" ?
   */

  //dragged = trues 
  
  if (dragged) { 
    console.log("Calculating intersections...");
    // intersectionLayer.active(); // make sure this is active, so that new intersections get added to it
    for (var _int in intersections){
      // TODO: maybe remove if destruction happens in onMouseDrag
      intersections[_int].remove(); // do things on intersectionLayer
    }
    for(var i=1;i<6;i++){
      for(var j=i+1;j<6;j++){
        if( groupArray[j].visible ){ // TODO: bring back visibility testing
          intersections[""+i+j] = groupArray[i].children[0].intersect(groupArray[j].children[0]);
          // TODO: more of this
          intersections[""+i+j].data["intersectionId"] = "blah";
          for(var k=j+1;k<6;k++){
            intersections[""+i+j+k] = intersections[""+i+j].intersect(groupArray[k].children[0]);
            for(var l =k+1; l < 6; l++){
              intersections[""+i+j+k +l] = intersections[""+i+j + k].intersect(groupArray[l].children[0]);
            }
          }
        }
      }
    }

    console.log(intersections);
    
    /*
     * More sensible logic?
     */
    for (var _int in intersections){
      if( ! intersections[_int].isEmpty() ){
       // intersections[_int].fillColor = "blue";
        intersections[_int].bringToFront();
      /*  text1.insertAbove(intersection[_int]);
        text2.insertAbove(intersection[_int]);
        text3.insertAbove(intersection[_int]);
        text4.insertAbove(intersection[_int]);
        text5.insertAbove(intersection[_int]);
*/
        console.log("====== intersections[_int].parent ======");
        console.log(intersections[_int].parent);
        intersections[_int].parent.bringToFront();
        /*
        intersections[_int].moveAbove(c1);
        intersections[_int].moveAbove(c2);
        intersections[_int].moveAbove(c3);
        intersections[_int].moveAbove(c4);
        intersections[_int].moveAbove(c5);
        intersections[_int].moveAbove(group5);
        intersections[_int].moveAbove(group4);
        intersections[_int].moveAbove(group3);
        intersections[_int].moveAbove(group2);
        intersections[_int].moveAbove(group1);
        intersections[_int].moveBelow(text1);
        intersections[_int].moveBelow(text2);
        intersections[_int].moveBelow(text3);
        intersections[_int].moveBelow(text4);
        intersections[_int].moveBelow(text5);
        */
        intersections[_int].isIntersection = "true";
      }
    }
    // HERE, reset activeItem to what it was, if it was an intersection

  }

  dragged = false; // reset
  fixLayers();
}

var scope = this;

/*
 * Called when "Add Circle" is clicked
 */
doSubmit = function(e){
  scope.activate();
  e.preventDefault();

  console.log(e);
  console.log("Groups:");
  console.log(groups);

  console.log( );
  var targetName = e.target.querySelector("[name=formId]").value.toLowerCase();
  // holds the user's text entry
  var text = e.target.getElementsByTagName("input")[0].value;
  console.log(text);
  var obj;
 
  console.log("Looking for circle " + targetName);

  for( i = 0; i < groups.children.length; i++){
    if (groups.children[i].data.id == targetName){
      console.log("==================")
      obj = groups.children[i];
      console.log(text);
      localStorage[obj.data.id] = text;
      console.log("==================")
      break;
    }
  }
  console.log(obj);
  var t = obj.getItem({
    _class: "PointText"
  });
  t.content = text;
  obj.visible = true;
  return false;
}
window.doSubmit= doSubmit;
//end doSubmit function

var sliderIntersect=document.getElementById("rangeIntersect");

sliderIntersect.addEventListener("change",function(){
  var r,b;
  r=Math.round(255*(100-sliderIntersect.value)/100);
  b=Math.round(255*sliderIntersect.value/100);

  // doesn't work for intersections because then activeItem doesn't have children
  if( !activeItem.isIntersection ){
    activeItem.children[0].fillColor = "rgb("+r+",0,"+b+")";
    if(activeItem.value == 0){ // TODO: you mean slider value here?
      activeItem.children[0].fillColor = "white";
    }
  } else {
    // activeItem is an intersection (i.e. some Path object)
    activeItem.fillColor = "rgb("+r+",0,"+b+")";
  }

},false);
var formIntersect1 = document.getElementById("inlineRadioIntersect1");
formIntersect1.addEventListener("change",function(){
  activeItem.dashArray = false;

},false);
var formIntersect12 = document.getElementById("inlineRadioIntersect12");
formIntersect12.addEventListener("change",function(){
  activeItem.dashArray = [10,4];
},false);


