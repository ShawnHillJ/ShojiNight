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
    //Is the portal activated and pulling enemies in?
    private bool isActivated;


    //A prefab of a button prompt
    public GameObject buttonPrefab;

    //GameObject that will indicate when the player can press E to activate the portal.
    private GameObject ePrompt;

	//Particle system for ground notification effect
	public GameObject groundEffect;


	// Use this for initialization
	void Start ()
    {
		
		//Deactivate groundportal on start
		groundEffect.SetActive(false);
		//Debug.Log (enemies.Length );
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
        if( allEnemiesDead && !isActivated )
        {
			Debug.Log ("allEnemiesDead && !isActivated");
            //Makes the "E" prompt hover over the portal regardless of camera position.
            ePrompt.GetComponent<RectTransform>().position = Camera.main.WorldToScreenPoint( transform.position + Vector3.up );

            //If the player presses E and the conditions are met, the enemies will be destroyed.
            if ( Input.GetKeyDown( KeyCode.E ) )
            {
                for ( int i = 0; i < enemies.Length; i++ )
                {
                    //For now.
                    ePrompt.SetActive( false );
                    isActivated = true;
                    //Destroy(enemies[i]);
					//Turn ground portal on
					groundEffect.SetActive(true);
                }
            }
        }

        //If the player has pressed E to activate the portal, the enemies will be sucked in.
        if(isActivated)
        {
            //Checks if there are enemies that haven't been absorbed by the portal.
            bool allEnemiesToExp = true;

            for ( int i = 0; i < enemies.Length; i++ )
            {
                if ( enemies[i].activeSelf )
                {

                    allEnemiesToExp = false;

                    //Moves enemies towards the ground portal.
                    float step = Time.deltaTime;
                    enemies[i].transform.position = Vector3.MoveTowards(enemies[i].transform.position, groundEffect.transform.position, step);

                    //Once an enemy is close enough to the groundportal, the enemy is deactivated.
                    if ((enemies[i].transform.position - groundEffect.transform.position).magnitude < Mathf.Abs(0.1F))
                    {

						
                        //A player experience gain function can go here.
                        enemies[i].SetActive(false);
                    }
                }
            }
            //Once the portal has destroyed all of the enemies, this script will be deactivated.
            if ( allEnemiesToExp )
            {
				
					this.enabled = false;
				
            }


        }
	}

    //When the player gets close to the portal
    void OnTriggerEnter (Collider other)
    {
        if (other.tag.Equals("Player"))
        {
            inPortalRange = true;
            if (allEnemiesDead && !isActivated)
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
