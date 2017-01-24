import System.IO;
import System.Xml;
import System.Text.RegularExpressions;

#pragma strict
 
var animTest:GameObject;

var guiSkin              : GUISkin;
var viewCam              : taichi_viewscript;
var boneName             : String = "Hips";
var camGuiRootRect       : Rect = Rect (870,25,93,420);
var camGuiBodyRect       : Rect = Rect (870,25,93,420);
//var animSpeedGuiBodyRect : Rect = Rect (770,520,170,150);
//var positionYGuiBodyRect : Rect = Rect (770,520,170,150);
var guiOnBodyRect        : Rect = Rect (50,75,300,70);


var sliderTextBodyRect   : Rect = Rect (0,0,0,0);
var sliderGuiBodyRect    : Rect = Rect (0,0,0,0);

var textGuiBodyRect      : Rect = Rect (20,510,300,70);
var modelBodyRect        : Rect = Rect (20,40,300,500);
var FBXListFile          : String = "fbx_list_a";
var AnimationListFile    : String = "animation_list_a";

var TitleTextFile        : String = "title_text_a";
var guiOn                : boolean = true;

var facialMaterial_M_org : Material;
var facialMaterial_L_org : Material;

var FacialTexListFile         : String = "facial_texture_list_a";
var ParticleListFile          : String = "particle_list_a";
var ParticleAnimationListFile : String = "particle_animation_list_a";
//var resourcesPath        : String = "Arum";

var facialMatName             : String = "f01_face_00";

private var guiShowFlg           : boolean = false;
private var viewerResourcesPath  : String = "Taichi";
private var viewerSettingPath    : String = viewerResourcesPath+"/Viewer Settings";
private var viewerMaterialPath   : String = viewerResourcesPath+"/Viewer Materials";
private var viewerBackGroundPath : String = viewerResourcesPath+"/Viewer BackGrounds";
private var texturePath          : String = viewerResourcesPath+"/Textures";

private var functionList         : Hashtable=new Hashtable();

private var curBG          : int    = 1;
private var curAnim        : int    = 1;
private var curModel       : int    = 1;
private var curFacial      : int    = 1;
private var curMode        : int    = 1;
private var curLOD         : float  = 0;
private var curParticle    : float  = 1;
private var animSpeed      : float  = 1;

private var curModelName   : String = "";
private var curAnimName    : String = "";
private var curModeName    : String = "";
private var curBgName      : String = "";
private var curFacialName  : String = "";
private var curParticleName: String = "";

private var facialCount    : int   = 0;
private var positionY      : float = 0;

private var animationList         : String[];
private var animationCommonList   : String[];
private var facialTexList         : String[];
private var particleAnimationList : String[];
private var particleList          : String[];

private var modelList  : String[];

private var backGroundList : String[];
private var stageTexList   : String[];
private var lodList        : String[] = ["_h","_m","_l"];
private var lodTextList    : String[] = ["Hi","Mid","Low"];
private var modeTextList   : String[] = ["AddPerticle","Original"];

private var obj    : GameObject;
private var loaded : GameObject;
private var SM     : SkinnedMeshRenderer;
private var faceSM : SkinnedMeshRenderer;
private var faceObjName : String;

private var txt : TextAsset;

private var CamModeRote : boolean = true;
private var CamModeMove : boolean = false;
private var CamModeZoom : boolean = false;
private var CamModeFix  : boolean = true;

private var CamMode   : int = 0;
private var titleText : String = "";
private var xDoc      : XmlDocument;
private var xNodeList : XmlNodeList;

private var faceMat_L : Material;
private var faceMat_M : Material;

private var BGObject  : GameObject;
private var BGEff     : GameObject;
private var BGPlane   : GameObject;
private var planeObj  : GameObject;

//Popup
private var oldMousePosition    : Vector2;
private var popupWaitingTime    : float = 2;
private var popupWaitingTimeNow : float = 0;

function Start () {

	functionList["particle"]   = false;
	functionList["facial"]     = false;
	functionList["model"]      = true;
	functionList["animation"]  = true;
	functionList["background"] = true;
	functionList["lod"]        = true;

	functionList["position_x"]      = false;
	functionList["position_y"]      = false;
	functionList["position_z"]      = false;
	functionList["rotate"]          = false;
	functionList["animation_speed"] = true;
	
	
	

	viewCam = GameObject.Find("Main Camera").GetComponent("taichi_viewscript");
	planeObj = GameObject.Find("Plane") as GameObject;
	
	txt = Resources.Load( viewerSettingPath + "/background_list", TextAsset);
	backGroundList =txt.text.Split(["\r","\n"],1);

	txt = Resources.Load( viewerSettingPath +"/"+ FBXListFile, TextAsset);
	modelList =txt.text.Split(["\r","\n"],1);

	txt = Resources.Load( viewerSettingPath + "/stage_texture_list", TextAsset);
	stageTexList =txt.text.Split(["\r","\n"],1);

	if(functionList["particle"])
	{
		txt = Resources.Load( viewerSettingPath +"/"+ ParticleListFile, TextAsset);
		particleList =txt.text.Split(["\r","\n"],1);

		txt = Resources.Load( viewerSettingPath +"/"+ ParticleAnimationListFile, TextAsset);
		particleAnimationList =txt.text.Split(["\r","\n"],1);
	}

	txt = Resources.Load( viewerSettingPath +"/"+ AnimationListFile, TextAsset);
	animationCommonList =txt.text.Split(["\r","\n"],1);

	if(functionList["facial"])
	{
		txt = Resources.Load( viewerSettingPath +"/"+ FacialTexListFile, TextAsset);
		facialTexList =txt.text.Split(["\r","\n"],1);
	}
	
	txt = Resources.Load( viewerSettingPath +"/"+ TitleTextFile, TextAsset);
	titleText =txt.text;

	txt = Resources.Load( viewerSettingPath+ "/fbx_ctrl", TextAsset);
	xDoc = new XmlDocument();
	xDoc.LoadXml( txt.text );

	//FaceMaterial
	
	/*
	
	if(resourcesPath == "Arum"){
		faceObjName = "succubus_a";
		faceMat_L = Resources.Load( viewerMaterialPath + "/succubus_a_face_l", Material);
		faceMat_M = Resources.Load( viewerMaterialPath + "/succubus_a_face_m", Material);

	}else if(resourcesPath == "Asphodel"){
		faceObjName = "succubus_b";
		faceMat_L = Resources.Load( viewerMaterialPath + "/succubus_b_face_l", Material);
		faceMat_M = Resources.Load( viewerMaterialPath + "/succubus_b_face_m", Material);
	}
	*/
	
	faceMat_L = facialMaterial_L_org;
	faceMat_M = facialMaterial_M_org;
	

	if(curMode == 0){
		animationList = particleAnimationList;
	}else if(curMode == 1){
		animationList = animationCommonList;
	}

	curModeName   = modeTextList[curMode];


	/* Succubus Pack
	BGObject = GameObject.Find("obj01_succubus_pedestal_00");
	BGEff    = GameObject.Find("eff_obj01_00");
	BGPlane  = GameObject.Find("Plane");
	*/

	SetInitBackGround();
	SetInitModel();
	SetInitMotion();
	SetAnimationSpeed(animSpeed);

	// Succubus
	// SetInitFacial();

	if(curMode == 0){
		this.SetInitParticle();
	}
}

