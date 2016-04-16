(function() {
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var ctx = null;

    var Game = {
        canvas: document.getElementById("gamecanvas"),

        setup: function() {
            if (this.canvas.getContext) {
                ctx = this.canvas.getContext('2d');
                this.width = this.canvas.width;
                this.height = this.canvas.height;
                this.runGame();
                this.frameCount = 0;
            }
        },

        init: function() {

        },

        animate: function() {
            Game.play = requestAnimFrame(Game.animate);
            Game.draw();
        },

        draw: function() {
            this.frameCount++;
            if (this.frameCount >= Number.MAX_VALUE - 1000) this.frameCount = 0;
        },

        runGame: function() {
            Game.init();
            Game.animate();
        }
    };

    window.onload = function() {
        Game.setup();
    }
}());