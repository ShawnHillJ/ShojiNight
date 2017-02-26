using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RisingState : IMaleGhostState
{
    private MaleGhostEnemy enemy;

    private float timeRising;
    private float risingClipLength;

    public RisingState(MaleGhostEnemy maleGhostEnemy)
    {
        enemy = maleGhostEnemy;

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
}

