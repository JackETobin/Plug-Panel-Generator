# Plug-Panel-Generator
The code is not annotated! I will get arround to annotating the code and adding some kind of bootleg documentation attempt eventually, after the final bit of funtionality is added.

Controls:

LEFT CLICK selects a plug to be linked to another plug. Plugs that are destined for linkage have a blue fill. Source plugs cannot be linked to source plugs, and likewise with destination plugs, only left column can link to right column, the link order doesnt matter.
SHIFT CLICK selects a plug to be unlinked, and the functionality mirrors that of the LEFT CLICK. Plugs that are destined to be unlinked have a red fill.

In the test suite at the top, the input boxes are where you can enter the number of plugs per respective column. Panels only carry 2 columns of plugs.
The maximum number of plugs per column on my computer is 884, that might be different on your computer, but it shouldnt be prohibitively low.

Selecting a plug for link or unlink will turn the fill the proper color, clicking that same plug in the same manner will deselect the plug.
Linked plugs are connected via a white line, and linkages are stored in the div attribute "data-linkedto" on each of the buttons.

Functionality missing:
Currently it cannot actually draw lines between the source and destination plugs that exist accross multiple panels.
Currently no way to bind functions to the source and destination plugs.

note: Although there will be no link line between panels, the plugs themselves WILL link between panels, so data will carry.

Enjoy~!
