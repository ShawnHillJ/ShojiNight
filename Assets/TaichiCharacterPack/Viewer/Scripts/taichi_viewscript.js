var target : Transform;

var mode:String = "rote";
var x:float = 180.0;
var y:float = 30.0;

var distance :float =1;

var xSpeed:float = 500.0;
var ySpeed:float = 250.0;
var movSpeed:float = 250.0;

var yMinLimit:float = -90;
var yMaxLimit:float = 90;

var zoomSpeed:float = 0.5;
var zoomWheelBias:float = 5;
var zoomMin:float = 0.1;
var zoomMax:float = 5;

var curTarget : Transform;

private var xBk:float;
private var yBk:float;
private var movX : float;
private var movY : float;
private var wheel : float;
private var distanceBk : float;
private var cameraBk : Vector3;

private var isMouseLocked:boolean=false;
var isFixTarget:boolean=true;
private var localTarget:Transform;


private var changeFlg   : boolean;

function Start () {
    xBk=x;
    yBk=y;
    distanceBk = distance;
    //GameObject.Find("Directional light").GetComponent.<Light>().intensity = 0.5f;
}




function LateUpdate () { 
 movX =  Input.GetAxis("Mouse X");
 movY =  Input.GetAxis("Mouse Y");
 wheel = Input.GetAxis("Mouse ScrollWheel");
if ( !isMouseLocked && Input.GetMouseButton(0)){

 switch (mode) {
  case "move": TargetMove(movX,movY) ; break; 
  case "rote": CameraRote(movX,movY) ; break;
  case "zoom": CameraZoom(movX,movY) ; break;
} 
}

if (Input.GetMouseButton(2)){
 TargetMove(movX,movY) ;
 
  }
  
if (Input.GetMouseButton(1)){
 CameraZoom(movX,movY) ;
 
  }
  CameraZoom(wheel*zoomWheelBias,0);
    if(isFixTarget && curTarget){
    	localTarget = curTarget;
	}else {
    	localTarget =  target;
    }
    
 
    var rotation = Quaternion.Euler(y, x, 0);
    var position = rotation * Vector3(0, 0, -distance) + localTarget.position;

	if(!changeFlg){
	    transform.position = position;
	}
    if(isFixTarget && curTarget){
    	localTarget = curTarget;
    }else {
    	localTarget =  target;
    }
	if(!changeFlg){
    this.transform.LookAt(localTarget.position , Vector3.up);
    }
    changeFlg = false;
}


function CameraRote(_x:float,_y:float){
	x += _x * xSpeed * 0.01;
	y -= _y * ySpeed * 0.01; 
 	y = ClampAngle(y, yMinLimit, yMaxLimit);
}
 
function CameraZoom(_x:float,_y:float){
	distance += (-_y * 10 ) * zoomSpeed * 0.02;
	distance += (-_x * 10 ) * zoomSpeed * 0.02;
	if (distance < zoomMin) distance = zoomMin;
	if (distance > zoomMax) distance = zoomMax;
}

function TargetMove(_x:float,_y:float){
	if(isFixTarget)return;
    var movX = -_x* movSpeed * 0.055* Time.deltaTime;
    var movY = -_y* movSpeed * 0.055* Time.deltaTime;
    
    var camMove:Vector3 = Vector3(movX,movY);
    camMove = GetComponent.<Camera>().cameraToWorldMatrix.MultiplyVector(camMove);
    target.Translate(camMove);
}


static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}


function ModeMove(){
	mode = "move";
	print("move");
}

function ModeRote(){
	mode = "rote";
	print("rote");
}

function ModeZoom(){
	mode = "zoom";
	print("zoom");
}

function Reset(){
	distance = distanceBk;
   	x=xBk;
   	y=yBk; 
   	isFixTarget = true;
} 

function FixTarget(_flag:boolean){ 
	isFixTarget = _flag;
	//target.position = Vector3 .zero;
	if(curTarget){ 
		target.position= curTarget.position;
	}
	
}

function ModelTarget(_transform:Transform){
	curTarget =  _transform;
	changeFlg = true;
}

function MouseLock(_flag:boolean){
	if(!_flag && Input.GetMouseButton(0))return;
	isMouseLocked = _flag;
}