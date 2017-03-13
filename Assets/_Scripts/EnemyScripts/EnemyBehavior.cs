using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class EnemyBehavior : MonoBehaviour
{

    //Enemy's health
    public int health;
    //The speed at which the enemy will chase the player.
    public float chaseSpeed;
    //How close the enemy needs to be in order to attack the player.
    public float attackDistance;
    //The amount of damage a ranged attack from this enemy causes - not needed for melee
    public int rangedAttackDamage;

    //Enemy's Animator component
    [HideInInspector]
    public Animator enemyAnim;
    //Enemy's Character Controller
    [HideInInspector]
    public CharacterController charController;
    //The player
    [HideInInspector]
    public GameObject player;

    //(May need to find out a way to get it from the animator itself)
    public AnimationClip risingAnim;
    //The attack animation - will attach an event to it so the enemy attacks each time.
    public AnimationClip attackAnim;
    //The take damage animation
    public AnimationClip takeDamageAnim;

    //The projectile prefab - used for enemies with ranged attacks
    public GameObject projectilePref;

    //Event that will be attached to the attack animation - should allow the enemy to attack in sync with its animation.
    AnimationEvent attackEvent;

    //The attackBox is the collider child of the enemy.  If the player enters that collider, they can take damage.
    public GameObject attackBox;

    [HideInInspector]
    public IEnemyState enemyState;
    [HideInInspector]
    public RisingState risingState;
    [HideInInspector]
    public ChaseState chaseState;
    /*[HideInInspector]
    public AttackState attackState;
    [HideInInspector]
    public ShootingState shootingState;*/
    [HideInInspector]
    public TakeDamageState takeDamageState;
    [HideInInspector]
    public DeathState deathState;

    public int attackStateSelection;

    //private IEnemyState selStartState;
    //private IEnemyState selChaseState;
    [HideInInspector]
    public IEnemyState selAttackState;
    //private IEnemyState selTakeDamageState;
    //private IEnemyState selDeathState;


    private void Awake()
    {
        /*GameObject test = this.gameObject;
        Debug.Log(test);
        Debug.Log(test.GetType());*/
        //Debug.Log(this);

        //string classname = this.GetType().ToString();

        risingState = new RisingState(this);
        chaseState = new ChaseState(this);
        //attackState = new AttackState(this);
        takeDamageState = new TakeDamageState(this);
        deathState = new DeathState(this);

        if (attackStateSelection == 0)
        {
            selAttackState = new AttackState(this);
        }
        else if (attackStateSelection == 1)
        {
            selAttackState = new ShootingState(this);
        }
        else
        {
            Debug.Log("Illegal State Selected for 'selAttackState.  Please use 0 or 1");
        }
        //startingState = System.Activator.CreateInstance(Type.GetType(startingStr));
        //enemyState.
        //Type startingType = Type.GetType(startingStr);
        
    }

    // Use this for initialization
    void Start()
    {
        /*attackEvent = new AnimationEvent();
        //Time into the attack animation where the damage (putting up the collider/trigger) will take place.  The timing can be experimented with.
        attackEvent.time = 0.1F;
        attackEvent.functionName = "EnemyMeleeAttack";

        //Note to self: An animation event will be applied to all instances of the clip, not just the one in the animator controller.
        attackAnim.AddEvent(attackEvent);*/

        enemyAnim = GetComponent<Animator>();
        charController = GetComponent<CharacterController>();
        player = GameObject.FindGameObjectWithTag("Player");

        //attackBox = transform.FindChild("EnemyMeleeAttack").gameObject;
        //attackBox.SetActive(false);

        enemyState = risingState;
    }

    // Update is called once per frame
    void Update()
    {
        enemyState.UpdateState();
    }

    //Attach to animation itself?
    IEnumerator EnemyMeleeAttack()
    {
        //Check for attackBox?
        attackBox.SetActive(true);
        yield return new WaitForSeconds(0.5F);
        attackBox.SetActive(false);
    }

    void EnemyShootingAttack()
    {
        Debug.Log("Shoot");
        GameObject newProjectile = Instantiate(projectilePref, transform.position + transform.forward * 2 + new Vector3(0,1,0) , transform.rotation) as GameObject;
        newProjectile.GetComponent<Damage>().setDamage(rangedAttackDamage);
    }

    private void OnTriggerEnter(Collider other)
    {
        enemyState.OnTriggerEnter(other);
    }
}