function Update () {
if (Input.GetKeyDown("1"))SetNextModel(-1);
if (Input.GetKeyDown("2"))SetNextModel(1);

if (Input.GetKeyDown("q"))SetNextMotion(-1);
if (Input.GetKeyDown("w"))SetNextMotion(1);

if (Input.GetKeyDown("a"))SetNextBackGround(-1);
if (Input.GetKeyDown("s"))SetNextBackGround(1);

if (Input.GetKeyDown("z"))SetNextLOD(-1);
if (Input.GetKeyDown("x"))SetNextLOD(1);




}
private var scale: Vector3;
private var test : boolean;
private var ParticleMode : boolean;
function OnGUI () {

if (guiSkin) {
	GUI.skin = guiSkin;
}
    
if(!guiOn)
{
	GUILayout.BeginArea (guiOnBodyRect);
		GUILayout.BeginVertical();
			GUILayout.BeginHorizontal();
			var guiVal = GUILayout.Toggle (guiOn,"","GUIOn");
			if (guiOn != guiVal) {
				guiOn = guiVal;
			}
			GUILayout.EndHorizontal();
		GUILayout.EndVertical(); 
	GUILayout.EndArea ();
this.popUp();
return;
}


	if(
		curMode == 0 && 
		curParticle != 4
	){
	
		/*
		if ( GUI.Button( Rect(200, 100, 100, 20), "Particle!" ) )
		{
			this.particleExec();
		}
		*/
	 }
                
    //print(Screen.height+" "+Screen.width);
    scale.x = Screen.width / 960.0;
    scale.y = Screen.height / 600.0; 
    scale.x = 1;
    scale.y = 1;
    scale.z = 1.0;

    GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, scale);

	var sw : float = Screen.width;
	var sh : float = Screen.height;
	
	// GUI Parts Adjust
	textGuiBodyRect.y = sh-(textGuiBodyRect.height+20);

	//animSpeedGuiBodyRect.y = sh-(animSpeedGuiBodyRect.height+20);
	//animSpeedGuiBodyRect.x = sw-(animSpeedGuiBodyRect.width+20);

	camGuiRootRect.x = sw-camGuiRootRect.width*0.9;
	camGuiBodyRect.x = sw-(camGuiBodyRect.width*0.9-15);
	
	
	sliderTextBodyRect.x = sw-(sliderTextBodyRect.width+20);
	sliderTextBodyRect.y = sh-(sliderTextBodyRect.height+20);

	sliderGuiBodyRect.x = sw-(sliderTextBodyRect.width+sliderGuiBodyRect.width+25);
	sliderGuiBodyRect.y = sh-(sliderGuiBodyRect.height+20);

	GUI.Label( Rect(20,20,500,50), titleText, "Title");
	
	var buttonSpace : float = 10;
	var newVal:boolean;

	GUILayout.BeginArea (modelBodyRect);
		//GUILayout.BeginHorizontal();
		//GUILayout.FlexibleSpace();
		GUILayout.BeginVertical();


		GUILayout.BeginHorizontal();
		guiVal = GUILayout.Toggle (guiOn,"","GUIOn");
		if (guiOn != guiVal) {
			guiOn = guiVal;
		}
		GUILayout.EndHorizontal();
		GUILayout.Space(buttonSpace);
			
		if(functionList["particle"])
		{
			GUILayout.BeginHorizontal();
			newVal = GUILayout.Toggle (ParticleMode,"","ParticleMode");
			if (ParticleMode != newVal) {
				ParticleMode = newVal;
				//if(newVal){
					if(curMode == 0){
						SetNextMode(1);
					}else{
						SetNextMode(-1);
					}
				//}

			}
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);
		}
		else{
			GUI.color.a = 0.5f;
			GUILayout.BeginHorizontal();
			GUILayout.Label( "","ParticleMode");
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);
			GUI.color.a = 1.0f;
		
		}
		
		if(functionList["model"])
		{
			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","Left")) SetNextModel(-1);
			GUILayout.Label( "","Costume");
			if (GUILayout.Button ("","Right"))SetNextModel(1);
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);
		}
		else
		{
			GUI.color.a = 0.5f;
			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","LeftGlayOut")){}
			GUILayout.Label( "","Costume");
			if (GUILayout.Button ("","RightGlayOut")){}
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);
			GUI.color.a = 1.0f;
		}
		
		
		if(functionList["animation"])
		{
			//Motion
			if(curMode == 1)
			{
				GUILayout.BeginHorizontal();
				if (GUILayout.Button ("","Left")) SetNextMotion(-1);
				GUILayout.Label( "","Anim");
				if (GUILayout.Button ("","Right"))SetNextMotion(1);
				GUILayout.EndHorizontal();
				GUILayout.Space(buttonSpace);

			//Motion & Particle
			}
			else if(curMode == 0)
			{
				GUILayout.BeginHorizontal();
				if (GUILayout.Button ("","Left")) SetNextParticle(-1);
				if (GUILayout.Button ("","ParticleShot"))
				{
					this.particleExec();
				}

				if (GUILayout.Button ("","Right"))SetNextParticle(1);
				GUILayout.EndHorizontal();
				GUILayout.Space(buttonSpace);
			}
		}
		else
		{
			GUI.color.a = 0.5f;
			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","LeftGlayOut")){}
			GUILayout.Label( "","Anim");
			if (GUILayout.Button ("","RightGlayOut")){}
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);
			GUI.color.a = 1.0f;
		}



		if(functionList["facial"])
		{
			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","Left")) SetNextFacial(-1);
			GUILayout.Label( "","Facial");
			if (GUILayout.Button ("","Right"))SetNextFacial(1);
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);
		}
		else
		{
			GUI.color.a = 0.5f;
			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","LeftGlayOut")){}
			GUILayout.Label( "","Facial");
			if (GUILayout.Button ("","RightGlayOut")){}
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);		
			GUI.color.a = 1.0f;
		}
		
		
		if(functionList["background"])
		{
			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","Left")) SetNextBackGround(-1);
			GUILayout.Label( "","BG");
			if (GUILayout.Button ("","Right"))SetNextBackGround(1);
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);
		}
		else
		{
			GUI.color.a = 0.5f;
			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","LeftGlayOut")){}
			GUILayout.Label( "","BG");
			if (GUILayout.Button ("","RightGlayOut")){}
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);
			GUI.color.a = 1.0f;
		}
		
		if(functionList["lod"])
		{
			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","Left")) SetNextLOD(-1);
			GUILayout.Label( "","LOD");
			if (GUILayout.Button ("","Right"))SetNextLOD(1);
			GUILayout.EndHorizontal();
		}
		else
		{
			GUI.color.a = 0.5f;
			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","LeftGlayOut")){}
			GUILayout.Label( "","LOD");
			if (GUILayout.Button ("","RightGlayOut")){}
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);
			GUI.color.a = 1.0f;
		}
		GUILayout.FlexibleSpace();
	GUILayout.EndVertical(); 
	GUILayout.EndArea ();




	//Slider Text

	GUILayout.BeginArea (sliderTextBodyRect);
		GUILayout.FlexibleSpace();

		if(functionList["position_x"])
		{
			GUI.color.a = 1.0f;
		}
		else
		{
			GUI.color.a = 0.4f;
		}

		var positionXText = "Position X : " + String.Format("{0:F1}", obj.transform.position.x);
		
		GUILayout.Box(positionXText);
		GUILayout.FlexibleSpace();



		if(functionList["position_y"])
		{
			GUI.color.a = 1.0f;
		}
		else
		{
			GUI.color.a = 0.4f;
		}

		var positionYText = "Position Y : " + String.Format("{0:F1}", obj.transform.position.y);
		GUILayout.Box(positionYText);
		GUILayout.FlexibleSpace();



		if(functionList["position_z"])
		{
			GUI.color.a = 1.0f;
		}
		else
		{
			GUI.color.a = 0.4f;
		}

		var positionZText = "Position Z : " + String.Format("{0:F1}", obj.transform.position.z);
		GUILayout.Box(positionZText);
		GUILayout.FlexibleSpace();

		if(functionList["rotate_y"])
		{
			GUI.color.a = 1.0f;
		}
		else
		{
			GUI.color.a = 0.4f;
		}

		var rotateText = "Rotate : " + String.Format("{0:F1}", obj.transform.eulerAngles.y);
		GUILayout.Box(rotateText);
		GUILayout.FlexibleSpace();


		if(functionList["animation_speed"])
		{
			GUI.color.a = 1.0f;
		}
		else
		{
			GUI.color.a = 0.4f;
		}
		var animSpeedText = "Animation\nSpeed : " + String.Format("{0:F1}", animSpeed);
		GUILayout.Box(animSpeedText);
		GUILayout.FlexibleSpace();

	GUILayout.EndArea ();

	//Slider GUI
	GUILayout.BeginArea (sliderGuiBodyRect);

		if(functionList["position_x"])
		{
			if(onSliderFlg == 1) GUI.color.a = 1.0f;
			else GUI.color.a = 0.4f;
			//Position X
			var posXVal:float = GUILayout.HorizontalSlider(obj.transform.position.x, 1, -1);
			if(obj.transform.position.x != posXVal){
				obj.transform.position.x = posXVal;
				viewCam.MouseLock(true);
			}else{
				viewCam.MouseLock(false);
			}
			GUILayout.Space(0);
		}
		else
		{
			//Position X
			GUI.color.a = 0.4f;
			GUILayout.HorizontalSlider(obj.transform.position.x, 0, 0);
			GUILayout.Space(0);
		}




		//Position Y
		if(functionList["position_y"])
		{
			if(onSliderFlg == 2) GUI.color.a = 1.0f;
			else GUI.color.a = 0.4f;
			//var posYVal:float = GUILayout.HorizontalSlider(obj.transform.position.y, 0, 3);
			var posYVal:float = GUILayout.HorizontalSlider(obj.transform.position.y, 0, 3);
			if(obj.transform.position.y != posYVal){
				obj.transform.position.y = posYVal;
				viewCam.MouseLock(true);
			}else{
			
				viewCam.MouseLock(false);
			}
			GUILayout.Space(0);
		}
		else
		{
			GUI.color.a = 0.4f;
			GUILayout.HorizontalSlider(obj.transform.position.y, 0, 0);
			GUILayout.Space(0);
		}
		
		

		//Position Z
		if(functionList["position_z"])
		{
		
			if(onSliderFlg == 3) GUI.color.a = 1.0f;
			else GUI.color.a = 0.4f;
			var posZVal:float = GUILayout.HorizontalSlider(obj.transform.position.z, 1, -1);
			if(obj.transform.position.z != posZVal){
				obj.transform.position.z = posZVal;
				viewCam.MouseLock(true);
			}else{
				viewCam.MouseLock(false);
			}
			GUILayout.Space(0);
		}
		else
		{
			GUI.color.a = 0.4f;
			GUILayout.HorizontalSlider(obj.transform.position.z, 0, 0);
			GUILayout.Space(0);
		}

		//Rotate
		if(functionList["rotate"])
		{
			if(onSliderFlg == 4) GUI.color.a = 1.0f;
			else GUI.color.a = 0.4f;
			var rotVal:float = GUILayout.HorizontalSlider(obj.transform.eulerAngles.y, 0, 359.9);
			if(obj.transform.eulerAngles.y != rotVal){ 
				obj.transform.eulerAngles.y = rotVal;
				viewCam.MouseLock(true);
			}else{
				viewCam.MouseLock(false);
			}
			GUILayout.Space(5);	
		}
		else
		{
			GUI.color.a = 0.4f;
			GUILayout.HorizontalSlider(obj.transform.eulerAngles.y, 0, 0);
			GUILayout.Space(5);	
		}
		



		if(functionList["animation_speed"])
		{
			if(onSliderFlg == 5) GUI.color.a = 1.0f;
			else GUI.color.a = 0.4f;
			GUI.color.a = 1.0f;
			//Motion Speed
			var Val:float = GUILayout.HorizontalSlider(animSpeed, 0, 2);
			if(animSpeed != Val){
				animSpeed = Val;
				SetAnimationSpeed(animSpeed);
				viewCam.MouseLock(true);
			}else{
				viewCam.MouseLock(false);
			}
		}else{
			GUI.color.a = 0.4f;
			GUILayout.HorizontalSlider(animSpeed, 0, 0);
		}
	GUILayout.EndArea ();	
	GUI.color.a = 1.0f;


