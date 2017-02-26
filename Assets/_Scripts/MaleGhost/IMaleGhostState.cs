using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public interface IMaleGhostState
{
    void UpdateState();

    void OnTriggerEnter(Collider other);

    void ToChaseState();

    void ToAttackState();

    void ToTakeDamageState();

    void ToDeathState();
}
