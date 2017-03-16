using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TakeDamageState : IEnemyState
{
    //In this state, the enemy will perform a flinching animation and be immune to attacks
    //If its health goes below zero, the enemy will die.  Else, it'll go back to attacking or chasing.

    private EnemyBehavior enemy;

    private float timeDamaged;
    private float takeDamageClipLength;

    //The direction and speed which the enemy will be knocked back.
    public Vector3 knockbackDir;
    public float knockbackSpeed;

    public TakeDamageState(EnemyBehavior newEnemy)
    {
        //Debug.Log("Health: " + maleGhostEnemy.Health);
        enemy = newEnemy;
        //enemy = maleGhostEnemy;

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
            if(knockbackSpeed > 0.1)
            {
                enemy.charController.Move(knockbackDir.normalized * knockbackSpeed * Time.deltaTime);
            }
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
        enemy.enemyState = enemy.selAttackState;
    }

    public void ToTakeDamageState()
    {
        Debug.Log("Already taking damage...");
    }

    public void ToDeathState()
    {
        //Debug.Log("Dying...");
        enemy.IsDead = true;
        enemy.enemyAnim.SetTrigger("dead");
        enemy.GetComponent<CapsuleCollider>().enabled = false;
        //enemy.charController.detectCollisions isn't working properly...
        enemy.charController.detectCollisions = false;
        enemy.charController.enabled = false;
        enemy.enemyState = enemy.deathState;
    }
}

