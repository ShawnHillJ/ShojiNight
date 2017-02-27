using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TakeDamageState : IMaleGhostState
{
    private MaleGhostEnemy enemy;

    private float timeDamaged;
    private float takeDamageClipLength;

    public TakeDamageState(MaleGhostEnemy maleGhostEnemy)
    {
        enemy = maleGhostEnemy;

        takeDamageClipLength = enemy.takeDamageAnim.length;
    }

    public void UpdateState()
    {
        if (enemy.health <= 0)
        {
            ToDeathState();
        }
        else
        {
            timeDamaged += Time.deltaTime;

            if (timeDamaged > takeDamageClipLength)
            {
                Vector3 moveDirection = new Vector3(enemy.player.transform.position.x - enemy.transform.position.x, enemy.transform.position.y, enemy.player.transform.position.z - enemy.transform.position.z);
                if (moveDirection.magnitude > enemy.attackDistance)
                {
                    ToAttackState();
                }
                else
                {
                    ToChaseState();
                }
            }
        }
    }

    public void OnTriggerEnter(Collider other)
    {
    }

    public void ToChaseState()
    {
        timeDamaged = 0F;
        enemy.enemyAnim.SetBool("isChasing", true);
        enemy.enemyState = enemy.chaseState;
    }

    public void ToAttackState()
    {
        timeDamaged = 0F;
        enemy.enemyAnim.SetBool("isAttacking", true);
        enemy.enemyState = enemy.attackState;
    }

    public void ToTakeDamageState()
    {
        Debug.Log("Already taking damage...");
    }

    public void ToDeathState()
    {
        Debug.Log("Dying...");
        enemy.enemyAnim.SetTrigger("dead");
        enemy.enemyState = enemy.deathState;
    }
}

