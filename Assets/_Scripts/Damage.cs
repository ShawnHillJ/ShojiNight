using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Damage : MonoBehaviour
{
    //Simple variable script that can be attached to any "damage" trigger to allow another object to retreive the damage.
    public int damage;
    //The degree of "knockback" an attack will cause to its target.  Will be 0 for attacks that cause no knockback.
    public float knockback;

    //For retrieving an attack's damage
    public int getDamage()
    {
        return damage;
    }

    //Allows damage to be set.  May be useful for combos, etc.
    public void setDamage(int newDamage)
    {
        damage = newDamage;
    }

    public float getKnockback()
    {
        return knockback;
    }

    public void setKnockback(int newKnockback)
    {
        knockback = newKnockback;
    }
}
