import System.IO;
import System.Xml;
import System.Text.RegularExpressions;

#pragma strict
var guiSkin           : GUISkin;
var viewCam           : taichi_twin_viewscript;
var boneName          : String = "Hips";
var camGuiBodyRect    : Rect   = Rect (870,25,93,420);
var modelBodyRect     : Rect   = Rect (20,40,300,500);
var textGuiBodyRect   : Rect   = Rect (20,510,300,70);
var sliderGuiBodyRect : Rect   = Rect (770,520,170,150);
var sliderTextBodyRect : Rect = Rect (770,520,170,150);

private var segmentCode : String = "_B";

private var CharacterCode     : String = "M01/";
private var FBXListFile       : String = "fbx_list";
private var AnimationListFile : String = "animation_list";
private var AnimationListFileAll : String = "animation_list_all";

private var FbxCtrlFile       : String = "fbx_ctrl";

private var ParticleListFile  : String = "ParticleList";
private var ParticleAnimationListFile : String = "ParticleAnimationList";
private var FacialTexListFile : String = "facial_texture_list";
private var facialMatName     : String = "succubus_a_face";

private var curParticle    : float  = 1;
private var curCharacterName: String = "";


//var TitleTextFile            : String = "TitleText";
var guiOn             : boolean = true;
private var initPosX          : float   = -0.3f;
private var autoResourceMode  : boolean = true;

private var settingFileDir : String  = "Taichi/TwinViewer Settings/";

private var curBG        : int = 0;
private var curAnim      : int = 0;
private var curModel     : int = 0;
private var curCharacter : int = 0;
private var curFacial    : int = 1;

private var animReplay   : boolean = true;
private var playOnceFlg  : boolean = true;

private var resourcesPathFull : String = "Assets/Taichi Character Pack/Resources/Taichi";
private var resourcesPath     : String = "";

private var animSpeed    : float = 1;
private var motionDelay  : float = 0;

private var curLOD       : float  = 0;
private var curModelName : String = "";
private var curAnimName  : String = "";
private var curBgName    : String = "";
private var curFacialName: String = "";
private var curParticleName: String = "";

private var facialCount    : int   = 0;
private var positionY      : float = 0;
private var animationPath  : String;

private var animationList     : String[];
private var animationListAll  : String[];
private var animationNameList : String[];
private var modelList         : String[];
private var modelNameList     : String[];
private var facialTexList     : String[];
private var particleAnimationList : String[];
private var particleList          : String[];

private var animSpeedSet   : float;
private var backGroundList : String[];
private var stageTexList   : String[];
private var lodList        : String[] =["_h","_m","_l"];
private var lodTextList    : String[] =["Hi","Mid","Low"];
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
private var CamMode     : int     = 0;

//private var titleText : String = "";
private var xDoc      : XmlDocument;
private var xNodeList : XmlNodeList;

private var nowTime : float   = 0;
private var playFlg : boolean = true;

private var faceMat_L : Material;
private var faceMat_M : Material;

private var BGObject  : GameObject;
private var BGEff     : GameObject;
private var BGPlane   : GameObject;

private var functionList:Hashtable=new Hashtable();
private var planeObj : GameObject;

function Start () {
	viewCam = GameObject.Find("Main Camera").GetComponent("taichi_twin_viewscript");
	nowTime += Time.deltaTime;

//	txt = Resources.Load(settingFileDir+"BackGroundList", TextAsset);
//	backGroundList =txt.text.Split(["\r","\n"],1);

//	txt = Resources.Load(settingFileDir+"StageTexList", TextAsset);
//	stageTexList =txt.text.Split(["\r","\n"],1);

	this.SetSettings(0);
//	this.SetInitBackGround();
    this.SetInitModel();
	this.SetInitMotion(); 
	this.SetAnimationSpeed(animSpeed);
	
	obj.transform.position.x    = initPosX;
}

