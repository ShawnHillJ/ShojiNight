using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttackState : IEnemyState
{
    //This is a basic melee attack state.  As long as the player is within range, the enemy will keep attacking.

    private EnemyBehavior enemy;

    public AttackState(EnemyBehavior newEnemy)
    {
        Debug.Log("Attack State selected");
        enemy = newEnemy;
    }

    public void UpdateState()
    {
        //Vector3 moveDirection = new Vector3(enemy.player.transform.position.x - enemy.transform.position.x, enemy.transform.position.y, enemy.player.transform.position.z - enemy.transform.position.z);
		Vector3 moveDirection = new Vector3(enemy.player.transform.position.x - enemy.transform.position.x, 0, enemy.player.transform.position.z - enemy.transform.position.z);
		enemy.transform.rotation = Quaternion.LookRotation(moveDirection);

        if(moveDirection.magnitude > enemy.attackDistance)
        {
            ToChaseState();
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
        enemy.enemyAnim.SetBool("isAttacking", false);
        enemy.enemyAnim.SetBool("isChasing", true);
        enemy.enemyState = enemy.chaseState;
    }

    public void ToAttackState()
    {
        Debug.Log("Already attacking...");
    }

    public void ToTakeDamageState()
    {
        enemy.enemyAnim.SetBool("isAttacking", false);
        enemy.enemyAnim.SetTrigger("takeDamage");
        enemy.enemyState = enemy.takeDamageState;
    }

    public void ToDeathState()
    {

    }
}
