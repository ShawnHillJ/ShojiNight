using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RisingState : IEnemyState
{
    //Performed when the enemy is first triggered.  The enemy will be immune to damage until it has manifested or whatever.

    private EnemyBehavior enemy;

    private float timeRising;
    private float risingClipLength;

    public RisingState(EnemyBehavior newEnemy)
    {
        enemy = newEnemy;

        timeRising = 0F;
        risingClipLength = enemy.risingAnim.length;
    }

    public void UpdateState()
    {
        timeRising += Time.deltaTime;

        if(timeRising > risingClipLength)
        {
            ToChaseState();
        }
    }

    public void OnTriggerEnter(Collider other)
    {
    }

    public void ToChaseState()
    {
        enemy.enemyAnim.SetBool("isChasing", true);
        enemy.enemyState = enemy.chaseState;
    }

    public void ToAttackState()
    {
    }

    public void ToTakeDamageState()
    {
    }

    public void ToDeathState()
    {
    }

    public void ToWimpOutState()
    {
    }
}

