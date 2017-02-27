using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DeathState : IMaleGhostState
{
    private MaleGhostEnemy enemy;

    /*private float deathLingerTime;
    private float timeDead;*/

    public DeathState(MaleGhostEnemy maleGhostEnemy)
    {
        enemy = maleGhostEnemy;

        /*deathLingerTime = 5F;
        timeDead = 0F;*/
    }

    public void UpdateState()
    {
        /*timeDead += Time.deltaTime;
        if (timeDead > deathLingerTime)
        {
            GameObject.Destroy(enemy.gameObject);
        }*/
    }

    public void OnTriggerEnter(Collider other)
    {
    }

    public void ToChaseState()
    {

    }

    public void ToAttackState()
    {
    }

    public void ToTakeDamageState()
    {

    }

    public void ToDeathState()
    {
        Debug.Log("Already dying...");
    }
}

