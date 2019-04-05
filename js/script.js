var flow = (function () {
    "use strict";
    var scriptVersion = "1.0.00";
    var util = {
        version: "1.0.5",
        isAPEX: function () {
            if (typeof apex != "undefined") {
                return true;
            } else {
                return false;
            }
        },
        debug: {
            info: function (str) {
                if (util.isAPEX()) {
                    apex.debug.info(str);
                }
            },
            error: function (str) {
                if (util.isAPEX()) {
                    apex.debug.error(str);
                } else {
                    console.error(str);
                }
            }
        },
        groupObjectArray: function (objectArr, jSONKey) {
            if (objectArr && Array.isArray(objectArr)) {
                return objectArr.reduce(function (retVal, x) {
                    if (x[jSONKey]) {
                        (retVal[x[jSONKey]] = retVal[x[jSONKey]] || []).push(x);
                    }
                    s
                    return retVal;
                }, {});
            } else {
                return [];
            }
        },
        link: function (link) {
            return (window.location = link);
        },
        escapeHTML: function (str) {
            if (str === null) {
                return null;
            }
            if (typeof str === "undefined") {
                return;
            }
            if (typeof str === "object") {
                try {
                    str = JSON.stringify(str);
                } catch (e) {
                    /*do nothing */
                }
            }
            if (util.isAPEX()) {
                return apex.util.escapeHTML(String(str));
            } else {
                str = String(str);
                return str
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#x27;")
                    .replace(/\//g, "&#x2F;");
            }
        },
        loader: {
            start: function (id) {
                if (util.isAPEX()) {
                    apex.util.showSpinner($(id));
                } else {
                    /* define loader */
                    var faLoader = $("<span></span>");
                    faLoader.attr("id", "loader" + id);
                    faLoader.addClass("ct-loader");

                    /* define refresh icon with animation */
                    var faRefresh = $("<i></i>");
                    faRefresh.addClass("fa fa-refresh fa-2x fa-anim-spin");
                    faRefresh.css("background", "rgba(121,121,121,0.6)");
                    faRefresh.css("border-radius", "100%");
                    faRefresh.css("padding", "15px");
                    faRefresh.css("color", "white");

                    /* append loader */
                    faLoader.append(faRefresh);
                    $(id).append(faLoader);
                }
            },
            stop: function (id) {
                $(id + " > .u-Processing").remove();
                $(id + " > .ct-loader").remove();
            }
        },
        jsonSaveExtend: function (srcConfig, targetConfig) {
            var finalConfig = {};
            /* try to parse config json when string or just set */
            if (typeof targetConfig === "string") {
                try {
                    targetConfig = JSON.parse(targetConfig);
                } catch (e) {
                    util.debug.error(
                        "Error while try to parse targetConfig. Please check your Config JSON. Standard Config will be used."
                    );
                    util.debug.error(e);
                    util.debug.error(targetConfig);
                }
            } else {
                finalConfig = targetConfig;
            }
            /* try to merge with standard if any attribute is missing */
            try {
                finalConfig = $.extend(true, srcConfig, targetConfig);
            } catch (e) {
                util.debug.error(
                    "Error while try to merge 2 JSONs into standard JSON if any attribute is missing. Please check your Config JSON. Standard Config will be used."
                );
                util.debug.error(e);
                finalConfig = srcConfig;
                util.debug.error(finalConfig);
            }
            return finalConfig;
        },
        noDataMessage: {
            show: function (id, text) {
                var div = $("<div></div>")
                    .css("margin", "12px")
                    .css("text-align", "center")
                    .css("padding", "64px 0")
                    .addClass("nodatafoundmessage");

                var subDiv = $("<div></div>");

                var subDivSpan = $("<span></span>")
                    .addClass("fa")
                    .addClass("fa-search")
                    .addClass("fa-2x")
                    .css("height", "32px")
                    .css("width", "32px")
                    .css("color", "#D0D0D0")
                    .css("margin-bottom", "16px");

                subDiv.append(subDivSpan);

                var span = $("<span></span>")
                    .text(text)
                    .css("display", "block")
                    .css("color", "#707070")
                    .css("font-size", "12px");

                div.append(subDiv).append(span);

                $(id).append(div);
            },
            hide: function (id) {
                $(id)
                    .children(".nodatafoundmessage")
                    .remove();
            }
        },
        cutString: function (text, textLength) {
            try {
                if (textLength < 0) return text;
                else {
                    return text.length > textLength ?
                        text.substring(0, textLength - 3) + "..." :
                        text;
                }
            } catch (e) {
                return text;
            }
        }
    };
    return {
        // Initialize function for cards
        initialize: function (
            pRegionID,
            pAjaxID,
            pConfigJSON,
            pItems2Submit,
            pBindRefreshOnId,
            pData
        ) {
            var graph = null;
            var stdConfigJSON = {
                refresh: 0,
                refreshIcon: true,
                style: [
                    {
                        name: "default",
                        vertexstyle: {
                            shape: "rectangle",
                            perimeter: "rectanglePerimeter",
                            strokeColor: "gray",
                            rounded: true,
                            fillColor: "#EEEEEE",
                            align: "center",
                            verticalAlign: "middle",
                            fontSize: "12",
                            fontStyle: 1,
                            fontColor: "black"
                        },
                        edgestyle: {
                            strokeColor: "#0C0C0C",
                            fontColor: "black",
                            labelBackgroundColor: "white",
                            rounded: true,
                            fontSize: "10"
                        }
          }
        ]
            };
            var config = util.jsonSaveExtend(stdConfigJSON, pConfigJSON);            
            var parentID = "#" + pRegionID;
            var parent = $(parentID);
            /* define container and add it to parent */
            var container = drawContainer(parent)[0];
            /*****************************************************
             * prepare mx graph
             ******************************************************/
            var vertices = [];
            if (!mxClient.isBrowserSupported()) {
                return mxUtils.error("Browser is not supported!", 200, false);
            }

            mxEvent.disableContextMenu(container);
            graph = new mxGraph(container);
            styling();
            graph.setConnectable(true);
            graph.setAllowDanglingEdges(false);

            //set false until the editor is comming
            graph.setEnabled(false);
            /*****************************************************
             * handle click events
             ******************************************************/
            graph.addListener(mxEvent.CLICK, function (sender, evt) {
                var cell = evt.getProperty("cell");
                if (cell != null) {
                    if (cell.vertex == true) {
                        util.debug.info("VertexClicked: " + cell.id);
                        if (util.isAPEX()) {
                            apex.event.trigger(container, "VertexClicked", cell.id);
                        } else {
                            $.event.trigger({
                                type: "VertexClicked",
                                message: cell.id
                            });
                        }
                    }

                    if (cell.edge == true) {
                        util.debug.info("EdgeClicked: " + cell.id);
                        if (util.isAPEX()) {
                            apex.event.trigger(container, "EdgeClicked", cell.id);
                        } else {
                            $.event.trigger({
                                type: "EdgeClicked",
                                message: cell.id
                            });
                        }
                    }
                }
            });

            /**********************************************************************************
             * set the default style based on the given json config
             ***********************************************************************************/
            function setDefaultStyle(style, styleJson) {
                // set VertexStyle
                $.each(styleJson.vertexstyle, function (key, data) {
                    style[key] = data;
                });
                util.debug.info("setDefaultStyle: default");
                util.debug.info(style);
                graph.getStylesheet().putDefaultVertexStyle(style);
            }

            /**********************************************************************************
             * set the vertex style based on the given json config
             ***********************************************************************************/
            function setStyle(style, styleJson) {
                style = mxUtils.clone(style);
                $.each(styleJson.vertexstyle, function (key, data) {
                    style[key] = data;
                });
                graph.getStylesheet().putCellStyle(styleJson.name, style);
                util.debug.info("setStyle: " + styleJson.name);
                util.debug.info(style);
            }

            /**********************************************************************************
             * set the edge style based on the given json config
             ***********************************************************************************/
            function setEdgeStyle(style, styleJson) {
                style = mxUtils.clone(style);
                $.each(styleJson.edgestyle, function (key, data) {
                    style[key] = data;
                });
                graph.getStylesheet().putCellStyle(styleJson.name, style);
                util.debug.info("setEdgeStyle: " + styleJson.name);
                util.debug.info(style);
            }

            /**********************************************************************************
             * set the style
             * https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxStylesheet-js.html
             * Constant wordmap
             * https://jgraph.github.io/mxgraph/docs/js-api/files/util/mxConstants-js.html#mxConstants
             ***********************************************************************************/
            function styling() {
                // Creates the default style for vertices
                var style = graph.getStylesheet().getDefaultVertexStyle();
                var defaultStyleData = jsonPath(
                    config,
                    '$.style[?(@.name=="default")]'
                )[0];

                //set default style
                setDefaultStyle(style, defaultStyleData);

                // set custom styles
                var customStyles = jsonPath(
                    config,
                    '$.style[?(@.name !="default" && @.vertexstyle)]'
                );
                $.each(customStyles, function (key, customStyleData) {
                    setStyle(style, customStyleData);
                });

                // set EdgeStyle
                style = graph.getStylesheet().getDefaultEdgeStyle();
                $.each(defaultStyleData.edgestyle, function (key, data) {
                    style[key] = data;
                });

                //use the ElbowConnector
                style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
                graph.getStylesheet().putDefaultEdgeStyle(style);

                var customEdgeStyles = jsonPath(
                    config,
                    '$.style[?(@.name !="default" && @.edgestyle)]'
                );
                $.each(customEdgeStyles, function (key, customStyleData) {
                    setEdgeStyle(style, customStyleData);
                });

            }

            /**********************************************************************************
             * set the vertex
             ***********************************************************************************/
            function setVertex(
                vertexId,
                parentVertexName,
                value,
                x,
                y,
                width,
                height,
                style,
                connectable
            ) {
                util.debug.info(
                    "setVertex(vertexId " +
                    vertexId +
                    ", parentVertexName " +
                    parentVertexName +
                    ", value " +
                    value +
                    ", x " +
                    x +
                    ",  y " +
                    y +
                    ", width " +
                    width +
                    ", height " +
                    height +
                    ", style " +
                    style +
                    ", connectable " +
                    connectable +
                    ")"
                );
                vertices[vertexId] = graph.insertVertex(
                    vertices[parentVertexName],
                    vertexId,
                    value,
                    x,
                    y,
                    width,
                    height,
                    style
                );
                vertices[vertexId].setConnectable(connectable);
            }

            /**********************************************************************************
             * set the edges
             ***********************************************************************************/
            function setEdge(
                edgeId,
                parentVertexId,
                value,
                sourceVertexId,
                targetVertexId,
                style
            ) {
                util.debug.info(
                    "setEdge(edgeId " +
                    edgeId +
                    ", parentVertexId " +
                    parentVertexId +
                    ", value " +
                    value +
                    ", sourceVertexId " +
                    sourceVertexId +
                    ", targetVertexId " +
                    targetVertexId +
                    ", style " +
                    style +
                    ")"
                );
                graph.insertEdge(
                    vertices[parentVertexId],
                    edgeId,
                    value,
                    vertices[sourceVertexId],
                    vertices[targetVertexId],
                    style
                );
            }

            /**********************************************************************************
             * render the data
             ***********************************************************************************/
            function render(dataModel) {
                vertices["parent"] = graph.getDefaultParent();
                graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
                graph.getModel().beginUpdate(); // Adds cells to the model in a single step
                try {
                    $.each(dataModel, function (key, data) {
                        // set patent id null  or empty
                        var parentNodeId = data.parent;

                        if (parentNodeId == null || parentNodeId.length != 0) {
                            parentNodeId = "parent";
                        }

                        // prepare text datacon
                        var doc = mxUtils.createXmlDocument();
                        var obj = doc.createElement("UserObject");
                        obj.setAttribute("label", data.VALUE);

                        switch (data.TYPE.toLowerCase()) {
                            case "vertex":
                                setVertex(
                                    data.ID,
                                    parentNodeId,
                                    obj,
                                    data.X,
                                    data.Y,
                                    data.WIDTH,
                                    data.HEIGHT,
                                    data.STYLE,
                                    data.CONNECTABLE
                                );
                                break;
                            case "edge":
                                setEdge(
                                    data.ID,
                                    parentNodeId,
                                    obj,
                                    data.SOURCE,
                                    data.TARGET,
                                    data.STYLE
                                );
                                break;
                            default:
                                alert("Invalid type only edge and vertex is supported");
                        }
                    });
                } finally {
                    graph.getModel().endUpdate(); // Updates the display
                    onResize();
                }
            }

            /**********************************************************************************
             * fit on resize
             ***********************************************************************************/
            function onResize() {
                if ($(parentID).is(":visible")) {
                    graph.fit(null, false, 0, true, false, false, $(window).height() * 0.8);
                    graph.view.rendering = true;
                    graph.refresh();
                }
            }

            /*****************************************************
             * enable html writing (overwrite default)
             ******************************************************/
            graph.setHtmlLabels(true);
            graph.convertValueToString = function (cell) {
                if (cell.div != null) {
                    // Uses cached label
                    return cell.div;
                } else if (
                    mxUtils.isNode(cell.value) &&
                    cell.value.nodeName.toLowerCase() == "userobject"
                ) {
                    // Returns a DOM for the label
                    var div = document.createElement("div");
                    var innerHtml = cell.getAttribute("label");
                    if (innerHtml == undefined) {
                        innerHtml = "";
                    }
                    div.innerHTML = innerHtml;
                    return div;
                }
                return "";
            };


            // Enables rubberband selection
            new mxRubberband(graph);
            /*****************************************************
             * get the initial data
             ******************************************************/
            getData();
            onResize();
      
            /*****************************************************
             * get the data by refresh
             ******************************************************/
            try {
                $('#' + pBindRefreshOnId).bind("apexrefresh", function () {
                    console.log(pBindRefreshOnId);
                    
                    if ($('#' + pBindRefreshOnId).is(":visible")) {
                        getData();
                    }
                });
            } catch (e) {
                util.debug.error("Can't bind refresh event on " + parentID + ". Apex is missing");
                util.debug.error(e);
            }

            /*****************************************************
             * get the data by refresh time
             ******************************************************/
            if (config.refresh > 0) {
                setInterval(function () {
                    if ($(parentID).is(":visible")) {
                        getData();
                    }
                }, config.refresh * 1000);
            }

            /***********************************************************************
             ** Used to draw a container
             ***********************************************************************/
            function drawContainer(pParent) {
                var div = $("<div></div>");
                div.attr("id", parentID + "-c");
                div.css("min-height", "100px");
                pParent.append(div);
                return div;
            }

            /************************************************************************
             ** Config Resize /Refresh Events
             ***********************************************************************/
            if (util.isAPEX()) {
                $(window).on("apexwindowresized", function () {
                    onResize();
                });

                /* bind resize events */
                $("#t_TreeNav").on("theme42layoutchanged", function () {
                    onResize();
                });

                /* dirty workaround because in apex sometimes chart renders in wrong size hope apexDev Team will bring us layout change events also for tabs, collapsible so on */
                setInterval(function () {
                    if ( parent.is(":visible") &&
                        ((parent.width() != parent.find("svg").width()) ||
                            (parent.height() != parent.find("svg").height()))
                    ) {
                        onResize();
                    }
                }, 350);
            } else {
                $(window).resize(function () {
                    onResize();
                });
            }

            /***********************************************************************
             **
             ** function to get data from Apex
             **
             ***********************************************************************/
            function getData() {
                if (util.isAPEX()) {
                    if (config.refreshIcon) {
                        util.loader.start(parentID);
                    }
                    var submitItems = pItems2Submit;

                    apex.server.plugin(
                        pAjaxID, {
                            pageItems: submitItems
                        }, {
                            success: function (data) {
                                render(data.row);
                                if (config.refreshIcon) {
                                    util.loader.stop(parentID);
                                }
                            },
                            error: function (d) {
                                $(parentID).empty();
                                util.noDataMessage.show(parentID, "Loading Data Error!");

                                if (config.refreshIcon) {
                                    util.loader.stop(parentID);
                                }
                                util.debug.error(d.responseText);
                            },
                            dataType: "json"
                        }
                    );
                } else if (pData) {
                    render(pData);
                } else {
                    util.debug.error(
                        "No offline Data found or apex and ajax id is unedefined."
                    );
                }
            }
        }
    };
})();
