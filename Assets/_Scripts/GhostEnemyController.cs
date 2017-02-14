using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GhostEnemyController : MonoBehaviour
{
    //Enemy's health
    public int health;
    //The speed at which the enemy will chase the player.
    public float chaseSpeed;
    //How close the enemy needs to be in order to attack the player.
    public float attackDistance;

    //Enemy's Animator component
    private Animator enemyAnim;
    //Enemy's Character Controller
    private CharacterController charController;
    //The player
    private GameObject player;

    //Will delay Update a bit to allow the ghost to perform a "rise" animation.
    private bool hasRisen;
    //The first animation in the animator
    //(May need to find out a way to get it from the animator itself)
    public AnimationClip firstAnim;
    //The attack animation - will attach an event to it so the enemy attacks each time.
    public AnimationClip attackAnim;

    //Event that will be attached to the attack animation - should allow the enemy to attack in sync with its animation.
    AnimationEvent attackEvent;

	// Use this for initialization
	void Start ()
    {
        attackEvent = new AnimationEvent();
        //Time into the attack animation where the damage (putting up the collider/trigger) will take place.  The timing can be experimented with.
        attackEvent.time = 0.3F;
        attackEvent.functionName = "EnemyMeleeAttack";

        attackAnim.AddEvent(attackEvent);

        enemyAnim = GetComponent<Animator>();
        charController = GetComponent<CharacterController>();
        player = GameObject.FindGameObjectWithTag("Player");

        //The "ghost" will perform its "rising from ground" animation
        enemyAnim.SetBool("isRisen", true);
        hasRisen = false;

        float risingTime = firstAnim.length;
        StartCoroutine(WaitForAnimation(risingTime));
    }
	
	// Update is called once per frame
	void Update ()
    {
        if (hasRisen)
        {
            //Rotates the enemy to face the player
            //y component isn't affected by player to prevent the enemy from turning at weird angles when the player jumps.
            Vector3 moveDirection = new Vector3(player.transform.position.x - transform.position.x, transform.position.y, player.transform.position.z - transform.position.z);
            transform.rotation = Quaternion.LookRotation(moveDirection);

            //Attacks if the player is close enough
            if (moveDirection.magnitude < attackDistance)
            {
                enemyAnim.SetBool("isAttacking", true);
            }
            //If not close enough, the enemy runs towards the player
            else
            {
                enemyAnim.SetBool("isAttacking", false);
                charController.Move(moveDirection.normalized * chaseSpeed * Time.deltaTime);
                //can step over short obstacles, but need to find out gravity or something to make it return to the ground
                //unless we design it without such
            }
        }
    }

    //Will prevent the enemy from chasing the player until the "rising" animation is complete
    IEnumerator WaitForAnimation(float waitTime)
    {
        yield return new WaitForSeconds(waitTime);
        hasRisen = true;
    }

    void EnemyMeleeAttack()
    {
        Debug.Log("Punch");
        //Put up the collider or trigger to allow the enemy to attack
        //Take down the collider or trigger after some time - coroutine
    }
}