private var animationPlayFlgOld : boolean;
function Update () {

	if(
		!obj.GetComponent.<Animation>().IsPlaying(curAnimName) && 
		animationPlayFlgOld
	){
		nowTime = 0;
		playFlg = true;
	}

	animationPlayFlgOld = obj.GetComponent.<Animation>().IsPlaying(curAnimName);

	nowTime += Time.deltaTime;
	if(nowTime > motionDelay){
		SetAnimationSpeed(animSpeedSet);
		this.playAnimation();
	}else{
		SetAnimationSpeed(0);
		this.playAnimation();
	}


	if (Input.GetKeyDown("1"))SetNextModel(-1);
	if (Input.GetKeyDown("2"))SetNextModel(-1);
				
	if (Input.GetKeyDown("q"))SetNextMotion(-1);
	if (Input.GetKeyDown("w"))SetNextMotion(1);

	if (Input.GetKeyDown("a"))SetNextBackGround(-1);
	if (Input.GetKeyDown("s"))SetNextBackGround(1);

	if (Input.GetKeyDown("z"))SetNextLOD(-1);
	if (Input.GetKeyDown("x"))SetNextLOD(1);
}
private var onSliderFlg : int;
function scrollBarPos(){
	var minPos     : Vector2[];
	var maxPos     : Vector2[];
	var popupCount : int = 10;
	
	onSliderFlg = 0;
	
	minPos    = new Vector2[popupCount];
	maxPos    = new Vector2[popupCount];

	var maxX = Screen.width - 10;
	var minX = Screen.width - (sliderGuiBodyRect.width+sliderTextBodyRect.width+10);

	//Right Slider

	minPos[0] = Vector2(minX,267);
	maxPos[0] = Vector2(maxX,295);

	minPos[1] = Vector2(minX,235);
	maxPos[1] = Vector2(maxX,267);

	minPos[2] = Vector2(minX,205);
	maxPos[2] = Vector2(maxX,235);

	minPos[3] = Vector2(minX,175);
	maxPos[3] = Vector2(maxX,205);

	minPos[4] = Vector2(minX,130);
	maxPos[4] = Vector2(maxX,175);
	
	minPos[5] = Vector2(minX,85);
	maxPos[5] = Vector2(maxX,130);


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

private var scale: Vector3;
function OnGUI () {

if (guiSkin) {
	GUI.skin = guiSkin;
}

if(!guiOn)return;
    scale.x = 1;
    scale.y = 1;
    scale.z = 1.0;
    GUI.matrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, scale);

	var sw : float = Screen.width;
	var sh : float = Screen.height;

	//GUI Parts Adjust
	textGuiBodyRect.y = sh-(textGuiBodyRect.height+10);
	textGuiBodyRect.x = sw-(textGuiBodyRect.width+10);


	sliderGuiBodyRect.y = sh-(sliderGuiBodyRect.height+textGuiBodyRect.height+28);
	sliderTextBodyRect.y = sh-(sliderTextBodyRect.height+textGuiBodyRect.height+15);

	sliderGuiBodyRect.x  = sw-(sliderGuiBodyRect.width+sliderTextBodyRect.width+15);
	sliderTextBodyRect.x = sw-(sliderTextBodyRect.width+10);

	modelBodyRect.x = sw-(modelBodyRect.width+10);


	this.scrollBarPos();
	
	var buttonSpace : float = 8;

	GUILayout.BeginArea (modelBodyRect);
		GUILayout.BeginVertical();

			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","Left")) SetNextCharacter(-1);
			GUILayout.Label( "","Chara");
			if (GUILayout.Button ("","Right"))SetNextCharacter(1);
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);
			
			if(functionList["model"])
			{
				GUILayout.BeginHorizontal();
				if (GUILayout.Button ("","Left")) SetNextModel(-1);
				GUILayout.Label( "","Costume");
				if (GUILayout.Button ("","Right"))SetNextModel(1);
				GUILayout.EndHorizontal();
				GUILayout.Space(buttonSpace);
			}else{
				GUI.color.a = 0.5f;
				GUILayout.BeginHorizontal();
				if (GUILayout.Button ("","LeftGrayOut")){}
				GUILayout.Label( "","Costume");
				if (GUILayout.Button ("","RightGrayOut")){}
				GUILayout.EndHorizontal();
				GUILayout.Space(buttonSpace);
				GUI.color.a = 1.0f;
			}
					  
			GUILayout.BeginHorizontal();
			if (GUILayout.Button ("","Left")) SetNextMotion(-1);
			
			var animReplayVal = GUILayout.Toggle(animReplay,"","AnimReplay");
			if (animReplay != animReplayVal) {
				animReplay = animReplayVal;
			}
			if(animReplay)
			{
				playOnceFlg = true;
			}
			if (GUILayout.Button ("","Right"))SetNextMotion(1);
			GUILayout.EndHorizontal();
			GUILayout.Space(buttonSpace);

			if(functionList["facial"])
			{
				GUILayout.BeginHorizontal();
				if (GUILayout.Button ("","Left")) SetNextFacial(-1);
				GUILayout.Label( "","Facial");
				if (GUILayout.Button ("","Right"))SetNextFacial(1);
				GUILayout.EndHorizontal();
				GUILayout.Space(buttonSpace);
			}else{
				GUI.color.a = 0.5f;
				GUILayout.BeginHorizontal();
				if (GUILayout.Button ("","LeftGrayOut")){}
				GUILayout.Label( "","Facial");
				if (GUILayout.Button ("","RightGrayOut")){}
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
				GUILayout.FlexibleSpace();
			}else{
				GUI.color.a = 0.5f;
				GUILayout.BeginHorizontal();
				if (GUILayout.Button ("","LeftGrayOut")){}
				GUILayout.Label( "","LOD");
				if (GUILayout.Button ("","RightGrayOut")){}
				GUILayout.EndHorizontal();
				GUILayout.FlexibleSpace();
				GUI.color.a = 1.0f;
			}
		GUILayout.EndVertical(); 
	GUILayout.EndArea ();


	//Slider Text

	GUILayout.BeginArea (sliderTextBodyRect);
		GUILayout.FlexibleSpace();

		var positionXText = "Position X : " + String.Format("{0:F1}", obj.transform.position.x);
		GUILayout.Box(positionXText);
		GUILayout.FlexibleSpace();

		var positionYText = "Position Y : " + String.Format("{0:F1}", obj.transform.position.y);
		GUILayout.Box(positionYText);
		GUILayout.FlexibleSpace();			

		var positionZText = "Position Z : " + String.Format("{0:F1}", obj.transform.position.z);
		GUILayout.Box(positionZText);
		GUILayout.FlexibleSpace();			

		var rotateText = "Rotate : " + String.Format("{0:F1}", obj.transform.eulerAngles.y);
		GUILayout.Box(rotateText);
		GUILayout.FlexibleSpace();			

		var animSpeedText = "Animation\nSpeed : " + String.Format("{0:F1}", animSpeed);
		GUILayout.Box(animSpeedText);
		GUILayout.FlexibleSpace();

		var motionTimingText = "Motion\nDelay : " + String.Format("{0:F1}", motionDelay);
		GUILayout.Box(motionTimingText);		
		GUILayout.FlexibleSpace();

	GUILayout.EndArea ();
	//Slider GUI
	GUILayout.BeginArea (sliderGuiBodyRect);
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

		//Position Y
		if(onSliderFlg == 2) GUI.color.a = 1.0f;
		else GUI.color.a = 0.4f;
		var posYVal:float = GUILayout.HorizontalSlider(obj.transform.position.y, 0, 3);
		if(obj.transform.position.y != posYVal){
			obj.transform.position.y = posYVal;
			viewCam.MouseLock(true);
		}else{
			viewCam.MouseLock(false);
		}
		GUILayout.Space(0);

		//Position Z
		if(onSliderFlg == 3) GUI.color.a = 1.0f;
		else GUI.color.a = 0.4f;
		var posZVal:float = GUILayout.HorizontalSlider(obj.transform.position.z, 1, -1);
		if(obj.transform.position.z != posZVal){
			obj.transform.position.z = posZVal;
			viewCam.MouseLock(true);
		}else{
			viewCam.MouseLock(false);
		}
		GUILayout.Space(-3);

		//Rotate Y
		if(onSliderFlg == 4) GUI.color.a = 1.0f;
		else GUI.color.a = 0.4f;
		var rotVal:float = GUILayout.HorizontalSlider(obj.transform.eulerAngles.y, 0, 359.9);
		if(obj.transform.eulerAngles.y != rotVal){ 
			obj.transform.eulerAngles.y = rotVal;
			viewCam.MouseLock(true);
		}else{
			viewCam.MouseLock(false);
		}
		GUILayout.Space(6);

		if(onSliderFlg == 5) GUI.color.a = 1.0f;
		else GUI.color.a = 0.4f;
		//Motion Speed
		animSpeedSet = GUILayout.HorizontalSlider(animSpeed, 0, 2);
		if(animSpeed != animSpeedSet){
			animSpeed = animSpeedSet;
			SetAnimationSpeed(animSpeed);
			viewCam.MouseLock(true);
		}else{
			viewCam.MouseLock(false);
		}
		GUILayout.Space(13);

		if(onSliderFlg == 6) GUI.color.a = 1.0f;
		else GUI.color.a = 0.4f;
		//Motion timing
		var delayVal:float = GUILayout.HorizontalSlider(motionDelay, 0, 5);
		if(motionDelay != delayVal){
			motionDelay = delayVal;
			viewCam.MouseLock(true);
		}else{
			viewCam.MouseLock(false);
		}
	GUILayout.EndArea();
	GUI.color.a = 1.0f;

	var text:String="";
	text += "Character : " + curCharacterName + "\n";
	if(functionList["model"])text += "Costume : " + (curModel+1) + " / " + modelList.length + " : " + curModelName + "\n";
	text += "Animation : " + (curAnim+1) + " / " +(animationList.length) +" : "+curAnimName+ "\n";
	if(functionList["facial"])	text += "Facial : " + (curFacial+1) + " / " +(facialCount) +" : "+curFacialName+ "\n";
	//text += "BackGround : " + (curBG+1)+" / " +backGroundList.length + " : " + curBgName + "\n";
	if(functionList["lod"])text += "Quality : " + lodTextList[curLOD]+ "\n";
	GUI.Box(textGuiBodyRect,text);
}