/*
	if(curMode == 1){
	GUILayout.BeginArea (animSpeedGuiBodyRect);
		GUILayout.FlexibleSpace();
		var val:float = GUILayout.HorizontalSlider(animSpeed, 0, 2);
		if(animSpeed != val){ 
			animSpeed = val;
			SetAnimationSpeed(animSpeed);
			viewCam.MouseLock(true);
		}else{
			viewCam.MouseLock(false);
		}
		GUILayout.FlexibleSpace();
		var animSpeedText = "Animation Speed : " + String.Format("{0:F1}", animSpeed);
		GUILayout.Box(animSpeedText);
		GUILayout.FlexibleSpace();
	GUILayout.EndArea ();

	GUILayout.BeginArea (positionYGuiBodyRect);
		GUILayout.FlexibleSpace();
		var pos:float = GUILayout.HorizontalSlider(positionY, 0, 3);
		if(positionY != pos){ 
			positionY = pos;
			obj.transform.position.y = positionY;
			viewCam.MouseLock(true);
		}else{
			viewCam.MouseLock(false);
		}
	
		GUILayout.FlexibleSpace();
		var positionYText = "positionY : " + String.Format("{0:F1}", positionY);
		GUILayout.Box(positionYText);
		GUILayout.FlexibleSpace();
	GUILayout.EndArea ();
	}
*/

	GUI.Label( camGuiRootRect, "", "CamBG");
	GUILayout.BeginArea (camGuiBodyRect);
		GUILayout.BeginHorizontal();
		GUILayout.BeginVertical(); 
			//GUILayout.FlexibleSpace();
			//var newVal:boolean;
			newVal = GUILayout.Toggle (CamMode==0,"","Rote"); 
			if( CamMode!=0 && newVal ){
				CamMode=0;
				viewCam.ModeRote();
			}
			GUILayout.FlexibleSpace();
			newVal = GUILayout.Toggle (CamMode==1,"","Move"); 
			if( CamMode!=1 && newVal ){
				CamMode=1;
				viewCam.ModeMove();
			}
			GUILayout.FlexibleSpace();
			newVal = GUILayout.Toggle (CamMode==2,"","Zoom"); 
			if( CamMode!=2 && newVal ){
				CamMode=2;
				viewCam.ModeZoom();
			}
			GUILayout.FlexibleSpace();
			CamModeFix = viewCam.isFixTarget;
			newVal = GUILayout.Toggle (CamModeFix,"","Fix");
			if (CamModeFix != newVal) {
				CamModeFix = newVal;
				viewCam.FixTarget(CamModeFix);
			}
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("","Reset")) {
				viewCam.Reset();
			}
			GUILayout.FlexibleSpace();
		GUILayout.EndVertical();
		GUILayout.EndHorizontal();
	GUILayout.EndArea ();

    //GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, Vector3.one);

	var text:String="";
	
	if(functionList["particle"])
	{
		text += "Mode : " + curModeName + "\n";
	}
	if(functionList["model"])
	{
		text += "Costume : " + (curModel+1) + " / " + modelList.length + " : " + curModelName + "\n";
	}
	
	if(functionList["animation"])
	{
		if(curMode == 0){
			text += "Particle  : " + (curAnim+1) + " / " +(animationList.length) +" : "+curParticleName+ "\n";
		}else{
			text += "Animation : " + (curAnim+1) + " / " +(animationList.length) +" : "+curAnimName+ "\n";
		}
	}
	if(functionList["facial"])
	{
		text += "Facial : " + (curFacial+1) + " / " +(facialCount) +" : "+curFacialName+ "\n";
	}

	if(functionList["background"])
	{
		text += "BackGround : " + (curBG+1)+" / " +backGroundList.length + " : " + curBgName + "\n";
	}
	if(functionList["lod"])
	{
		text += "Quality : " + lodTextList[curLOD]+ "\n";
	}
	text += "Animation Speed : " + String.Format("{0:F2}", animSpeed);
	GUI.Box(textGuiBodyRect,text);
	
	
	this.popUp();

}

