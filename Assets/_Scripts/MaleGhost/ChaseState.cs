using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChaseState : IMaleGhostState
{
    private MaleGhostEnemy enemy;

    public ChaseState (MaleGhostEnemy maleGhostEnemy)
    {
        enemy = maleGhostEnemy;
    }
    
    public void UpdateState()
    {
        //Rotates the enemy to face the player
        //y component isn't affected by player to prevent the enemy from turning at weird angles when the player jumps.
        Vector3 moveDirection = new Vector3(enemy.player.transform.position.x - enemy.transform.position.x, enemy.transform.position.y, enemy.player.transform.position.z - enemy.transform.position.z);
        enemy.transform.rotation = Quaternion.LookRotation(moveDirection);

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
        enemy.enemyState = enemy.attackState;
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
