using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PortalInteract : MonoBehaviour
{
    //List of enemies associated with the portal
    public GameObject[] enemies;
    //The 3DText object "E"
    //public GameObject ePrompt;

    //Is the player close enough to the portal activator
    private bool inPortalRange;
    //Are all of the enemies dead?
    private bool allEnemiesDead;

    //A prefab of a button prompt
    public GameObject buttonPrefab;

    //GameObject that will indicate when the player can press E to activate the portal.
    private GameObject ePrompt;

	// Use this for initialization
	void Start ()
    {
        //Checks that each member of enemies has the EnemyBehavior script.  Debug purposes.
        for (int i = 0; i < enemies.Length; i++)
        {
            EnemyBehavior temp = enemies[i].GetComponent<EnemyBehavior>();
            if (temp == null)
            {
                Debug.Log(enemies[i] + " does not have enemy behavior script.");
            }
        }

        ePrompt = Instantiate(buttonPrefab) as GameObject;
        ePrompt.transform.parent = GameObject.Find("ButtonPrompts").transform;
        ePrompt.SetActive(false);

        inPortalRange = false;
        allEnemiesDead = false;
    }
	
	void Update ()
    {
        //If the player presses E and the conditions are met, the enemies will be destroyed.
		if (Input.GetKeyDown(KeyCode.E))
        {
            if (inPortalRange && allEnemiesDead)
            {
                Debug.Log("Destroying enemies");
                for (int i = 0; i < enemies.Length; i++)
                {
                    //For now.
                    Destroy(enemies[i]);
                }
            }
        }
        if(inPortalRange)
        {
            //Makes the "E" prompt hover over the portal regardless of camera position.
            ePrompt.GetComponent<RectTransform>().position = Camera.main.WorldToScreenPoint(transform.position + Vector3.up);
        }
	}

    void OnTriggerEnter (Collider other)
    {
        //Debug.Log("Entering portal zone");
        if (other.tag.Equals("Player"))
        {
            inPortalRange = true;
            ePrompt.SetActive(true);
        }
        if(!allEnemiesDead)
        {
            CheckEnemyDeaths();
        }
    }

    void OnTriggerExit(Collider other)
    {
        if(other.tag.Equals("Player"))
        {
            inPortalRange = false;
            ePrompt.SetActive(false);
            //ePrompt.text.
        }
    }

    //Checks all enemies in enemies to see if any are still alive.  If not, allEnemiesDead is set to true.
    void CheckEnemyDeaths()
    {
        bool enemiesDeadTemp = true;
        for (int i = 0; i < enemies.Length; i++)
        {
            if (!enemies[i].GetComponent<EnemyBehavior>().IsDead)
            {
                //Debug.Log("Enemy still alive");
                enemiesDeadTemp = false;
            }
        }
        allEnemiesDead = enemiesDeadTemp;

        //Changes the text color of the "E"
        if(allEnemiesDead)
        {
            ePrompt.GetComponent<UnityEngine.UI.Text>().color = Color.white;
        }
    }
}
