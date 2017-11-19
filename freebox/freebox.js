/**
 * Node-Red-Contrib-Freebox v0.1 https://github.com/ltoinel/node-red-contrib-freebox
 * 
 * Copyright 2015 DomoGeeek Released under the Apache License 2.0 (Apache-2.0)
 * 
 * @author: ltoinel@free.fr
 */


module.exports = function(RED) {

    // Local require
    var freebox = require('freebox-api');
	var fs = require('fs');

    function FreeboxDevicesNode(config) {
    	
    	// We check the Freebox Token
    	if (fs.existsSync('./token.json')) {
    		console.info("Freebox authorisation token found !");
    		var token = require('./token.json');
    		
    		this.status({fill:"green",shape:"dot",text:"connected"});
    		
    	} else {
    		// Registration
    		freebox.connect();
    		freebox.on('ready', function(box) {
    			freebox.register();
    			
    			this.status({fill:"yellow",shape:"ring",text:"Accept token on Freebox"});
    			freebox.on('registered', function(receivedToken) {
    				token = receivedToken;

    				// We persist the token for a futur use
    				fs.writeFile("./token.json", JSON.stringify(receivedToken));
    				
    				this.status({fill:"green",shape:"dot",text:"connected"});
    			});
    		});
    	}
    	
    	
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
        	
        	freebox.connect({
        		'app_token' : token.app_token,
        		'track_id' : token.track_id
        	});

        	freebox.on(
        		'ready',
        		function(box) {

        			// Removing the listener
        			freebox.removeAllListeners('ready');

        			// Retrieving wifi devices
        			freebox.browserPub(function(devices) {
        				msg.payload.devices = devices;
        				node.send(msg);
        			});
        		});
        });
    }
    RED.nodes.registerType("Freebox Devices",FreeboxDevicesNode);
}



