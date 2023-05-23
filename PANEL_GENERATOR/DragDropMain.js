const PlugPair = [];
const PanelTracker = [];

let CurrentPlug = {};

const TB_LNK = 0;
const TB_ULNK = 1;
const LNK = 2;
const ULNK = 3;

const WHITE = "rgb(255, 255, 255)";
const BLUE = "rgb(110, 155, 219)";
const RED = "rgb(228, 60, 60)";

let NumPanels = 0;

function InitUniqueID()
{
    let TimeOfAccess = Date.now();
    sessionStorage.setItem("AccessTime", TimeOfAccess);
    sessionStorage.setItem("NumUniqueIDs", 0);
}

function CreateUniquePlugID(plugSide)
{
    let NumIDs = sessionStorage.getItem("NumUniqueIDs");    
    NumIDs.toString();
    let IDAppend = NumIDs + plugSide;

    let NewNumIDs = Number(NumIDs);
    NewNumIDs += 1;
    sessionStorage.setItem("NumUniqueIDs", NewNumIDs);
    
    let AccessPoint = sessionStorage.getItem("AccessTime");
    let UniqueID = Date.now() + (Date.now() - AccessPoint);
    UniqueID.toString();
    UniqueID += IDAppend;
    
    return UniqueID;
}

function BuildPanel()
{
    let NumLeftPlugsUI = document.getElementById("LeftPlugInput");
    let NumRightPlugsUI = document.getElementById("RightPlugInput");
    if(Number.isNaN(NumLeftPlugsUI.valueAsNumber) || Number.isNaN(NumRightPlugsUI.valueAsNumber) 
                 || NumLeftPlugsUI.valueAsNumber < 1 || NumRightPlugsUI.valueAsNumber < 1)
    {
        console.log("Not valid number.");
        NumLeftPlugsUI.value = "";
        NumRightPlugsUI.value = "";
        return;
    }

    let NumLeftPlugs = NumLeftPlugsUI.valueAsNumber;
    let NumRightPlugs = NumRightPlugsUI.valueAsNumber;
    let Wrapper = document.getElementById("Wrapper");

    NumLeftPlugsUI.value = "";
    NumRightPlugsUI.value = "";

    let NewPanel = document.createElement("div");
    NewPanel.setAttribute("class", "Panel");
    NewPanel.setAttribute("id", NumPanels.toString());
    PanelTracker.push([]);
    NumPanels += 1;

    let NewLeftStrip = document.createElement("div");
    NewLeftStrip.setAttribute("class", "LeftStrip");
    let NewRightStrip = document.createElement("div");
    NewRightStrip.setAttribute("class", "RightStrip");

    let NewPlug;
    let UniqueID;
    while(NumLeftPlugs)
    {
        UniqueID = CreateUniquePlugID("L");
        NewPlug = document.createElement("button");
        NewPlug.setAttribute("class", "Plug");
        NewPlug.setAttribute("id", UniqueID);
        NewPlug.addEventListener("click", function(e) {InputManager(e, this.getAttribute("id"));});
        NewPlug.setAttribute("title", "EMPTY");
        NewPlug.setAttribute("data-linkedto", "");
        NewLeftStrip.appendChild(NewPlug);
        NumLeftPlugs -= 1;
    }
    while(NumRightPlugs)
    {
        UniqueID = CreateUniquePlugID("R");
        NewPlug = document.createElement("button");
        NewPlug.setAttribute("class", "Plug");
        NewPlug.setAttribute("id", UniqueID);
        NewPlug.addEventListener("click", function(e) {InputManager(e, this.getAttribute("id"));});
        NewPlug.setAttribute("title", "EMPTY");
        NewPlug.setAttribute("data-linkedto", "");
        NewRightStrip.appendChild(NewPlug);
        NumRightPlugs -= 1;
    }

    NewPanel.appendChild(NewLeftStrip);
    NewPanel.appendChild(NewRightStrip);
    Wrapper.appendChild(NewPanel);
    BuildCanvas(NewPanel);
}

function BuildCanvas(panel)
{
    let NewCanvas = document.createElement("canvas");
    NewCanvas.setAttribute("id", CreateUniquePlugID(100, "C"));
    NewCanvas.style.position = "absolute";
    NewCanvas.width = panel.offsetWidth;
    NewCanvas.height = panel.offsetHeight;
    NewCanvas.style.zIndex = 0;

    panel.appendChild(NewCanvas);
}

function InputManager(click, inputID)
{
    let LocalPlug= {};
    LocalPlug.ID = inputID
    if(!click.shiftKey)
    {
        LocalPlug.set = LNK;
        VerifyAndPush(LocalPlug);
        return;
    } else
    if(click.shiftKey)
    {
        LocalPlug.set = ULNK;
        VerifyAndPush(LocalPlug);
        return;
    }
    return;
}

