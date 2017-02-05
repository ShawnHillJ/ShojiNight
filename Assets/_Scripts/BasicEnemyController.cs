using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BasicEnemyController : MonoBehaviour
{
    //How far the enemy can see - used for raycast
    public float maxDist;
    //Enemy's hit points
    public float health;
    //Walking and running speeds
    public float walkSpeed;
    public float runSpeed;

    //The points the enemy will travel between when he can't see the player
    public Vector3[] patrolPoints;
    //The index of the next point the enemy will travel to
    int nextPoint;

    //Enemy's animation component
    private Animation enemyAnim;
    //Enemy's CharacterController component
    private CharacterController charController;
    //The player
    private GameObject player;

    void Start ()
    {
        enemyAnim = GetComponent<Animation>();
        charController = GetComponent<CharacterController>();
        player = GameObject.FindGameObjectWithTag("Player");

        nextPoint = 0;
    }
	
	void Update ()
    {
        //Hopefully deals with some strange issue where bumping into the player would
        //push it off the ground and make the raycast useless
        transform.position = new Vector3(transform.position.x, 0, transform.position.z);

        RaycastHit hit;
        Ray ray = new Ray(transform.position, transform.forward);
        //Need to work on giving the enemy a better field of view - something other than Raycast?

        //Reacts to player if spotted
        if (Physics.Raycast(ray, out hit, maxDist) && hit.transform.gameObject == player)
        {
            //Checks if the raycast hit the player.
            Vector3 moveDirection = player.transform.position - transform.position;
            //Rotates the enemy to face the player
            transform.rotation = Quaternion.LookRotation(moveDirection);

            //Attacks if the player is close enough
            if (moveDirection.magnitude < 1.5)
            {
                enemyAnim.CrossFade("Attack");
            }
            //If not close enough, the enemy runs towards the player
            else
            {
                enemyAnim.CrossFade("Run");
                charController.Move(moveDirection.normalized * runSpeed * Time.deltaTime);
                //can step over short obstacles, but need to find out gravity or something to make it return to the ground
                //unless we design it without such
            }
        }
        //Patrols otherwise
        else
        {
            //Moves enemy towards next patrol point and changes animation
            Vector3 moveDirection = patrolPoints[nextPoint] - transform.position;
            enemyAnim.CrossFade("Walk");
            charController.Move(moveDirection.normalized * walkSpeed * Time.deltaTime);

            //Checks if the enemy is close to its next point - exact doesn't work
            if((transform.position - patrolPoints[nextPoint]).magnitude < 0.1)
            {
                //If it is, the nextPoint is updated to the next index of patrolPoints
                if (nextPoint == patrolPoints.Length - 1)
                {
                    nextPoint = 0;
                }
                else
                    nextPoint++;
                //Rotates the enemy to face it's next patrol point
                transform.rotation = Quaternion.LookRotation(patrolPoints[nextPoint] - transform.position);
            }
        }
    }
}
