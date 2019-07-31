/**
 * Node-Red-Contrib-Freebox v0.1 https://github.com/ltoinel/node-red-contrib-freebox
 * 
 * Copyright 2019 DomoGeeek Released under the Apache License 2.0 (Apache-2.0)
 * 
 * @author: ltoinel@free.fr
 */


module.exports = function(RED) {

    // Local require
    var freebox = require('./lib/freebox-api.js');
    var fs = require('fs');

    function FreeboxDevicesNode(config) {
		
		var node = this;
		RED.nodes.createNode(node,config);

        node.on('input', function(msg) {
			
			// We check the Freebox Token
			var app_token = node.context().get("app_token");

			if (app_token == undefined) {
				
				// Registration
				freebox.connect();
			
				freebox.on('ready', function(box) {
					
					freebox.register();

					node.status({fill:"yellow",shape:"ring",text:"Trying to register this node-red module"});

					freebox.on('registered', function(receivedToken) {
						// We persist the token for a futur use
						node.context().set("app_token",receivedToken.app_token);
						node.context().set("track_id",receivedToken.track_id);
						node.status({fill:"yellow",shape:"ring",text:"Please accept token on the Freebox to continue"});
					});
				});

			} else {
				console.info("Freebox authorisation token found !");

				freebox.connect({
					'app_token' : node.context().get("app_token"),
					'track_id' : node.context().get("track_id")
				});
	
				freebox.on(
					'ready',
					function(box) {
	
						node.status({fill:"yellow",shape:"ring",text:"Listing connected devices"});
						
						// Removing the listener
						freebox.removeAllListeners('ready');
	
						// Retrieving wifi devices
						freebox.browserPub(function(devices) {
							node.send({payload:devices});
							node.status({fill:"green",shape:"dot",text:"Connected"});
						});
				});
			}
        });
    }
    RED.nodes.registerType("freebox",FreeboxDevicesNode);
}