function SetInit(){
    SetInitModel();
	SetInitMotion();
	SetAnimationSpeed(animSpeed);
	if(functionList["facial"])
	{
		SetInitFacial();
	}
}

function timerReset(){
	nowTime=0;
	obj.GetComponent.<Animation>().Stop();
	playOnceFlg = true;

}


function sliderReset(){
	obj.transform.eulerAngles.y = 0;
	obj.transform.position.x = -0.3;
	obj.transform.position.y = 0;
	obj.transform.position.z = 0;
	animSpeed = 1;
	motionDelay = 0;
	SetAnimationSpeed(animSpeed);
}

function SetSettings(_i:int){
	var fbxSetting     : String;
	var animSetting    : String;
	var fbxCtrlSetting : String;


	curAnim  = 0;
	curModel = 0;
	curLOD   = 0;

	switch(_i){
		// Taichi Hayami
		case 0:	
			resourcesPathFull      = "Assets/Taichi Character Pack/Resources/Taichi";	
			resourcesPath          = "Taichi/";
			animationPath          = "Taichi/Animations Legacy/m01@";
			CharacterCode          = "M01/";
			AnimationListFile      = "animation_list";
			AnimationListFileAll   = "animation_list";

			fbxCtrlSetting         = "Taichi/TwinViewer Settings/"+CharacterCode+"fbx_ctrl";
			faceMat_L              = Resources.Load("Taichi/Materials/m01_face_00_l", Material);
			faceMat_M              = Resources.Load("Taichi/Materials/m01_face_00_m", Material);
			functionList["model"]  = true;
			functionList["facial"] = false;
			functionList["lod"]    = true;
			
			curCharacterName = "Taichi Hayami";
		break;
		
		// puppet
		case 1:
			resourcesPathFull = "Assets/Taichi Character Pack/Resources/Puppet";
			resourcesPath     = "Puppet/";
			animationPath     = "Taichi/Animations Legacy/m01@";
			AnimationListFile = "animation_list";
			AnimationListFileAll = "animation_list";

			CharacterCode     = "Puppet/";
			
			//animTest          = animTestM01;
			fbxCtrlSetting    = settingFileDir+CharacterCode+"fbx_ctrl";
			functionList["model"]  = false;
			functionList["facial"] = false;
			functionList["lod"]    = false;

			curCharacterName = "Puppet";
		break;
		// HonokaFutaba
		case 2:
			resourcesPathFull = "Assets/HonokaFutabaBasicSet/Resources/Honoka";
			resourcesPath     = "Honoka/";
			animationPath     = "Honoka/Animations Legacy/f01@";
			AnimationListFile = "animation_list";
			AnimationListFileAll = "animation_list_all";

			CharacterCode = "F01/";
			//animTest = animTestF01;
/*
			fbxSetting     = "Viewer Settings/HonokaFutaba/FBXList";
			animSetting    = "Viewer Settings/HonokaFutaba/AnimationList";
			animTest = animHonoka;
*/

			fbxCtrlSetting    = settingFileDir+CharacterCode+"fbx_ctrl";
			functionList["model"]  = true;
			functionList["facial"] = false;
			functionList["lod"]    = true;
			faceMat_L = Resources.Load("Honoka/Materials/f01_face_00_l", Material);
			faceMat_M = Resources.Load("Honoka/Materials/f01_face_00_m", Material);
			
			curCharacterName = "Honoka Futaba";

		break;

		// AoiKiryu
		case 3:
			resourcesPathFull = "Assets/Aoi Character Pack/Resources/Aoi";
			resourcesPath     = "Aoi/";
			animationPath     = "Aoi/Animations Legacy/f02@";
			AnimationListFile = "animation_list";
			AnimationListFileAll = "animation_list_all";

			CharacterCode = "F02/";
			//animTest = animTestF02;

/*
			fbxSetting     = "Viewer Settings/AoiKiryu/FBXList";
			animSetting    = "Viewer Settings/AoiKiryu/AnimationList";
			animTest = animAoi;
*/
			fbxCtrlSetting    = settingFileDir+CharacterCode+"fbx_ctrl";
			functionList["model"]  = true;
			functionList["facial"] = false;
			functionList["lod"]    = true;
			faceMat_L = Resources.Load("Aoi/Materials/f02_face_00_l", Material);
			faceMat_M = Resources.Load("Aoi/Materials/f02_face_00_m", Material);

			curCharacterName = "Aoi Kiryu";

		break;

		// Succubus Arum
		case 4:
			resourcesPathFull = "Assets/Succubus Twins Character Pack Ver1.10/Resources/Arum/";
			resourcesPath     = "Arum/";
			animationPath     = "Arum/Animations Legacy/animation@";
			AnimationListFile = "animation_list_a";
			AnimationListFileAll = "animation_list_a";

			FacialTexListFile = settingFileDir+CharacterCode+"facial_texture_list_a";

			CharacterCode = "F03/Arum/";
			//animTest = animTestF03_0;
/*
			fbxSetting     = "Viewer Settings/Arum/FBXList";
			animSetting    = "Viewer Settings/Arum/AnimationList";
			animTest = animArum;
*/
			fbxCtrlSetting    = settingFileDir+CharacterCode+"fbx_ctrl";
			functionList["model"]  = false;
			functionList["facial"] = true;
			functionList["lod"]    = true;
			
			txt = Resources.Load(FacialTexListFile, TextAsset);
			facialTexList =txt.text.Split(["\r","\n"],1);
			
			
			
			faceObjName = "succubus_a";
			facialMatName = "succubus_a_face";
			faceMat_L = Resources.Load("Arum/Materials/succubus_a_face_l", Material);
			faceMat_M = Resources.Load("Arum/Materials/succubus_a_face_m", Material);
			FacialTexListFile = settingFileDir+CharacterCode+"facial_texture_list_a";

			curCharacterName = "Succubus Arum";
		break;

		// Succubus Asphodel
		case 5:
			resourcesPathFull = "Assets/Succubus Twins Character Pack Ver1.10/Resources/Asphodel/";
			resourcesPath     = "Asphodel/";
			animationPath     = "Asphodel/Animations Legacy/animation@";
			CharacterCode     = "F03/Asphodel/";
			AnimationListFile = "animation_list_b";
			AnimationListFileAll = "animation_list_b";
			
			FacialTexListFile = settingFileDir+CharacterCode+"facial_texture_list_b";

			//animTest          = animTestF03_1;
			fbxCtrlSetting    = settingFileDir+CharacterCode+"fbx_ctrl";
/*
			fbxSetting     = "Viewer Settings/Asphodel/FBXList";
			animSetting    = "Viewer Settings/Asphodel/AnimationList";
			animTest = animAsphodel;
*/
			functionList["model"]  = false;
			functionList["facial"] = true;
			functionList["lod"]    = true;
			
			txt = Resources.Load(FacialTexListFile, TextAsset);
			facialTexList =txt.text.Split(["\r","\n"],1);
			
			faceObjName = "succubus_b";
			facialMatName = "succubus_b_face";

			faceMat_L = Resources.Load("Asphodel/Materials/succubus_b_face_l", Material);
			faceMat_M = Resources.Load("Asphodel/Materials/succubus_b_face_m", Material);
			curCharacterName = "Succubus Asphodel";
		break;
		
		// Satomi Makise
		case 6:
			resourcesPathFull = "Assets/Satomi Character Pack/Resources/Satomi";	
			resourcesPath     = "Satomi/";
			animationPath     = "Satomi/Animations Legacy/f05@";
			AnimationListFile = "animation_list";
			AnimationListFileAll = "animation_list_all";
	
			CharacterCode = "F05/";
			//animTest = animTestM01;
			fbxCtrlSetting    = settingFileDir+CharacterCode+"fbx_ctrl";
			faceMat_L = Resources.Load("Satomi/Materials/f05_face_00_l", Material);
			faceMat_M = Resources.Load("Satomi/Materials/f05_face_00_m", Material);
			functionList["model"]  = true;
			functionList["facial"] = false;
			functionList["lod"]    = true;
			curCharacterName = "Satomi Makise";

		break;
	}
	txt = Resources.Load(settingFileDir+CharacterCode+FBXListFile, TextAsset);
	modelList =txt.text.Split(["\r","\n"],1);	

	txt = Resources.Load(settingFileDir+CharacterCode+AnimationListFile, TextAsset);
	animationList =txt.text.Split(["\r","\n"],1);
	
	txt = Resources.Load(settingFileDir+CharacterCode+AnimationListFileAll, TextAsset);
	animationListAll =txt.text.Split(["\r","\n"],1);

//	txt = Resources.Load(fbxSetting, TextAsset);
//	modelList =txt.text.Split(["\r","\n"],1);
//	this.setModelList();

//	txt = Resources.Load(animSetting, TextAsset);
//	animationList =txt.text.Split(["\r","\n"],1);
//	this.setAnimationList();

	txt = Resources.Load(fbxCtrlSetting, TextAsset);
	xDoc = new XmlDocument();
	xDoc.LoadXml( txt.text );

	this.SetInit();
}