function popUp(){

	if(Input.GetMouseButton(0))
	{
		popupWaitingTimeNow = 0;
	}

	if(oldMousePosition == Input.mousePosition)
	{
		popupWaitingTimeNow += Time.deltaTime;
	}
	else
	{
		popupWaitingTimeNow = 0;
	}

	oldMousePosition = Input.mousePosition;
	
	if(popupWaitingTime > popupWaitingTimeNow)
	{
		return;
	}

	var sw : float = Screen.width;
	var sh : float = Screen.height;

	var minPos     : Vector2[];
	var maxPos     : Vector2[];
	var popupRect  : Rect[];
	var popupText  : String[];
	var popupCount : int = 17;

	minPos    = new Vector2[popupCount];
	maxPos    = new Vector2[popupCount];
	popupRect = new Rect[popupCount];
	popupText = new String[popupCount];

	var topMargin  : float = 60;
	var leftMargin : float = 20;

	var topPosY    : float = sh-topMargin;
	var iconHeight : float = 50f;
	var iconWidth  : float = 100;
	var iconMargin : float = 12;

	var minX : float;
	var minY : float;

	var maxX : float;
	var maxY : float;

	var popUpY : float;
	var popUpX : float;
	if(guiOn){
		///////////////////////////
		// Left Menu
		///////////////////////////

		// GUI On/Off.
		maxY = topPosY;
		minY = topPosY-iconHeight;
		
		maxX = iconWidth+leftMargin;
		minX = leftMargin;
		
		popUpY = sh - maxY;
		popUpX = iconWidth+leftMargin+10;
		
		minPos[0]    = Vector2(minX,minY);
		maxPos[0]    = Vector2(maxX,maxY);
		popupRect[0] = Rect(popUpX-20,popUpY,120,23);
		popupText[0] = "GUI On/Off.";


		// Mode Change.
		maxY -= iconHeight+iconMargin;
		minY -= iconHeight+iconMargin;
		
		popUpY = sh - maxY;
		minPos[1]    = Vector2(minX,minY);
		maxPos[1]    = Vector2(maxX,maxY);
		popupRect[1] = Rect(popUpX-20,popUpY,120,23);
		popupText[1] = "Mode Change.";
		
		// Model Change.
		maxY -= iconHeight+iconMargin;
		minY -= iconHeight+iconMargin;

		popUpY = sh - maxY;
		minPos[2]    = Vector2(minX,minY);
		maxPos[2]    = Vector2(maxX,maxY);
		popupRect[2] = Rect(popUpX,popUpY,120,23);
		popupText[2] = "Model Change.";
	
		// Motion Change.
		maxY -= iconHeight+iconMargin;
		minY -= iconHeight+iconMargin;

		popUpY = sh - maxY;
		minPos[3]    = Vector2(minX,minY);
		maxPos[3]    = Vector2(maxX,maxY);
		popupRect[3] = Rect(popUpX,popUpY,120,23);
		popupText[3] = "Motion Change.";
		
		// Facial Change.
		maxY -= iconHeight+iconMargin;
		minY -= iconHeight+iconMargin;

		popUpY = sh - maxY;
		minPos[4]    = Vector2(minX,minY);
		maxPos[4]    = Vector2(maxX,maxY);
		popupRect[4] = Rect(popUpX,popUpY,120,23);
		popupText[4] = "Facial Change.";
		
		// BackGround Change.
		maxY -= iconHeight+iconMargin;
		minY -= iconHeight+iconMargin;

		popUpY = sh - maxY;
		minPos[5]    = Vector2(minX,minY);
		maxPos[5]    = Vector2(maxX,maxY);
		popupRect[5] = Rect(popUpX,popUpY,150,23);
		popupText[5] = "BackGround Change.";

		// Lod Change.
		maxY -= iconHeight+iconMargin;
		minY -= iconHeight+iconMargin;

		popUpY = sh - maxY;
		minPos[6]    = Vector2(minX,minY);
		maxPos[6]    = Vector2(maxX,maxY);
		popupRect[6] = Rect(popUpX,popUpY,120,23);
		popupText[6] = "Lod Change.";


		///////////////////////////
		// Right Menu
		///////////////////////////
		
		topMargin  = 43;

		topPosY    = sh-topMargin;
		iconHeight = 57.6f;
		iconWidth  = 57.6f;
		iconMargin = 11.5;

		
		
		var rightPopupMargin : float = 220;
		var rightPopupX      : float;
		
		rightPopupX = Screen.width - rightPopupMargin;
		
		// Camera Rotate.
		maxY = topPosY;
		minY = topPosY-iconHeight;

		maxX = sw-10;
		minX = sw-10-iconWidth;
		popUpY = sh - maxY;
		minPos[7]    = Vector2(minX,minY);
		maxPos[7]    = Vector2(maxX,maxY);
		popupRect[7] = Rect(rightPopupX,popUpY,120,23);
		popupText[7] = "Camera Rotate.";

		// Camera Move.
		maxY -= iconHeight+iconMargin;
		minY -= iconHeight+iconMargin;
		popUpY = sh - maxY;
		minPos[8]    = Vector2(minX,minY);
		maxPos[8]    = Vector2(maxX,maxY);

		popupRect[8] = Rect(rightPopupX,popUpY,120,23);
		popupText[8] = "Camera Move.";
		
		// Camera Zoom.
		maxY -= iconHeight+iconMargin;
		minY -= iconHeight+iconMargin;
		popUpY = sh - maxY;		
		minPos[9]    = Vector2(minX,minY);
		maxPos[9]    = Vector2(maxX,maxY);

		popupRect[9] = Rect(rightPopupX,popUpY,120,23);
		popupText[9] = "Camera Zoom.";
		
		// Camera Target Lock.
		maxY -= iconHeight+iconMargin;
		minY -= iconHeight+iconMargin;
		popUpY = sh - maxY;
		minPos[10]    = Vector2(minX,minY);
		maxPos[10]    = Vector2(maxX,maxY);


		rightPopupX -= 30;
		popupRect[10] = Rect(rightPopupX,popUpY,150,23);
		popupText[10] = "Camera Target Lock.";
		
		// Camera Reset.
		maxY -= iconHeight+iconMargin;
		minY -= iconHeight+iconMargin;
		popUpY = sh - maxY;
		rightPopupX += 30;
		minPos[11]    = Vector2(minX,minY);
		maxPos[11]    = Vector2(maxX,maxY);

		popupRect[11] = Rect(rightPopupX,popUpY,120,23);
		popupText[11] = "Camera Reset.";
	}else{
		// GUI On/Off.
		maxY = topPosY;
		minY = topPosY-iconHeight;
		
		maxX = iconWidth+leftMargin;
		minX = leftMargin;
		
		popUpY = sh - maxY;
		popUpX = iconWidth+leftMargin+10;
		
		minPos[0]    = Vector2(minX,minY);
		maxPos[0]    = Vector2(maxX,maxY);
		popupRect[0] = Rect(popUpX,popUpY,120,23);
		popupText[0] = "GUI On/Off.";
	
	}

	for(var i = 0;i < popupCount;i++)
	{
		if(
			Input.mousePosition.x > minPos[i].x && 
			Input.mousePosition.x < maxPos[i].x && 
			Input.mousePosition.y > minPos[i].y &&
			Input.mousePosition.y < maxPos[i].y 
		){
			GUI.Box(popupRect[i],popupText[i]);
		}
	}
}

