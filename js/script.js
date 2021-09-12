// JavaScript Document

class Node {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}

class Graph {
    constructor() {
        this.nodesList = [];
        this.edgesList = [];
        this.nodeCounter = 0;

        this.edgesInverseList = [];
        this.topoList = [];
        this.tour = [];

        this.addedList = [];
        this.tourList = [];
    }

    insertNode(x, y) {
        this.nodeCounter++;
        let newNode = new Node(this.nodeCounter, x, y);
        this.nodesList[this.nodeCounter] = newNode;
        this.edgesList[this.nodeCounter] = [];
        this.edgesInverseList[this.nodeCounter] = [];
    }

    insertEdge(from, to) {
        this.edgesList[from].push(to);
        this.insertInverseEdge(from, to);
    }

    insertInverseEdge(from, to) {
        this.edgesInverseList[to].push(from);
    }

    setTopoList() {
        this.topoList = [];
        console.log(this.edgesList);
        //console.log(this.edgesInverseList);
        for (let i = 1; i < this.edgesInverseList.length; i++) {
            this.topoList[i] = this.edgesInverseList[i].length;
        }
        console.log(this.topoList);
    }
    topoTour(edgesList) {

        for (let i = this.topoList.length; i > 0; i--) {//por cada nodo
            if (this.topoList[i] == 0 && this.tour.indexOf(i) == -1) {//si tiene 0 y no esta en la lista
                console.log('añadiendo ', i);
                this.tour.push(i);//añadirlo
            }
        }
        console.log('tour ', this.tour);

        for (let i = 0; i < this.tour.length; i++) {//por cada nodo añadido
            for (let j = 0; j < edgesList[this.tour[i]].length; j++) {//por cada hijo del nodo
                this.topoList[edgesList[this.tour[i]][j]]--;//resta a cada hijo el requisito
                console.log('tour i=' + i, this.tour[i]);
                console.log('edgesList', edgesList);
                edgesList[this.tour[i]].splice(j, 1);//eliminar de la lista de adyacencia para la recursion
            }
        }

        if (this.tour.length < this.topoList.length - 1) {
            this.topoTour(edgesList);
        }

    }
}

const graph = new Graph();
let insertData = true;

function insertNode(x, y) {
    if (insertData == true) {
        graph.insertNode(x, y);
        drawTable();
        drawGraph();
    }
}

function insertEdges() {
    let error = false;
    for (let i = 1; i < graph.nodesList.length; i++) {
        for (let j = 1; j < graph.nodesList.length - 1; j++) {
            let val = Number.parseInt($('#edge_' + i + '_' + j).val());
            if (val == i || val < 0) {
                error = true;
            }
        }
    }
    if (error === false) {
        for (let i = 1; i < graph.nodesList.length; i++) {
            //graph.edgesList[graph.nodeCounter] = [];
            for (let j = 1; j < graph.nodesList.length - 1; j++) {
                if ($('#edge_' + i + '_' + j).val() > 0) {
                    let val = $('#edge_' + i + '_' + j).val();
                    graph.insertEdge(i, parseInt(val))
                }
            }
        }
        insertData = false;
        for (let i = 1; i < graph.nodesList.length; i++) {
            for (let j = 1; j < graph.nodesList.length - 1; j++) {
                $('#edge_' + i + '_' + j).attr("readonly", true);
                $("#setEdgesBtn").attr("disabled", true);
            }
        }
    } else {
        alert("No deben existir ciclos y todos los datos deben ser enteros mayores que 0");
    }
    drawGraph();
    drawTour();
}

function drawGraph() {
    // create an array with nodes
    let nodesData = [];
    let nodesList = graph.nodesList;
    for (let i = 1; i < nodesList.length; i++) {
        let node = nodesList[i];
        nodesData.push({ id: node.id, label: node.id.toString(), x: node.x, y: node.y });
    }
    let nodes = new vis.DataSet(nodesData);

    // create an array with edges
    let edgesData = [];
    let edgesList = graph.edgesList;
    for (let i = 1; i < edgesList.length; i++) {
        if (Array.isArray(edgesList[i]) && edgesList[i].length > 0) {
            for (let j = 0; j < edgesList[i].length; j++) {
                edgesData.push({ from: i, to: edgesList[i][j] });
            }
        }
    }
    let edges = new vis.DataSet(edgesData);

    // create a network
    let container = document.getElementById('mynetwork');

    // provide the data in the vis format
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        edges: {
            smooth: false,
            arrows: {
                to: { enabled: true }
            }
        },
        physics: false,
        interaction: {
            dragNodes: false,
            zoomView: false,
            dragView: false
        }
    };

    // initialize your network!
    let network = new vis.Network(container, data, options);
    network.on('click', function (e) { onClick(e) });

    /* DEFINE CALLBACKS HERE */
    function onClick(e) {
        insertNode(e.pointer.canvas.x, e.pointer.canvas.y);
    }
}

function drawTable() {
    let html = "";
    for (let i = 1; i < graph.nodesList.length; i++) {
        html += "<tr>";
        html += "<th>" + i + "</th>";
        for (let j = 1; j < graph.nodesList.length - 1; j++) {
            html += "<td>";
            html +=
                '<div class="form-group">' +
                '<select name="edge_' + i + '_' + j + '" id="edge_' + i + '_' + j + '" class="form-control">';
            html += '<option value=""></option>';
            for (let k = 1; k <= graph.nodeCounter; k++) {
                if (k != i) {
                    html += '<option value="' + k + '">' + k + '</option>';
                }
            }

            html += '</select>'
            '</div>';
            html += "</td>";
        }
        html += "</tr>";
    }
    $('#edgesTable').html(html)
}

function drawTour() {
    console.log('topoList pre', graph.topoList);
    graph.tour = [];
    graph.setTopoList();
    graph.topoTour(graph.edgesList);
    console.log('tour', graph.tour);
    console.log('topoList post', graph.topoList);

    let res = graph.tour.join(' -> ');
    $('#tour').html(res);

}

drawGraph()




