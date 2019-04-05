var dataJson = [
    {
        "TYPE": "vertex",
        "ID": "id1",
        "PARENT": null,
        "VALUE": "<span class='fa fa-apex fa-lg' aria-hidden='true'>test font </span>",
        "X": 0,
        "Y": 0,
        "WIDTH": 200,
        "HEIGHT": 50,
        "STYLE": null,
        "CONNECTABLE": false
    },
    {
        "TYPE": "vertex",
        "ID": "id1a",
        "PARENT": "id1",
        "VALUE": "<script>alert('x');</script>",
        "X": 0,
        "Y": 20,
        "WIDTH": 40,
        "HEIGHT": 30,
        "STYLE": null,
        "CONNECTABLE": false
    },
    {
        "TYPE": "vertex",
        "ID": "id2",
        "PARENT": null,
        "VALUE": "Test2",
        "X": 100,
        "Y": 100,
        "WIDTH": 50,
        "HEIGHT": 50,
        "STYLE": "process",
        "CONNECTABLE": true
    },
    {
        "TYPE": "vertex",
        "ID": "id3",
        "PARENT": null,
        "VALUE": "Test",
        "X": 0,
        "Y": 150,
        "WIDTH": 50,
        "HEIGHT": 50,
        "STYLE": "test",
        "CONNECTABLE": true
    },
    {
        "TYPE": "vertex",
        "ID": "id4",
        "PARENT": null,
        "VALUE": "Test4",
        "X": 400,
        "Y": 700,
        "WIDTH": 50,
        "HEIGHT": 50,
        "STYLE": "test",
        "CONNECTABLE": true
    },
    {
        "TYPE": "edge",
        "ID": "ed1",
        "PARENT": null,
        "VALUE": "Edge1",
        "SOURCE": "id3",
        "TARGET": "id2",
        "STYLE": 'dashed=1;startArrow=oval;endArrow=block;SOURCEPerimeterSpacing=4;startFill=0;endFill=0;'
    },
    {
        "TYPE": "edge",
        "ID": "ed2",
        "PARENT": null,
        "VALUE": "Edge2",
        "SOURCE": "id1",
        "TARGET": "id3",
        "STYLE": 'dashed=1;shape=message;labelBackgroundColor=#f8cecc;labelPosition=left;spacingRight=2;align=right;fontStyle=0;strokeColor:#f8cecc'
    },
    {
        "TYPE": "edge",
        "ID": "ed3",
        "PARENT": null,
        "VALUE": "Edge3",
        "SOURCE": "id3",
        "TARGET": "id4",
        "STYLE": 'strokeColor=#FF0C0C;edgeStyle=topToBottomEdgeStyle'
    }
];


var configJson = {
    "refresh":0,
    "editor": false,
    "debug":true,
    "style": [
        {
            "name": "default",
            "vertexstyle": {
                "shape": "rectangle",
                "perimeter": "rectanglePerimeter",
				"gradientDirection":"east",
                "strokeColor": "#a5d6a7",
                "rounded": true,
                "fillColor": "#a5d6a7",
                "gradientColor": "#a5d6a7",
                "align": "center",
                "verticalAlign": "middle",
                "fontSize": "12",
                "fontStyle": 1,
                "fontColor": "black"
            },
            "edgestyle": {
                "strokeColor": "#0C0C0C",
                "fontColor": "black",
                "labelBackgroundColor": "white",
                "rounded": true,
				"curved":false,
                "fontSize": "10"
            }
        },
        {
            "name": "process",
            "vertexstyle": {
                "shape": "rectangle",
                "perimeter": "rectanglePerimeter",
                "strokeColor": "#a5d6a7",
                "rounded": false,
				"gradientDirection":"east",
                "fillColor": "#a5d6a7",
                "gradientColor": "#a5d6a7",
                "align": "center",
                "verticalAlign": "middle",
                "fontSize": "12",
                "fontStyle": 1,
                "fontColor": "black"
            }
        },
        {
            "name": "test",
            "vertexstyle": {
                "shape": "ellipse",
                "perimeter": "ellipsePerimeter",
                "strokeColor": "#90caf9",
                "rounded": true,
				"gradientDirection":"east",
                "fillColor": "#90caf9",
                "gradientColor": "#90caf9",
                "align": "center",
                "verticalAlign": "middle",
                "fontSize": "12",
                "fontStyle": 1,
                "fontColor": "black"
            }
        }
    ]
};