function VerifyAndPush(localPlug)
{
    CurrentPlug = localPlug;
    if(PlugPair.length > 0 && SourceDuplicateCheck())
    {
        if(CurrentPlug.set != PlugPair[0].set || CurrentPlug.ID == PlugPair[0].ID)
        {
            SetPlugEmpty(PlugPair[0].ID);
            PlugPair.length = 0;
            return;
        } else
        if(CurrentPlug.set == LNK)
        {
            PlugPair.push(localPlug);
            SetState(LNK);
        } else
        if(CurrentPlug.set == ULNK)
        {
            PlugPair.push(localPlug);
            SetState(ULNK);
        }
        return;
    } else
    if(!PlugPair.length)
    {
        PlugPair.push(localPlug);
        if(CurrentPlug.set == LNK)
        {
            SetState(TB_LNK);
        }  else
        if(CurrentPlug.set == ULNK)
        {
            SetState(TB_ULNK);
        }
    }
    return;
}

function SourceDuplicateCheck()
{
    if(PlugPair[0].ID != CurrentPlug.ID && (PlugPair[0].ID.slice(PlugPair[0].ID.length - 1) == CurrentPlug.ID.slice(CurrentPlug.ID.length - 1)))
        return false;
    return true;
}

function SetState(state)
{
    switch (state)
    {
        case TB_LNK:
            SetPlugLinked(CurrentPlug.ID);
            SetPlugColor(CurrentPlug.ID, BLUE);
            break;
        case TB_ULNK:
            SetPlugColor(CurrentPlug.ID, RED);
            break;
        case LNK:
            LinkPlugs();
            for(var i = 0; i < PlugPair.length; i++)
                SetPlugColor(PlugPair[i].ID, WHITE);
            PlugPair.length = 0;
            break;
        case ULNK:
            UnLinkPlugs();
            for(var i = 0; i < PlugPair.length; i++)
                SetPlugEmpty(PlugPair[i].ID);
            PlugPair.length = 0;
            break;
    }
}

function SetPlugLinked(plugID)
{
    let PlugToSet = document.getElementById(plugID);
    if(PlugToSet.getAttribute("title") == "EMPTY")
        {
            let Fill = document.createElement("div");
            Fill.setAttribute("class", "Fill");            
            PlugToSet.appendChild(Fill);
            PlugToSet.setAttribute("title", "LINKED");
        }
}

function SetPlugEmpty(plugID)
{
    let PlugToUnLink = document.getElementById(plugID);
    if(PlugToUnLink.getAttribute("data-linkedto") == "" && PlugToUnLink.getAttribute("title") == "LINKED")
    {
        PlugToUnLink.firstChild.remove();
        PlugToUnLink.setAttribute("title", "EMPTY");
    }
    if(PlugToUnLink.getAttribute("data-linkedto") != "" && PlugToUnLink.getAttribute("title") == "LINKED")
    {
        SetPlugColor(plugID, WHITE);
    }
}

function SetPlugColor(plugID, color)
{
    if(document.getElementById(plugID).firstChild)
    {
        let Fill = document.getElementById(plugID).firstChild;
        Fill.style.backgroundColor = color;
    }
}

function LinkPlugs()
{    
    let Plug_1 = document.getElementById(PlugPair[0].ID);
    let Plug_2 = document.getElementById(PlugPair[1].ID);

    let LinkList = Plug_1.getAttribute("data-linkedto");
    if(DuplicateCheck(LinkList, PlugPair[1].ID))
    {
        PlugPair.length = 0;
        return;
    }
    LinkList = LinkList + " " + PlugPair[1].ID;
    LinkList = LinkList.trim();
    
    Plug_1.setAttribute("data-linkedto", LinkList);
    LinkList = Plug_2.getAttribute("data-linkedto");
    if(DuplicateCheck(LinkList, PlugPair[0].ID))
    {
        PlugPair.length = 0;
        return;
    }
    LinkList = LinkList + " " + PlugPair[0].ID;
    LinkList = LinkList.trim();
    Plug_2.setAttribute("data-linkedto", LinkList);
    
    SetPlugLinked(PlugPair[1].ID);
    LinkLinePushCoords();
    LinkLineDraw();
}

function UnLinkPlugs()
{
    let Plug_1 = document.getElementById(PlugPair[0].ID);
    let Plug_2 = document.getElementById(PlugPair[1].ID);

    let LinkList = Plug_1.getAttribute("data-linkedto");
    if(!DuplicateCheck(LinkList, PlugPair[1].ID))
    {
        SetPlugEmpty(PlugPair[0].ID);
        PlugPair.length = 0;
        return;
    }
    let TempID = PlugPair[1].ID;
    LinkList = LinkList.replace(TempID, "");
    LinkList = LinkList.trim();
    Plug_1.setAttribute("data-linkedto", LinkList);
    
    LinkList = Plug_2.getAttribute("data-linkedto");
    if(!DuplicateCheck(LinkList, PlugPair[0].ID))
    {
        SetPlugEmpty(PlugPair[0].ID);
        PlugPair.length = 0;
        return;
    }
    TempID = PlugPair[0].ID;
    LinkList = LinkList.replace(PlugPair[0].ID, "");
    LinkList = LinkList.trim();
    Plug_2.setAttribute("data-linkedto", LinkList);

    LinkLinePullCoords();
    LinkLineDraw();
    return;
}

