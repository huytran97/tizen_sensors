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
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
}());


//CONNECT TO MQTT BROKER
client = new Paho.MQTT.Client("farmer.cloudmqtt.com", 32482,"clientjs");
//Example client = new Paho.MQTT.Client("m11.cloudmqtt.com", 32903, "web_" + parseInt(Math.random() * 100, 10));

//set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
	var options = {
	useSSL: true,
	userName: "xmbkxbtw",
	password: "TaTeyv-KMPUU",
	onSuccess:onConnect,
	onFailure:doFail
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
	client.subscribe("activity");
}

function doFail(e){
console.log(e);
}

//called when the client loses its connection
function onConnectionLost(responseObject) {
 if (responseObject.errorCode !== 0) {
	 console.log("onConnectionLost:"+responseObject.errorMessage);
 }
}

//called when a message arrives
function onMessageArrived(message) {
	console.log("onMessageArrived:"+message.payloadString);
	if (message.destinationName === "activity"){
		document.getElementById('activity').innerHTML = message.payloadString;
	}
}
//READ SENSORS DATA
document.getElementById('sensors').addEventListener('click', getSensorValue);
function getSensorValue(){

	document.getElementById('sensors').innerHTML = 'Sending';
	document.getElementById('stop').innerHTML = 'Stop';
	document.getElementById('activity').innerHTML = 'Recognizing';
	
	function read_acc(e) {
		if (document.getElementById('stop').innerHTML == 'Stopped'){
	    	window.removeEventListener('devicemotion', read_acc);
	    }
	    message = new Paho.MQTT.Message(e.accelerationIncludingGravity.x + ',' + -e.accelerationIncludingGravity.y + ',' + -e.accelerationIncludingGravity.z + ','+ e.rotationRate.alpha + "," + e.rotationRate.beta + "," + e.rotationRate.gamma);
	    message.destinationName = "sensors";
	    client.send(message);
	    }
	window.addEventListener('devicemotion', read_acc);
}


//Stop sensors
document.getElementById('stop').addEventListener('click', stopSensors);
function stopSensors(){
	document.getElementById('stop').innerHTML = 'Stopped';
	document.getElementById('sensors').innerHTML = 'Send signal';
	var gyroscopeSensor = tizen.sensorservice.getDefaultSensor('GYROSCOPE');
	var gravitySensor = tizen.sensorservice.getDefaultSensor("GRAVITY");
	gyroscopeSensor.stop();
	gravitySensor.stop();
}
