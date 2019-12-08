(function() {
    /**
     * Back key event handler
     */
    window.addEventListener('tizenhwkey', function(ev) {
        if (ev.keyName === "back") {
            var page = document.getElementsByClassName('ui-page-active')[0],
                pageid = page ? page.id : "";
            if (pageid === "main") {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {}
            } else {
                window.history.back();
            }
        }
    });
}());


//CONNECT TO MQTT BROKER
client = new Paho.MQTT.Client("farmer.cloudmqtt.com", 32482, "clientjs");
//Example client = new Paho.MQTT.Client("m11.cloudmqtt.com", 32903, "web_" + parseInt(Math.random() * 100, 10));

//set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
var options = {
    useSSL: true,
    userName: "xmbkxbtw",
    password: "TaTeyv-KMPUU",
    onSuccess: onConnect,
    onFailure: doFail
}

//connect the client
client.connect(options);

//called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("cloudmqtt");
    message = new Paho.MQTT.Message("Hello CloudMQTT");
    message.destinationName = "cloudmqtt";
    client.send(message);
}

function doFail(e) {
    console.log(e);
}

//called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

//called when a message arrives
function onMessageArrived(message) {
        console.log("onMessageArrived:" + message.payloadString);
        client.unsubscribe("cloudmqtt");
    }
    //READ SENSORS DATA
document.getElementById('sensors').addEventListener('click', getSensorValue);

function getSensorValue() {

    document.getElementById('sensors').innerHTML = 'Sending';
    document.getElementById('stop').innerHTML = 'Stop';
    var gyroscopeSensor = tizen.sensorservice.getDefaultSensor('GYROSCOPE');


    function onGetSuccessCB(sensorData) {
        //		console.log('gyroscope : ' + sensorData.x + ',' + sensorData.y + ',' + sensorData.z);
        message = new Paho.MQTT.Message('gyroscope,' + sensorData.x + ',' + sensorData.y + ',' + sensorData.z);
        message.destinationName = "gyroscope";
        client.send(message);
    }

    //gyroscopeSensor.start(onsuccessCB);

    function onerrorCB(error) {
        console.log("Error occurred : " + error);
    }

    function onsuccessCB_gyr() {
        //	  console.log("gyroscope sensor start");
        gyroscopeSensor.getGyroscopeSensorData(onGetSuccessCB, onerrorCB);
    }

    function onchangedCB_gyr(sensorData) {
        console.log('gyroscope : ' + sensorData.x + ',' + sensorData.y + ',' + sensorData.z);
        message = new Paho.MQTT.Message(sensorData.x + ',' + sensorData.y + ',' + sensorData.z);
        message.destinationName = "gyroscope";
        client.send(message);
    }

    function read_acc(e) {
        if (document.getElementById('stop').innerHTML == 'Stopped') {
            window.removeEventListener('devicemotion', read_acc);
        }
        gyroscopeSensor.start(onsuccessCB_gyr);
        //		console.log('accelerometer : '+ e.accelerationIncludingGravity.x + ',' + -e.accelerationIncludingGravity.y + ',' + -e.accelerationIncludingGravity.z)
        message = new Paho.MQTT.Message('accelerometer,' + e.accelerationIncludingGravity.x + ',' + -e.accelerationIncludingGravity.y + ',' + -e.accelerationIncludingGravity.z);
        message.destinationName = "accelerometer";
        client.send(message);
    }
    window.addEventListener('devicemotion', read_acc);
    //	gyroscopeSensor.setChangeListener(onchangedCB_gyr,100,0);
}


//Stop sensors
document.getElementById('stop').addEventListener('click', stopSensors);

function stopSensors() {
    document.getElementById('stop').innerHTML = 'Stopped';
    document.getElementById('sensors').innerHTML = 'Send signal';
    var gyroscopeSensor = tizen.sensorservice.getDefaultSensor('GYROSCOPE');
    var gravitySensor = tizen.sensorservice.getDefaultSensor("GRAVITY");
    gyroscopeSensor.stop();
    gravitySensor.stop();
}