function DuplicateCheck(LinkList, plugID)
{
    if(LinkList.includes(plugID))
    {
        SetPlugColor(PlugPair[0].ID, "rgb(255, 255, 255)");
        SetPlugColor(PlugPair[1].ID, "rgb(255, 255, 255)");
        return true;
    } return false;
}

function GetPlugID(condition)
{
    if(PlugPair[0].ID.slice(PlugPair[0].ID.length - 1) == condition)
    {
        return PlugPair[0].ID;
    }
    return PlugPair[1].ID;
}

function LinkLinePushCoords()
{
    StartPlugID = GetPlugID("L");
    EndPlugID = GetPlugID("R");

    let LineCoords = {};
    let StartPlug = document.getElementById(StartPlugID);
    let EndPlug = document.getElementById(EndPlugID);

    let StartStrip = StartPlug.parentElement;
    let EndStrip = EndPlug.parentElement;

    let Panel = StartStrip.parentElement;
    let PanelID = Panel.getAttribute("id");
    PanelID = Number(PanelID);

    let StartPlugCoords = StartPlug.getBoundingClientRect();
    LineCoords.startPlug = StartPlugID;
    LineCoords.startX = StartStrip.offsetLeft + (StartPlugCoords.right - StartPlugCoords.left)/2;
    LineCoords.startY = 4 + StartPlug.offsetTop + (StartPlugCoords.bottom - StartPlugCoords.top)/2;

    let EndPlugCoords = StartPlug.getBoundingClientRect();
    LineCoords.endPlug = EndPlugID;
    LineCoords.endX = EndStrip.offsetLeft + (EndPlugCoords.right - EndPlugCoords.left)/2;
    LineCoords.endY = 4 + EndPlug.offsetTop + (EndPlugCoords.bottom - EndPlugCoords.top)/2;

    PanelTracker[PanelID].push(LineCoords);
    return;
}

function LinkLinePullCoords()
{
    StartPlugID = GetPlugID("L");
    EndPlugID = GetPlugID("R");

    let Plug = document.getElementById(StartPlugID);
    let Panel = Plug.parentElement.parentElement;
    let PanelID = Panel.getAttribute("id");
    PanelID = Number(PanelID);

    if(PanelTracker[PanelID].length == 1)
    {
        PanelTracker[PanelID].length = 0;
        return;
    }
    else
    {
        for(let i = 0; i < PanelTracker[PanelID].length; i++)
        {
            if(PanelTracker[PanelID][i].startPlug.includes(StartPlugID) && PanelTracker[PanelID][i].endPlug.includes(EndPlugID))
            {
                if(i == 0)
                {
                    PanelTracker[PanelID].shift();
                    return;
                }
                if(i == PanelTracker[PanelID].length - 1)
                {
                    PanelTracker[PanelID].pop();
                    return;
                }
                PanelTracker[PanelID].splice(i, 1);
                return;
            }
        }
    }
}

function LinkLineDraw()
{
    let StartPlug = document.getElementById(CurrentPlug.ID);
    let Panel = StartPlug.parentElement.parentElement;
    let PanelID = Panel.getAttribute("id");
    PanelID = Number(PanelID);
    let Canvas = Panel.lastChild;
    if(!Canvas.getContext)
    {
        console.log("No Context");
        return;
    }
    CurrentContext = Canvas.getContext("2d");
    CurrentContext.clearRect(0, 0, Canvas.width, Canvas.height);

    if(PanelTracker[PanelID].length > 0)
    {
        for(let i = 0; i < PanelTracker[PanelID].length; i++)
        {
            CurrentContext.beginPath();
            CurrentContext.moveTo(PanelTracker[PanelID][i].startX, PanelTracker[PanelID][i].startY);
            CurrentContext.bezierCurveTo(PanelTracker[PanelID][i].startX + 140, PanelTracker[PanelID][i].startY, 
                                         PanelTracker[PanelID][i].endX - 140, PanelTracker[PanelID][i].endY, 
                                         PanelTracker[PanelID][i].endX, PanelTracker[PanelID][i].endY);
            //CurrentContext.lineTo(LinkLines[i].endX, LinkLines[i].endY);
            CurrentContext.strokeStyle = "rgb(255, 255, 255)";
            CurrentContext.lineWidth = 2
            CurrentContext.stroke();
        }
    }
}