using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
public class MainMenuButtonMan : MonoBehaviour {
	private AudioSource titleSound; 
	public void startGame( string startLevel )
	{
		titleSound = GetComponent<AudioSource> ();
		titleSound.Play();
		SceneManager.LoadScene ( startLevel );

	}
}
