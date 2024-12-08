/* General Styles */
body {
    margin: 0;
    overflow: hidden;
    font-family: Arial, sans-serif;
    background-color: #000;
    color: #fff;
}

canvas {
    display: block;
}

input,
button {
    margin: 5px;
    padding: 8px 12px;
    font-size: 14px;
}

input {
    background-color: rgba(255, 255, 255, 0.1);
}

input:focus {
    background-color: rgba(255, 255, 255, 0.3);
}

button {
    background-color: #4CAF50;
    color: white;
}

button:hover {
    background-color: #45a049;
}

/* Container Styles */
#canvas-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

#controls {
    position: absolute;
    z-index: 10;
}

/* Additional styles can be added here */