function SetNextCharacter(_add:int){
	curCharacter +=_add;

	if( curCharacter > 6  ) {  
		 curCharacter = 0;
	} else if(curCharacter < 0){
		 curCharacter = 6;
	}
	
	switch(curCharacter)
	{
		case 0:
			CharacterCode = "M01/";
		break;
		case 1:
			CharacterCode = "Puppet/";
		break;
		case 2:
			CharacterCode = "F01/";
		break;
		case 3:
			CharacterCode = "F02/";
		break;
		case 4:
			CharacterCode = "F03/Arum/";
		break;
		case 5:
			CharacterCode = "F03/Asphodel/";
		break;
		case 6:
			CharacterCode = "F05/";
		break;
	}

	txt = Resources.Load(settingFileDir+CharacterCode+FBXListFile, TextAsset);
	modelList =txt.text.Split(["\r","\n"],1);
	var loaded = Resources.Load(modelList[0]+"_h" ,GameObject);
	
	if(loaded == null){
		this.SetNextCharacter(_add);
	}
	
	SetSettings(curCharacter);
}


function characterExistCheck()
{


}



//-----------------------
// setAnimationList
//-----------------------
/*
function setAnimationList(){
	//Search to Animation Directory
	var info = new DirectoryInfo(resourcesPathFull+"Animations Legacy");
	var fileInfo = info.GetFiles();
	var fileName:String[];

	animationList = new String[fileInfo.Length/2-1];
	animationNameList = new String[fileInfo.Length/2-1];

	var i : int = 0;
	for (file in fileInfo)
	{
    	if(
			file.Extension == ".fbx" && 
			file.Name != "animation.fbx"
		){
			var fileNameAll : String = Regex.Replace(file.Name, ".fbx", "");
			fileName = fileNameAll.Split(["@"],1);

			animationList[i]     = fileNameAll;
			animationNameList[i] = fileName[1];
			i++;
		}
	}
}
*/

