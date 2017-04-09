using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
public class MainMenuButtonMan : MonoBehaviour {

	public void startGame( string startLevel )
	{
		SceneManager.LoadScene ( startLevel );
	}
}
