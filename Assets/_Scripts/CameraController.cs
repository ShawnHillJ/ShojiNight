using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour {
    
    private float rotationSpeed = 150f;
    private Vector3 point;
    private GameObject player;

    void Start()
    {
        player = GameObject.FindGameObjectWithTag("Player");
    }

    void Update()
    {
        //Ensures that the camera is not too low (for the timebeing)
        if (transform.position.y < player.transform.position.y + 2)
            transform.position += Vector3.up * Time.deltaTime;

        //Horizontal displacement from center
        float mouseH = Input.mousePosition.x - Screen.width / 2;
        if (mouseH < (float)Screen.width / 6 && mouseH > - (float)Screen.width / 6)
            mouseH = 0;

        //Rotates the camera around the player according to position of mouse on screen
        //(Can be changed to keyboard controls if desired)
        transform.RotateAround(player.transform.position, new Vector3(0.0f, 1f, 0.0f), rotationSpeed * Time.deltaTime * mouseH / Screen.width);

        //Re-focus camera onto player
        transform.LookAt(player.transform.position);
    }
}
