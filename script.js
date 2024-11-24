
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced 3D Solar System Animation</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            font-family: Arial, sans-serif;
            background-color: #000;
            color: #fff;
        }

        #canvas-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        #info-panel {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 5px;
            max-width: 300px;
            display: none;
        }

        #controls {
            position: absolute;
            bottom: 10px;
            left: 10px;
        }

        button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px;
        }

        .planet-label {
            color: #fff;
            font-size: 12px;
            padding: 2px 5px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 3px;
            pointer-events: none;
        }

        #simulation-info {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 5px;
        }

        .dg.ac {
            z-index: 1000 !important;
        }
    </style>
</head>
<body>
    <div id="canvas-container"></div>
    <div id="info-panel">
        <h2 id="celestial-name"></h2>
        <p id="celestial-description"></p>
    </div>
    <div id="controls">
        <button id="toggle-orbits">Toggle Orbits</button>
        <button id="toggle-labels">Toggle Labels</button>
        <button id="toggle-scale">Toggle Scale</button>
    </div>
    <div id="simulation-info">
        <div id="simulation-time"></div>
        <div id="simulation-speed"></div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/renderers/CSS2DRenderer.js"></script>
    <script src="script.js"></script>
</body>
</html>
