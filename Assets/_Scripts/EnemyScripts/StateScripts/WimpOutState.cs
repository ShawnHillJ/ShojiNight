using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WimpOutState : IEnemyState
{
    //In this state, the enemy will back away from the player until the wimp out time runs out or the enemy is damaged again.

    private EnemyBehavior enemy;

    //How long has the enemy wimped out since the last hit
    private float timeWimpedOut;
    private float wimpOutTime;


    public WimpOutState(EnemyBehavior newEnemy)
    {
        enemy = newEnemy;
        wimpOutTime = enemy.wimpOutTime;
    }

    public void UpdateState()
    {
        Vector3 enemyPos = enemy.transform.position;
        Vector3 playerPos = enemy.player.transform.position;

        //May need to fix to allow for slopes, etc.
        Vector3 moveDirection = -(new Vector3(playerPos.x - enemyPos.x, 0, playerPos.z - enemyPos.z));

        //Rotates the enemy to face away from the player
        enemy.transform.rotation = Quaternion.LookRotation(-moveDirection);

        //Enemy will back away from the player.
        enemy.charController.Move(moveDirection.normalized * enemy.chaseSpeed * Time.deltaTime);

        //After the enemy has wimped out for so long, it will return to chasing the player.
        if (timeWimpedOut > wimpOutTime)
        {
            ToChaseState();
        }
        timeWimpedOut += Time.deltaTime;
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
        Debug.Log("TO CHASE STATE!");
        timeWimpedOut = 0F;
        enemy.enemyAnim.SetBool("isChasing", true);
        enemy.enemyState = enemy.chaseState;
    }

    public void ToAttackState()
    {
    }

    public void ToTakeDamageState()
    {
        enemy.enemyAnim.SetBool("isChasing", false);
        enemy.enemyAnim.SetTrigger("takeDamage");
        timeWimpedOut = 0f;
        enemy.enemyState = enemy.takeDamageState;
    }

    public void ToDeathState()
    {
    }

    public void ToWimpOutState()
    {
    }
}
