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
    //Number of dead enemies.
    private int deadEnemyNum;

    //A prefab of a button prompt
    public GameObject buttonPrefab;

    //GameObject that will indicate when the player can press E to activate the portal.
    private GameObject ePrompt;

	// Use this for initialization
	void Start ()
    {
        for (int i = 0; i < enemies.Length; i++)
        {
            //Checks that each member of enemies has the EnemyBehavior script.  Debug purposes.
            EnemyBehavior temp = enemies[i].GetComponent<EnemyBehavior>();
            if (temp == null)
            {
                Debug.Log(enemies[i] + " does not have enemy behavior script.");
            }
            else
            {
                temp.portal = gameObject;
            }
        }

        ePrompt = Instantiate(buttonPrefab) as GameObject;
        ePrompt.transform.SetParent(GameObject.Find("ButtonPrompts").transform);
        ePrompt.SetActive(false);

        inPortalRange = false;
        allEnemiesDead = false;
    }
	
	void Update ()
    {
        if(allEnemiesDead && inPortalRange)
        {
            //Makes the "E" prompt hover over the portal regardless of camera position.
            ePrompt.GetComponent<RectTransform>().position = Camera.main.WorldToScreenPoint(transform.position + Vector3.up);

            //If the player presses E and the conditions are met, the enemies will be destroyed.
            if (Input.GetKeyDown(KeyCode.E))
            {
                for (int i = 0; i < enemies.Length; i++)
                {
                    //For now.
                    Destroy(enemies[i]);
                }
            }
        }
	}

    //When the player gets close to the portal
    void OnTriggerEnter (Collider other)
    {
        if (other.tag.Equals("Player"))
        {
            inPortalRange = true;
            if (allEnemiesDead)
            {
                ePrompt.SetActive(true);
            }
        }
    }

    //When the player moves away from the portal
    void OnTriggerExit(Collider other)
    {
        if(other.tag.Equals("Player"))
        {
            inPortalRange = false;
            ePrompt.SetActive(false);
            //ePrompt.text.
        }
    }

    //A "reporter" function that the enemies can call when they die
    public void EnemyDeathUpdate()
    {
        deadEnemyNum += 1;

        //When all the enemies are dead, the player will be able to press E to remove them.
        //Also makes the "E" prompt appear if the player is close to the portal.
        if (deadEnemyNum >= enemies.Length)
        {
            allEnemiesDead = true;
            
            if(inPortalRange)
            {
                ePrompt.SetActive(true);
            }
        }
    }
}