//-----------------------
// setAnimationList
//-----------------------
function setAnimationList_old(){
	var AnimationClipAll:Object[] = Resources.LoadAll("Animations Legacy",AnimationClip);

	for (file in AnimationClipAll)
	{
		var clip : AnimationClip = file;
	}
}


//-----------------------
// setModelList
//-----------------------
/*
function setModelList(){
	//Search to Models Directory
	var info     = new DirectoryInfo(resourcesPathFull+"Models Legacy");
	var fileInfo = info.GetFiles();
	var fileNameArray : String[];
	var fileName      : String;
	var fileNameOld   : String;

	var fileCount : int = fileInfo.Length/2/3;

	modelList     = new String[fileCount];
	modelNameList = new String[fileCount];
	
	var i : int = 0;
	for (file in fileInfo)
	{
    	if(file.Extension == ".fbx")
    	{
			var fileNameAll : String = Regex.Replace(file.Name, ".fbx", "");
			fileNameArray = fileNameAll.Split(["_"],1);
			fileName = "";
			for(var fi = 0;fi < fileNameArray.Length-1;fi++){
				if(fi == 0){
					fileName += fileNameArray[fi];
				}else{
					fileName += "_"+fileNameArray[fi];
				}
			}
			if(fileNameOld != fileName){
				modelList[i] = fileName;
				fileNameOld  = fileName;
				i++;
			}
		}
	}
}
*/

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


