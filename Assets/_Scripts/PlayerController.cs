using UnityEngine;
using System.Collections;
using System.Linq;

public class PlayerController : MonoBehaviour
{

    public float health = 100f;

    public float attack = 10f;
    public float defense = 10f;
    public float combo_end_time = 0.5f;
    private float last_attack;
    private int combo;

    public float gravity = 3f;
    public float speed = 3.0f;
    public float turn = 0.5f;
    public float jump = 30f;

    public float move_ver = 0f;

    private CharacterController character;
    private Animator anim;
    AnimationEvent attackEvent;
    GameObject attackBox;
    public AnimationClip[] attackAnim;

    // Use this for initialization
    void Start()
    {
        combo = 0;
        anim = GetComponent<Animator>();
        character = GetComponent<CharacterController>();

        attackEvent = new AnimationEvent();
        //Time into the attack animation where the damage (putting up the collider/trigger) will take place.  The timing can be experimented with.
        attackEvent.time = 0.1F;
        attackEvent.functionName = "PlayerMeleeTest";

        for (int i = 0; i < attackAnim.Length; i++)
        {
            if (attackAnim[i].length > 0.4f)
                attackEvent.time = 0.3f;
            else
                attackEvent.time = 0.1f;
            attackAnim[i].AddEvent(attackEvent);
        }

        attackBox = transform.FindChild("PlayerMeleeTest").gameObject;
        attackBox.SetActive(false);
        //StartCoroutine("Melee");
    }

    // Update is called once per frame
    void Update()
    {
    }


    void FixedUpdate()
    {
        playerAttack();
        if (!anim.GetBool("IsAttacking"))           //Player should stop moving when attacking
            playerMovement();
    }

    void playerMovement()
    {
        //Controls are relative to camera
        float move_fwd = Input.GetAxis("Vertical");
        float move_hor = Input.GetAxis("Horizontal");

        //Convert from camera-centered coordinates to fixed space-coordinates
        float fixed_x = Camera.main.transform.forward.x * move_fwd + Camera.main.transform.right.x * move_hor;
        float fixed_z = Camera.main.transform.forward.z * move_fwd + Camera.main.transform.right.z * move_hor;

        Vector3 movement = new Vector3(fixed_x * speed, 0, fixed_z * speed);
        
        //Triggers different animations depending on speed (except vertical)
        anim.SetFloat("Speed", movement.magnitude);
        /*
        if (Input.GetAxis("Fire3") > 0)
        {
            transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(ClosestEnemies()[0].transform.position - transform.position), turn);
        }
        else */
        //Rotates the player towards the direction of user-controlled motion (relative to the camera)
        if (movement.magnitude > 0)
            transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(movement), turn);


        if (character.isGrounded)
        {
            move_ver = 0;
            if (Input.GetAxis("Jump") > 0)
            {
                move_ver = jump;
                anim.SetBool("IsJumping", true);
            }
            else
                anim.SetBool("IsJumping", false);
        }
        move_ver -= gravity;
        movement.y = move_ver;
        character.Move(movement * Time.deltaTime);
    }
    GameObject[] ClosestEnemies ()
    {
        GameObject[] targets;
        targets = GameObject.FindGameObjectsWithTag("Enemy");
        Vector3 position = transform.position;

        targets.OrderBy(target => (target.transform.position - transform.position).sqrMagnitude);
        return targets;
    }
    IEnumerator PlayerMeleeTest()
    {
        attackBox.SetActive(true);
        yield return new WaitForSeconds(0.5F);
        attackBox.SetActive(false);
    }
    void playerAttack()
    {
        if (combo == 0)
            if (Input.GetButtonDown("Fire1"))
            {
                singleAttack();
            }
            else
                anim.SetBool("IsAttacking", false);
        else if ((Time.time - last_attack) < combo_end_time)
        {
            if (Input.GetButtonDown("Fire1"))
            {
                singleAttack();
            }
        }
        else
            combo = 0;
    }
    void singleAttack()
    {
        
        anim.SetBool("IsAttacking", true);
        combo++;
        //print(combo);
        last_attack = Time.time;
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.tag.Equals("EnemyMelee"))
        {
            int minusHealth = other.GetComponent<Damage>().getDamage();
            if (minusHealth > health)
            {
                health = 0;
                //Place for death animation and Destroy()
            }
            else
            {
                health -= minusHealth;
                //Place for "taking damage" animation
            }
            Debug.Log("Player: " + health);
            other.gameObject.SetActive(false);
        }
        else if (other.tag.Equals("EnemyRanged"))
        {
            int minusHealth = other.GetComponent<Damage>().getDamage();
            if (minusHealth > health)
            {
                health = 0;
            }
            else
            {
                health -= minusHealth;
            }
            Debug.Log("Player: " + health);
            Destroy(other.gameObject);
        }
    }
}
