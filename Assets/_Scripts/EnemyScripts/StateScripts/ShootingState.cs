using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ShootingState : IEnemyState
{
    //Will be a basic shooting behavior.  Enemy will shoot projectile prefabs at the player
    //Will also move away from player if player gets too close.

    private EnemyBehavior enemy;

    public ShootingState(EnemyBehavior newEnemy)
    {
        //Debug.Log("Shooting State selected.");
        enemy = newEnemy;
    }

    public void UpdateState()
    {
        Vector3 enemyPos = enemy.transform.position;
        Vector3 playerPos = enemy.player.transform.position;

        //May need fixing to allow for slopes, etc.
        Vector3 moveDirection = new Vector3( playerPos.x - enemyPos.x, 0, playerPos.z - enemyPos.z );
        enemy.transform.rotation = Quaternion.LookRotation(moveDirection);

        if ( Vector3.Distance( enemyPos, playerPos ) > enemy.attackDistance )
        {
            ToChaseState();
        }
        //Some values can be experimented with
        else if (Vector3.Distance( enemyPos, playerPos) < enemy.attackDistance / 4)
        {
            enemy.charController.Move(-moveDirection.normalized * (enemy.chaseSpeed/4) * Time.deltaTime);
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

    public void ToWimpOutState()
    {
    }
}
