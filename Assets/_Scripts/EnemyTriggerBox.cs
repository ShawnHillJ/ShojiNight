using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyTriggerBox : MonoBehaviour
{
    //This is a basic enemy trigger.  More complex ones will require some more coding.

    //List of enemies that will appear when the player walks into the triggerbox
    //Enemies must be set to inactive initially.
    public GameObject[] enemies;

	void OnTriggerEnter(Collider other)
    {
        //Checks if the player entered.  Activates the enemies if the player did enter.
        if(other.tag.Equals("Player"))
        {
            for(int i = 0; i < enemies.Length; i++)
            {
                enemies[i].SetActive(true);
            }
            //Deactivates the collider.
            gameObject.SetActive(false);
        }
    }
}
