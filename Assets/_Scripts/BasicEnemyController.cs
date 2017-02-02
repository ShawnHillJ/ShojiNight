using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BasicEnemyController : MonoBehaviour
{
    //How far the enemy can see - used for raycast
    public float maxDist;

    //Enemy's animation component
    private Animation enemyAnim;

	void Start ()
    {
        enemyAnim = GetComponent<Animation>();
	}
	
	void Update ()
    {
        RaycastHit hit;
        Ray ray = new Ray(transform.position, transform.forward);

        if (Physics.Raycast(ray, out hit, maxDist))
        {
            //Checks if the raycast hit the player.
            //Currently shows attack animation when it sees the player, idle when it doesn't.
            if (hit.transform.gameObject.tag.Equals("Player"))
            {
                enemyAnim.CrossFade("Attack");
            }
            else
            {
                enemyAnim.CrossFade("idle");
            }
        }
        else
        {
            enemyAnim.CrossFade("idle");
        }
	}
}
