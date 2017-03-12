using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ProjectileController : MonoBehaviour
{
    //This class controls enemy projectiles

    //The direction in which the projectile will go
    public Vector3 moveDirection;

    //The speed of the projectile
    public float moveSpeed;

    //The distance the projectile can travel from where it started
    public float moveRange;

    //point which the projectile started - kept track of for range
    private Vector3 origin;

    // Use this for initialization
	void Start ()
    {
        origin = transform.position;
	}
	
	//Moves the projectile in the direction of Vector3 moveDirection
	void Update ()
    {
        //gameObject.transform.Translate(Time.deltaTime * moveSpeed * moveDirection.x, 0, Time.deltaTime * moveSpeed * moveDirection.z);
        gameObject.transform.Translate(Time.deltaTime * Vector3.forward);
        //charControl.Move(moveDirection.normalized * moveSpeed * Time.deltaTime);

        //Destroys the projectile after it travels a certain distance
        //Give the shots a range
        if ((transform.position - origin).magnitude > moveRange)
        {
            Destroy(gameObject);
        }
	}

    //Allows the speed and direction of the projectiles to be set from another class.
    public void setValues(Vector3 newDirection, float newSpeed)
    {
        moveDirection = newDirection;
        moveSpeed = newSpeed;
    }

    void OnTriggerEnter(Collider other)
    {
        //Debug.Log("Entering " + other.gameObject.name);

        //If the projectile hits a non-trigger collider that isn't the player, it is destroyed
        //Prevents it from going through walls
        if (!other.tag.Equals("Player"))
        {
            Destroy(gameObject);
        }
    }
}