private var onSliderFlg : int;
function scrollBarPos(){
	var minPos     : Vector2[];
	var maxPos     : Vector2[];
	var popupCount : int = 10;
	
	onSliderFlg = 0;
	
	minPos    = new Vector2[popupCount];
	maxPos    = new Vector2[popupCount];

	//Left Slider
	minPos[0] = Vector2(20,270);
	maxPos[0] = Vector2(280,300);
	minPos[1] = Vector2(20,240);
	maxPos[1] = Vector2(280,270);

	minPos[2] = Vector2(20,210);
	maxPos[2] = Vector2(280,240);

	minPos[3] = Vector2(20,180);
	maxPos[3] = Vector2(280,210);

	minPos[4] = Vector2(20,140);
	maxPos[4] = Vector2(280,180);
	
	minPos[5] = Vector2(20,100);
	maxPos[5] = Vector2(280,140);

	for(var i = 0;i < popupCount;i++)
	{
		if(
			Input.mousePosition.x > minPos[i].x && 
			Input.mousePosition.x < maxPos[i].x && 
			Input.mousePosition.y > minPos[i].y &&
			Input.mousePosition.y < maxPos[i].y 
		){
			onSliderFlg = i+1;
		}
	}
}

function SetNextMode(_add:int){
	curMode +=_add;

	if( curMode > 1  ) {  
		 curMode = 0;
	} else if(curMode<0){
		 curMode = 1;
	}

	/*  ParticleMode Not Use
	Destroy(GameObject.Find("eff_succubus_seduced_00(Clone)"));
	Destroy(GameObject.Find("seduce_particle_instance(Clone)"));
	Destroy(GameObject.Find("magic_particle0m_instance(Clone)"));
	Destroy(GameObject.Find("magic_particle4m_instance(Clone)"));
	Destroy(GameObject.Find("magic_particle8m_instance(Clone)"));
	Destroy(GameObject.Find("magic_particle20m_instance(Clone)"));
	*/
	if(curMode == 0){
		animationList = particleAnimationList;
	}else if(curMode == 1){
		animationList = animationCommonList;
	}
	curModeName = modeTextList[curMode];
	
	curAnim = 0;
	curParticle = 0;
	curLOD = 0;

	curParticleName = particleList[curParticle];
	this.SetInitModel();
	this.SetInitMotion();
	this.SetAnimationSpeed(animSpeed);
	this.SetInitFacial();
	if(curMode == 0){
		this.SetInitParticle();
	}
}



