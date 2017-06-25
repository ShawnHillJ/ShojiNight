using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DeathState : IEnemyState
{
    //The enemy will be dead.

    private EnemyBehavior enemy;
    private string enemyType;

    /*private float deathLingerTime;
    private float timeDead;*/

    /*public DeathState(GameObject maleGhostEnemy, string newEnemyType)
    {
        enemy = maleGhostEnemy;
        /*string temp = enemy.name;
        Debug.Log(temp);
        Debug.Log(enemy.GetComponent(temp));*/
        //enemyType = newEnemyType;
        //Debug.Log(enemyType);
        //int i;
        //i = enemy.GetComponent(enemyType).SendMessage("getHealth");
        //Debug.Log("enemy: " + enemy);
        //Debug.Log(enemy.GetComponent(enemyType));
        /*Debug.Log(enemy);
        Debug.Log(enemyType);
        Debug.Log(enemy.GetComponent(enemyType));*/

        /*deathLingerTime = 5F;
        timeDead = 0F;*/
    //}*/

    public DeathState(EnemyBehavior newEnemy)
    {
        enemy = newEnemy;
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

    public void ToWimpOutState()
    {
    }
}

