using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChaseState : IEnemyState
{
    //In this state, the enemy will chase after the player until it is close enough to attack or it takes damage.

    private EnemyBehavior enemy;

    public ChaseState (EnemyBehavior newEnemy)
    {
        enemy = newEnemy;
    }
    
    public void UpdateState()
    {
        //Rotates the enemy to face the player
        //y component isn't affected by player to prevent the enemy from turning at weird angles when the player jumps.
        //Vector3 moveDirection = new Vector3(enemy.player.transform.position.x - enemy.transform.position.x, enemy.transform.position.y, enemy.player.transform.position.z - enemy.transform.position.z);
		Vector3 moveDirection = new Vector3(enemy.player.transform.position.x - enemy.transform.position.x, 0, enemy.player.transform.position.z - enemy.transform.position.z);
		//Debug.Log ("before " + enemy.transform.rotation);
		enemy.transform.rotation = Quaternion.LookRotation(moveDirection);
		Debug.Log ("enemy" + enemy.transform.position);
		Debug.Log ("player" + enemy.player.transform.position);
		Debug.Log ("moveDirection" + moveDirection);
		//Debug.Log ("after" + enemy.transform.rotation);

        //Attacks if the player is close enough
        if (moveDirection.magnitude < enemy.attackDistance)
        {
            ToAttackState();
        }
        //If not close enough, the enemy runs towards the player
        else
        {
            enemy.charController.Move(moveDirection.normalized * enemy.chaseSpeed * Time.deltaTime);
            //can step over short obstacles, but need to find out gravity or something to make it return to the ground
            //unless we design it without such
        }
    }

    //Checks if the enemy should be taking damage.
    public void OnTriggerEnter(Collider other)
    {
        //For player melee, an enemy being hit will shut off the player's attack collider
        if (other.CompareTag("PlayerMelee") || other.CompareTag("PlayerRanged"))
        {
            //Gets the damage from the Damage class and subtracts it from the enemy's health
            int minusHealth = other.GetComponent<Damage>().getDamage();
            enemy.health -= minusHealth;
            //Shuts off collider if melee attack.
            if (other.CompareTag("PlayerMelee"))
            {
                other.gameObject.SetActive(false);
            }
            //Destroys the projectile that hit the enemy.
            else
            {
                GameObject.Destroy(other.gameObject);
            }
            Vector3 moveDirection = new Vector3(other.transform.position.x - enemy.transform.position.x, enemy.transform.position.y, other.transform.position.z - enemy.transform.position.z);
            enemy.takeDamageState.knockbackDir = -moveDirection;
            enemy.takeDamageState.knockbackSpeed = other.GetComponent<Damage>().getKnockback();
            ToTakeDamageState();
        }
    }

    public void ToChaseState()
    {
        Debug.Log("Already chasing...");
    }

    public void ToAttackState()
    {
        enemy.enemyAnim.SetBool("isChasing", false);
        enemy.enemyAnim.SetBool("isAttacking", true);
        enemy.enemyState = enemy.selAttackState;
    }

    public void ToTakeDamageState()
    {
        enemy.enemyAnim.SetBool("isChasing", false);
        enemy.enemyAnim.SetTrigger("takeDamage");
        enemy.enemyState = enemy.takeDamageState;
    }

    public void ToDeathState()
    {
    }
}