function SetInitParticle(){
	if(curMode != 0){
		return;
	}
	/* ParticleMode Not Use
	if(resourcesPath == "Arum"){
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_a_magic4m");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_a_magic8m");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_a_magic20m");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_a_materialization");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_a_seduce");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_a_seduced");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_a_damage");
	}else if(resourcesPath == "Asphodel"){
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_b_magic4m");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_b_magic8m");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_b_magic20m");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_b_materialization");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_b_seduce");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_b_seduced");
		obj.AddComponent("succubus_twins_character_pack_v0112_viewer_succubus_b_damage");
	}
	this.SetParticle();
	*/
}

function SetNextParticle(_add:int){
	curAnim +=_add;
	curParticle += _add;
	
	if( animationList.length <= curAnim  ) {  
		 curAnim = 0;
		 curParticle = 0;
	} else if(curAnim < 0){
		 curAnim = animationList.length-1;
 		 curParticle = curAnim;
	}
	
	curParticleName = particleList[curParticle];
	this.SetParticle();
}

function particleExec(){
/*
	if(resourcesPath == "Arum"){
		switch(curParticle){
			case 0:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_magic4m).setParticle();
			break;
			case 1:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_magic8m).setParticle();
			break;
			case 2:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_magic20m).setParticle();
			break;
			case 3:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_damage).setParticle();
			break;
			case 4:
				return;
			break;
			case 5:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_seduce).setParticle();
			break;
			case 6:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_materialization).setParticle();
			break;
		}
	}else if(resourcesPath == "Asphodel"){
		switch(curParticle){
			case 0:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_magic4m).setParticle();
			break;
			case 1:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_magic8m).setParticle();
			break;
			case 2:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_magic20m).setParticle();
			break;
			case 3:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_damage).setParticle();
			break;
			case 4:
				return;
			break;
			case 5:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_seduce).setParticle();
			break;
			case 6:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_materialization).setParticle();
			break;
		}
	}
*/
}

function SetParticle(){

	/*
	if(resourcesPath == "Arum"){
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_magic4m).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_magic8m).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_magic20m).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_materialization).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_seduce).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_seduced).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_damage).enabled = false;
	}else if(resourcesPath == "Asphodel"){
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_magic4m).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_magic8m).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_magic20m).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_materialization).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_seduce).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_seduced).enabled = false;
		obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_damage).enabled = false;
	}




	Destroy(GameObject.Find("eff_succubus_seduced_00(Clone)"));
	Destroy(GameObject.Find("seduce_particle_instance(Clone)"));
	Destroy(GameObject.Find("magic_particle0m_instance(Clone)"));
	Destroy(GameObject.Find("magic_particle4m_instance(Clone)"));
	Destroy(GameObject.Find("magic_particle8m_instance(Clone)"));
	Destroy(GameObject.Find("magic_particle20m_instance(Clone)"));

	if(resourcesPath == "Arum"){
		switch(curParticle){
			case 0:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_magic4m).enabled = true;
			break;
			case 1:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_magic8m).enabled = true;
			break;
			case 2:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_magic20m).enabled = true;
			break;
			case 3:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_damage).enabled = true;
			break;
			case 4:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_seduced).enabled = true;
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_seduced).time = 0;
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_seduced).playFlg = true;
			break;
			case 5:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_seduce).enabled = true;
			break;
			case 6:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_a_materialization).enabled = true;
			break;
		}
	}else if(resourcesPath == "Asphodel"){
		switch(curParticle){
			case 0:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_magic4m).enabled = true;
			break;
			case 1:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_magic8m).enabled = true;
			break;
			case 2:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_magic20m).enabled = true;
			break;
			case 3:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_damage).enabled = true;
			break;
			case 4:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_seduced).enabled = true;
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_seduced).time = 0;
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_seduced).playFlg = true;
			break;
			case 5:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_seduce).enabled = true;
			break;
			case 6:
				obj.GetComponent(succubus_twins_character_pack_v0112_viewer_succubus_b_materialization).enabled = true;
			break;
		}
	}
	this.particleExec();
	*/
}


