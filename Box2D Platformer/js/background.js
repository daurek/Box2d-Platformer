
var background = {

    // fondo cielo
    layer0: {
        position: {x: 0, y: 0},

        Draw: function (ctx) {
            var bgGrd = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGrd.addColorStop(0, "black");
            bgGrd.addColorStop(1, "#365B93");
            ctx.fillStyle = bgGrd;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    },

    // estrellas
    layer1: {
        position: {x: 0, y: 0},
        speed: 0.05,
        stars: [],

        Start: function () {
            // creamos un numero determinado de estrellas con posiciones y radio aleatorios
            let numberOfStars = 120;
            while (numberOfStars > 0)
            {
                this.stars.push({
                    position: {
                        x: Math.floor(Math.random() * 1.5 * canvas.width),
                        y: Math.floor(Math.random() * 300)
                    },
                    radius: Math.floor(Math.random() * 2.5) + 0.5
                });
                numberOfStars--;
            }
        },

        Draw: function (ctx) {
            for (let i = 0; i < this.stars.length; i++)
            {
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(
                    this.stars[i].position.x - (camera.position.x * this.speed),
                    this.stars[i].position.y - (camera.position.y * this.speed),
                    this.stars[i].radius,
                    0,
                    pi_2,
                    false
                );
                ctx.fill();
            }
        }
    },

    // montaña
    layer2: {
        position: {x: 0, y: 0},
        speed: 0.1,
        img: null,

        Start: function () {
            this.img = mountainImg;
        },

        Draw: function (ctx) {
            ctx.drawImage(this.img, - (camera.position.x * this.speed), canvas.height - this.img.height - (camera.position.y * this.speed) , 1.2 * canvas.width, canvas.height /2);
        }
    },

    layer3: {
        position: {x: 0, y: 0},
        speed: 0.4,

        Draw: function (ctx) {

        }
    },

    layers : null,

    // inicializamos el array de capas del fondo
    Start: function () {
        this.layers = new Array(this.layer0, this.layer1, this.layer2, this.layer3);
        for (let i = 0; i < this.layers.length; i++)
        {
            if (typeof(this.layers[i].Start) !== 'undefined')
                this.layers[i].Start();
        }
    },

    Draw: function (ctx) {
        for (let i = 0; i < this.layers.length; i++)
            this.layers[i].Draw(ctx);
    }

};
