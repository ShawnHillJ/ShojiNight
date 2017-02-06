using UnityEngine;
using System.Collections;

public class PlayerController : MonoBehaviour {

    public float health;

    public float attack;
    public float defense;
    public float thrust;
    public float combo_end_time = 0.5f;
    private float last_attack;
    private int combo;

    public float gravity = 9.8f;
    public float speed = 3.0f;
    public float turn = 0.5f;
    public float jump = 30f;

    public float move_ver = 0f;

    private CharacterController character;
    private Animator anim;

    // Use this for initialization
    void Start ()
    {
        combo = 0;
        anim = GetComponent<Animator>();
        character = GetComponent<CharacterController>();

        //StartCoroutine("Melee");
    }
	
	// Update is called once per frame
	void Update () {
	}
    

    void FixedUpdate()
    {
        playerMovement();
        playerAttack();
    }

    void playerMovement()
    {
        float move_fwd = Input.GetAxis("Vertical");
        float move_hor = Input.GetAxis("Horizontal");

        //transform.Rotate(0, move_hor * turn * Time.deltaTime, 0);
        Vector3 movement = new Vector3 (move_hor * speed, 0, move_fwd * speed);
        anim.SetFloat("Speed", movement.magnitude);
        if (movement.magnitude > 0)
            transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(movement), turn);

        if (character.isGrounded)
        {
            move_ver = 0;
            anim.SetBool("IsJumping", false);
            if (Input.GetAxis("Jump") > 0)
            {
                move_ver = jump;
                anim.SetBool("IsJumping", true);
            }
        }
        move_ver -= gravity;
        movement.y = move_ver;
        character.Move(movement * Time.deltaTime);
    }
    void playerAttack()
    {
        if (combo == 0)
            if (Input.GetButtonDown("Fire1"))
            {
                anim.SetBool("IsAttacking", true);
                combo++;
                print(combo);
                last_attack = Time.time;
            }
            else
                anim.SetBool("IsAttacking", false);
        else if ((Time.time - last_attack) < combo_end_time)
        {
            if (Input.GetButtonDown("Fire1"))
            {
                anim.SetBool("IsAttacking", true);
                combo++;
                print(combo);
                last_attack = Time.time;
            }
        }
        else
            combo = 0;
    }
}