function SetInitModel() { 
	curModel =0;
	ModelChange(modelList[curModel]+lodList[curLOD]);
} 

function SetNextModel(_add:int) {
	curModel +=_add;

	if( modelList.Length <= curModel  ) {  
		 curModel = 0;
	} else if(curModel<0){
		 curModel = modelList.Length-1;
	}
	ModelChange(modelList[curModel]+lodList[curLOD]);
}

function SetNextLOD(_add:int) { 
	curLOD +=_add;
	
	if( lodList.Length <= curLOD  ) {  
		 curLOD = 0;
	}else if(curLOD<0){
		 curLOD = lodList.Length-1;
	}
	this.ModelChange(modelList[curModel]+lodList[curLOD]);
	this.SetInitParticle();
	
	if(functionList["facial"])
	{
		if(curLOD == 0)
		{
			this.SetFacialBlendShape(curFacial);
		}
		else
		{
			this.SetFacialTex(curFacial);
		}
	}
}

function ModelChange(_name:String){
	if(_name){
		print("ModelChange : "+_name);
		curModelName = Path.GetFileNameWithoutExtension(_name);
		var loaded = Resources.Load(_name ,GameObject);
		Destroy(obj); 
    	
		obj = Instantiate(loaded) as GameObject;
   	
		SM = obj.GetComponentInChildren(typeof(SkinnedMeshRenderer)) as SkinnedMeshRenderer;
		SM.quality = SkinQuality.Bone4;
		SM.updateWhenOffscreen = true;
		viewCam.ModelTarget(GetBone(obj,boneName));
		

		var i = 0;
		for each( var mat:Material in SM.GetComponent.<Renderer>().sharedMaterials){
			if(mat.name == facialMatName+"_m"){
				SM.GetComponent.<Renderer>().materials[i] = faceMat_M;
			}else if(mat.name == facialMatName+"_l"){
				SM.GetComponent.<Renderer>().materials[i] = faceMat_L;
			}
			i++;
		}
		for each ( var anim:AnimationState in animTest.GetComponent.<Animation>()) {
			obj.GetComponent.<Animation>().AddClip(anim.clip,anim.name);
		}
		//this.facialMaterialSet();
  		this.SetAnimation(""+animationList[curAnim]);
  		this.SetAnimationSpeed( animSpeed );
  	}
}




function SetAnimationSpeed(_speed:float) {
	for (var state : AnimationState in obj.GetComponent.<Animation>())
	{
	     state.speed = _speed;
	}
}

function SetInitMotion() { 
	curAnim =0;
 	SetAnimation(animationList[curAnim]);
  	SetAnimationSpeed( animSpeed );
}

function SetInitFacial() { 
	curFacial = 0;
	curFacialName = "Default";
	
	var mesh = GameObject.Find(curModelName+"_face").GetComponent(SkinnedMeshRenderer).sharedMesh;
	facialCount = mesh.blendShapeCount+1;
}

function SetFacialBlendShape(_i:int){
	var renderer : SkinnedMeshRenderer = GameObject.Find(curModelName+"_face").GetComponent(SkinnedMeshRenderer);
	var mesh = GameObject.Find(curModelName+"_face").GetComponent(SkinnedMeshRenderer).sharedMesh;
	var count : int =  facialCount-1;

	var facialNum : int = _i-1;

	//facial reset
	for(var i=0;i<facialCount-1;i++){
		renderer.SetBlendShapeWeight(i,0);	
	}
	//facial set
	if(facialNum >= 0){
		curFacialName = mesh.GetBlendShapeName(facialNum);
		renderer.SetBlendShapeWeight(facialNum,100);
	}else{
		curFacialName = "default";
	}
}

function facialMaterialSet(){
	if(curLOD != 0){
		var fName = faceObjName+lodList[curLOD]+"_face";
		
		var i = 0;
		var faceObj = GameObject.Find(fName);
		//faceSM = faceObj.GetComponentInChildren(typeof(SkinnedMeshRenderer)) as SkinnedMeshRenderer;
		faceSM = faceObj.GetComponent(SkinnedMeshRenderer);
		
		for each( var mat:Material in faceSM.GetComponent.<Renderer>().sharedMaterials){
			if(mat.name == facialMatName+"_m"){
				faceSM.GetComponent.<Renderer>().materials[i] = faceMat_M;
			}else if(mat.name == facialMatName+"_l"){
				faceSM.GetComponent.<Renderer>().materials[i] = faceMat_L;
			}
			i++;
		}
	}
}


function SetNextFacial(_add:int) {
	curFacial +=_add;
	
	
	if(facialCount <= curFacial){
		curFacial = 0;
	}else if(curFacial < 0){
		curFacial = facialCount-1;
	}
	
	if(curLOD == 0){
		this.SetFacialBlendShape(curFacial);
	}else{
		this.SetFacialTex(curFacial);
	}
}


function SetFacialTex(_i:int){
	this.facialMaterialSet();

	var file    : String = texturePath+"/"+facialTexList[_i]+lodList[curLOD];
	var matName : String = facialMatName+lodList[curLOD] + " (Instance)";
	var tex     : Texture2D = Resources.Load(file ,Texture2D);

	curFacialName = facialTexList[_i];

	for each( var mat:Material in faceSM.GetComponent.<Renderer>().sharedMaterials){


		if(mat){
		if(mat.name ==  matName){
			mat.SetTexture("_MainTex", tex);
		}
		}
	}
}

