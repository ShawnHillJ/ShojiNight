using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Damage : MonoBehaviour
{
    //Simple variable script that can be attached to any "damage" trigger to allow another object to retreive the damage.
    public int damage;

    public int getDamage()
    {
        return damage;
    }
}
