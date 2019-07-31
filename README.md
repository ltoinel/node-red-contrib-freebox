# Node-Red-Freebox
----

This module returns the list of all the devices connected on the Freebox network. It uses the Freebox API to get the list of connected devices.

You need to enable a persistant storage in settings.js to allow this module to store the Freebox API token.

'''
    contextStorage: {
        default: {
            module:"localfilesystem"
        },
    },
'''