function SetNextMotion(_add:int) {
	curAnim +=_add;
	if( animationList.length <= curAnim  ) {  
		 curAnim = 0;
	} else if(curAnim < 0){
		 curAnim = animationList.length-1;
	}
	SetAnimation(animationList[curAnim]);
 	SetAnimationSpeed( animSpeed );
}

function SetAnimation(_name:String){ 
	if(_name){
		print("SetAnimation : "+_name);
		curAnimName = ""+_name;
		obj.GetComponent.<Animation>().Play(curAnimName); 

		SetFixedFbx( xDoc, obj, curModelName, curAnimName, curLOD ) ;
	}
}

function SetInitBackGround() { 
	//BGObject.SetActive (false);
	//BGEff.SetActive (false);
	//BGPlane.SetActive (false);
 
	curBG =0;
	SetBackGround(backGroundList[curBG]);
}

function SetNextBackGround(_add:int) {
	curBG +=_add;
	if( backGroundList.length <= curBG  ) {  
		 curBG = 0;
	}  else if(curBG < 0){
		 curBG = backGroundList.length-1;
	}
	SetBackGround(backGroundList[curBG]);
}

function SetBackGround(_name:String) {
	var objBill = GameObject.Find("BillBoard") as GameObject;


/* model set
	if(curBG == 0){
		objBill.renderer.material.mainTexture = Resources.Load( viewerBackGroundPath + "/bg1" ,Texture2D);
		BGObject.SetActive (true);
	 	BGEff.SetActive (true);
		BGPlane.SetActive (false);
	}else{
		objBill.renderer.material.mainTexture = Resources.Load( viewerBackGroundPath + "/bg0" ,Texture2D);
		BGObject.SetActive (false);
		BGEff.SetActive (false);
		BGPlane.SetActive (true);
	}
*/
	//Textures
	if(_name){
		print("SetBackGround : "+_name);
		curBgName = Path.GetFileNameWithoutExtension(_name);
		var loaded = Resources.Load(_name ,Texture2D);
		var obj = GameObject.Find("BillBoard") as GameObject;
		obj.GetComponent.<Renderer>().material.mainTexture =  loaded;
	}
	//StageTex
	loaded = Resources.Load(stageTexList[curBG] ,Texture2D);
	//obj = GameObject.Find("Plane") as GameObject;
	planeObj.GetComponent.<Renderer>().material.mainTexture =  loaded;
	if(curBG == 0)
	{
		planeObj.SetActive(false);
	}
	else
	{
		planeObj.SetActive(true);
	}
}

function GetBone(_obj:GameObject,_bone:String){
	var SM:SkinnedMeshRenderer = _obj.GetComponentInChildren(typeof(SkinnedMeshRenderer)) as SkinnedMeshRenderer;
	if (SM){
		for each( var t:Transform in  SM.bones ){
			if (t.name == _bone ) {
				return t;
			}
		}
	}
} 

function SetFixedFbx( _xDoc:XmlDocument, _obj:GameObject, _model:String, _anim:String, _lod:int ){
	if(_xDoc==null)return;
	if(_obj==null)return; 

	var xNode:XmlNode;
	var xNodeTex:XmlNode;
	var xNodeAni:XmlNode;
	var t:String;

	/*
	t = "Root/Texture[@Lod=''or@Lod='" + _lod + "'][Info[@Model=''or@Model='" + _model + "'][@Ani=''or@Ani='" + _anim + "']]" ;
	xNodeTex = _xDoc.SelectSingleNode(t);
 
	if(xNodeTex){ 
		var matname:String = xNodeTex.Attributes["Material"].InnerText;
		var property:String = xNodeTex.Attributes["Property"].InnerText;
		var file:String = xNodeTex.Attributes["File"].InnerText;
		print("Change Texture To "+matname+" : " + property +" : "+file);
		for each( var mat:Material in SM.renderer.sharedMaterials){
			if(mat){
			if(mat.name ==  matname){
				var tex:Texture2D = Resources.Load(file ,Texture2D);
				mat.SetTexture( property, tex);
			}
			}
		}
	} 
	*/
	
    t = "Root/Animation[@Lod=''or@Lod='" + _lod + "'][Info[@Model=''or@Model='" + _model + "'][@Ani=''or@Ani='" + _anim + "']]" ;
	xNodeAni = _xDoc.SelectSingleNode(t);
	 
	if(xNodeAni){ 
		var ani:String = xNodeAni.Attributes["File"].InnerText;
		curAnimName = ani;
		print("Change Animation To "+curAnimName);
		_obj.GetComponent.<Animation>().Play(curAnimName);
	}


    t = "Root/Texture[@Lod=''or@Lod='" + _lod + "'][Info[@Model=''or@Model='" + _model + "'][@Ani=''or@Ani='" + _anim + "']]" ;
	xNodeTex = _xDoc.SelectSingleNode(t);
 
	if(xNodeTex){ 
		var matname:String = xNodeTex.Attributes["Material"].InnerText;
		var property:String = xNodeTex.Attributes["Property"].InnerText;
		var file:String = xNodeTex.Attributes["File"].InnerText;
		print("Change Texture To "+matname+" : " + property +" : "+file);
		for each( var mat:Material in SM.GetComponent.<Renderer>().sharedMaterials){
			if(mat){
			if(mat.name ==  matname){
				var tex:Texture2D = Resources.Load(file ,Texture2D);
				mat.SetTexture( property, tex);
			}
			}
		}
	} 



	//init Position
	var pos   : Vector3;
	var rot   : Vector3;
    t = "Root/Position[@Ani=''or@Ani='" + _anim + "']";
	xNodeAni = _xDoc.SelectSingleNode(t);
	if(xNodeAni){ 
		pos.x = float.Parse(xNodeAni.Attributes["PosX"].InnerText);
		pos.y = float.Parse(xNodeAni.Attributes["PosY"].InnerText);
		pos.z = float.Parse(xNodeAni.Attributes["PosZ"].InnerText);
		rot.x = float.Parse(xNodeAni.Attributes["RotX"].InnerText);
		rot.y = float.Parse(xNodeAni.Attributes["RotY"].InnerText);
		rot.z = float.Parse(xNodeAni.Attributes["RotZ"].InnerText);
		
		obj.transform.position    = pos;
		obj.transform.eulerAngles = rot;
		
		positionY = pos.y;
	}
	
}