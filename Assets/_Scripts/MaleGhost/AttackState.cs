using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AttackState : IMaleGhostState
{
    private MaleGhostEnemy enemy;

    public AttackState(MaleGhostEnemy maleGhostEnemy)
    {
        enemy = maleGhostEnemy;
    }

    public void UpdateState()
    {
        Vector3 moveDirection = new Vector3(enemy.player.transform.position.x - enemy.transform.position.x, enemy.transform.position.y, enemy.player.transform.position.z - enemy.transform.position.z);
        enemy.transform.rotation = Quaternion.LookRotation(moveDirection);

        if(moveDirection.magnitude > enemy.attackDistance)
        {
            ToChaseState();
        }
    }

    public void OnTriggerEnter(Collider other)
    {
        //For player melee, an enemy being hit will shut off the player's attack collider
        if (other.tag.Equals("PlayerMelee"))
        {
            //Gets the damage from the Damage class and subtracts it from the enemy's health
            int minusHealth = other.GetComponent<Damage>().getDamage();
            enemy.health -= minusHealth;
            other.gameObject.SetActive(false);
            ToTakeDamageState();
        }
        //For player ranged, the projectile will be destroyed
        else if (other.tag.Equals("PlayerRanged"))
        {

            int minusHealth = other.GetComponent<Damage>().getDamage();
            enemy.health -= minusHealth;
            GameObject.Destroy(other.gameObject);
            ToTakeDamageState();
        }
        Debug.Log(enemy.health);
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
        enemy.enemyAnim.SetTrigger("takeDamage");
        enemy.enemyState = enemy.takeDamageState;
    }

    public void ToDeathState()
    {

    }
}
