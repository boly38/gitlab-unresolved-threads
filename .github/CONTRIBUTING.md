## How to debug/run test locally

Clone this repository locally and then tell to google Chrome browser to use your local extension source code.

1) (fork &) clone github repository & update the code (ex. switch `debugMode` to `true`)
2) Open google chrome [chrome://extensions/](chrome://extensions/)
3) remove official extension and switch to activate `developper mode` (toggle button upper right corner)
4) then `Load unpackaged extension` : you need to **select repository directory**

Then you are ok, you can go to a gitlab MR list to show your updates.

On source update, repeat step 4) only.