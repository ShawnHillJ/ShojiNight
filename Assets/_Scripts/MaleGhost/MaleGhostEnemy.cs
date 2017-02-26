using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MaleGhostEnemy : MonoBehaviour
{
    //Enemy's health
    public int health;
    //The speed at which the enemy will chase the player.
    public float chaseSpeed;
    //How close the enemy needs to be in order to attack the player.
    public float attackDistance;

    //Enemy's Animator component
    [HideInInspector] public Animator enemyAnim;
    //Enemy's Character Controller
    [HideInInspector] public CharacterController charController;
    //The player
    [HideInInspector] public GameObject player;

    //(May need to find out a way to get it from the animator itself)
    public AnimationClip risingAnim;
    //The attack animation - will attach an event to it so the enemy attacks each time.
    public AnimationClip attackAnim;
    //The take damage animation
    public AnimationClip takeDamageAnim;

    //Event that will be attached to the attack animation - should allow the enemy to attack in sync with its animation.
    AnimationEvent attackEvent;

    //The attackBox is the collider child of the enemy.  If the player enters that collider, they can take damage.
    GameObject attackBox;

    [HideInInspector] public IMaleGhostState enemyState;
    [HideInInspector] public RisingState risingState;
    [HideInInspector] public ChaseState chaseState;
    [HideInInspector] public AttackState attackState;
    [HideInInspector] public TakeDamageState takeDamageState;
    [HideInInspector] public DeathState deathState;

    private void Awake()
    {
        risingState = new RisingState(this);
        chaseState = new ChaseState(this);
        attackState = new AttackState(this);
        takeDamageState = new TakeDamageState(this);
        deathState = new DeathState(this);
    }

    // Use this for initialization
    void Start ()
    {
        attackEvent = new AnimationEvent();
        //Time into the attack animation where the damage (putting up the collider/trigger) will take place.  The timing can be experimented with.
        attackEvent.time = 0.1F;
        attackEvent.functionName = "EnemyMeleeAttack";

        //Note to self: An animation event will be applied to all instances of the clip, not just the one in the animator controller.
        attackAnim.AddEvent(attackEvent);

        enemyAnim = GetComponent<Animator>();
        charController = GetComponent<CharacterController>();
        player = GameObject.FindGameObjectWithTag("Player");

        attackBox = transform.FindChild("EnemyMeleeAttack").gameObject;
        attackBox.SetActive(false);

        enemyState = risingState;
	}
	
	// Update is called once per frame
	void Update ()
    {
        enemyState.UpdateState();
	}

    IEnumerator EnemyMeleeAttack()
    {
        attackBox.SetActive(true);
        yield return new WaitForSeconds(0.5F);
        attackBox.SetActive(false);
    }

    private void OnTriggerEnter(Collider other)
    {
        enemyState.OnTriggerEnter(other);
    }
}