function SetInitFacial() { 

	curFacial = 0;
	curFacialName = "Default";

	var Obj  = GameObject.Find(curModelName+"_face");
	
	var mesh = Obj.GetComponent(SkinnedMeshRenderer).sharedMesh;
	facialCount = mesh.blendShapeCount+1;
	
	Obj.name = Obj.name + segmentCode;
}

function SetFacialBlendShape(_i:int){


	var renderer : SkinnedMeshRenderer = GameObject.Find(curModelName+"_face"+segmentCode).GetComponent(SkinnedMeshRenderer);
	var mesh = GameObject.Find(curModelName+"_face"+segmentCode).GetComponent(SkinnedMeshRenderer).sharedMesh;
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

function SetFacialTex(_i:int){
	var file    : String = resourcesPath+"Textures/"+facialTexList[_i]+lodList[curLOD];
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

function facialMaterialSet(){
	if(curLOD != 0){
		var fName = faceObjName+lodList[curLOD]+"_face";
		var i = 0;
		var faceObj = GameObject.Find(fName);
		
		//faceSM = faceObj.GetComponentInChildren(typeof(SkinnedMeshRenderer)) as SkinnedMeshRenderer;
		faceSM = faceObj.GetComponent(SkinnedMeshRenderer);
		
		for each( var mat:Material in faceSM.GetComponent.<Renderer>().sharedMaterials){
			if(mat.name == faceMat_M.name){
				faceSM.GetComponent.<Renderer>().materials[i] = faceMat_M;
			}else if(mat.name == faceMat_L.name){
				faceSM.GetComponent.<Renderer>().materials[i] = faceMat_L;
			}
			i++;
		}
	}
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
	ModelChange(modelList[curModel]+lodList[curLOD]);
	
	if(functionList["facial"])
	{
		if(curLOD == 0){
			var Obj  = GameObject.Find(curModelName+"_face");
			if(Obj)	Obj.name = Obj.name + segmentCode;
			this.SetFacialBlendShape(curFacial);
		}else{
			this.SetFacialTex(curFacial);
		}
	}
	
}

function ModelChange(_name:String){
	if(_name){
		//print("ModelChange : "+_name);
		curModelName = Path.GetFileNameWithoutExtension(_name);
		//var loaded = Resources.Load(resourcesPath+"Models Legacy/"+_name ,GameObject);
		var loaded = Resources.Load(_name ,GameObject);
		if(obj){
			var pos = obj.transform.position;
			var rotY = obj.transform.eulerAngles.y;		
		}
		Destroy(obj); 
		
		obj = Instantiate(loaded) as GameObject;
		obj.transform.position      = pos;
		obj.transform.eulerAngles.y = rotY;

		SM = obj.GetComponentInChildren(typeof(SkinnedMeshRenderer)) as SkinnedMeshRenderer;
		SM.quality = SkinQuality.Bone4;
		SM.updateWhenOffscreen = false;

		/*
		for (f in animationList){
			var animClip : AnimationClip = Resources.Load(resourcesPath+"Animations Legacy/"+f, AnimationClip);
			obj.animation.AddClip(animClip,animClip.name);
		}

  		SetAnimation(""+animationNameList[curAnim]);
  		SetAnimationSpeed( animSpeed );
		*/
		
		
		//FacialMaterialCopy puppet reject
		if(curCharacter != 1){
			var i = 0;
			
			for each( var mat:Material in SM.GetComponent.<Renderer>().sharedMaterials){
				if(mat.name == faceMat_M.name){
					SM.GetComponent.<Renderer>().materials[i] = faceMat_M;
				}else if(mat.name == faceMat_L.name){
					SM.GetComponent.<Renderer>().materials[i] = faceMat_L;
				}
				i++;
			}
		}
		
		//AnimationClip Add
		for each(var animName : String in animationListAll) {
			var animObj : GameObject = Resources.Load(animationPath+animName);

			if(animObj)
			{
				var anim = animObj.GetComponent.<Animation>().clip;
				obj.GetComponent.<Animation>().AddClip(anim,animName);
			}

		}

/*
		for each ( var anim:AnimationState in animTest.animation) {
			obj.animation.AddClip(anim.clip,anim.name);
		}
*/
		viewCam.ModelTarget(GetBone(obj,boneName));

		if(functionList["facial"])
		{
			this.facialMaterialSet();
		}
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
 	//SetAnimation(animationNameList[curAnim]);
 	SetAnimation(animationList[curAnim]);
  	SetAnimationSpeed( animSpeed );
}

function SetNextMotion(_add:int) {
	curAnim +=_add;
	playOnceFlg = true;
	
	if( animationList.length <= curAnim  ) {  
		 curAnim = 0;
	} else if(curAnim < 0){
		 curAnim = animationList.length-1;
	}

	//SetAnimation(animationNameList[curAnim]);
	SetAnimation(animationList[curAnim]);
  	SetAnimationSpeed( animSpeed );
}

function playAnimation(){
	obj.GetComponent.<Animation>().wrapMode = WrapMode.Once;
	
	var animObj : GameObject = Resources.Load(animationPath+curAnimName);
	if(animObj)
	{
		if(playOnceFlg)obj.GetComponent.<Animation>().Play(curAnimName); 
	}
	else
	{
		SetNextModel(-1);
		SetNextModel(1);
		print(curAnimName + " animation clip does not exist");
	}
	
	
	if(animReplay && playOnceFlg)
	{
		playOnceFlg = true;
	}
	else
	{
		playOnceFlg = false;
	}
}

function SetAnimation(_name:String){ 
	if(_name){
		//print("SetAnimation : "+_name);
		curAnimName = ""+_name;

		//obj.animation.wrapMode = WrapMode.Once;
		//obj.animation.Play(curAnimName);
		this.timerReset();
		SetFixedFbx( xDoc, obj, curModelName, curAnimName, curLOD ) ;
	}
}
 
function SetInitBackGround() { 
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
	return;
	if(_name){
		//print("SetBackGround : "+_name);
		
		//BackGround		
		curBgName = Path.GetFileNameWithoutExtension(_name);
		var loaded = Resources.Load(_name ,Texture2D);
		var obj = GameObject.Find("BillBoard") as GameObject;
		obj.GetComponent.<Renderer>().material.mainTexture =  loaded;
		
		
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
	
    t = "Root/Texture[@Lod=''or@Lod='" + _lod + "'][Info[@Model=''or@Model='" + _model + "'][@Ani=''or@Ani='" + _anim + "']]" ;
	xNodeTex = _xDoc.SelectSingleNode(t);
 
	if(xNodeTex){ 
		var matname:String = xNodeTex.Attributes["Material"].InnerText;
		var property:String = xNodeTex.Attributes["Property"].InnerText;
		var file:String = xNodeTex.Attributes["File"].InnerText;
		//print("Change Texture To "+matname+" : " + property +" : "+file);
		for each( var mat:Material in SM.GetComponent.<Renderer>().sharedMaterials){
			if(mat){
			if(mat.name ==  matname){
				
				var tex:Texture2D = Resources.Load(file ,Texture2D);
				mat.SetTexture( property, tex);
			}
			}
		}
	} 
	
    t = "Root/Animation[@Lod=''or@Lod='" + _lod + "'][Info[@Model=''or@Model='" + _model + "'][@Ani=''or@Ani='" + _anim + "']]" ;
	xNodeAni = _xDoc.SelectSingleNode(t);
	 
	if(xNodeAni){ 
		var ani:String = xNodeAni.Attributes["File"].InnerText;
		curAnimName = ani;
		//print("Change Animation To "+curAnimName);
		_obj.GetComponent.<Animation>().Play(curAnimName);
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
		
		//obj.transform.position = pos;
		//obj.transform.eulerAngles = rot;
		
		obj.transform.position.y = pos.y;
	}	
	
	
	
}