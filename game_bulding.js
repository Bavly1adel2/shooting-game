alert("لا تنسي قلب للوحه المفاتيح ال انجليزي/don't forget to switch yor language to englsh in kybord")
prompt('Enter yor name')
class Laser {
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.height = this.game.height - 50;
    }
    render(context){
        this.x = this.game.player.x + this.game.player.width * 0.5 - this.width * 0.5;
        this.game.player.energy -= this.damage;

        context.save();
        context.fillStyle = settings.laserColor1;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = settings.laserColor2;
        context.fillRect(this.x + this.width * 0.2, this.y, this.width * 0.6, this.height);
        context.restore();

        if (this.game.spriteUpdate){
            this.game.waves.forEach(wave => {
                wave.enemies.forEach(enemy => {
                    if (this.game.checkCollision(enemy, this)){
                        enemy.hit(this.damage);
                    }
                })
            })
            this.game.bossArray.forEach(boss => {
                if (this.game.checkCollision(boss, this) && boss.y >= 0){
                    boss.hit(this.damage);
                }
            })
        }
    }
}

class SmallLaser extends Laser {
    constructor(game){
        super(game);
        this.width = settings.smallLaserWidth;
        this.damage = settings.smallLaserDamege;
    }
    render(context){
        if (this.game.player.energy > 1 && !this.game.player.cooldown){
            super.render(context);
            this.game.player.frameX = 2;
        }
    }
}

class BigLaser extends Laser {
    constructor(game){
        super(game);
        this.width = settings.BigLaserWidth;
        this.damage = settings.BigLaserDamege;
    }
    render(context){
        if (this.game.player.energy > 1 && !this.game.player.cooldown){
            super.render(context);
            this.game.player.frameX = 3;
        }
    }
}

class Player {
    constructor(game){
        this.game = game;
        this.width = 140;
        this.height = 120;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - this.height;
        this.speed = 5;
        this.lives = settings.playerLives;
        this.maxLives = settings.maxPlayerLives;
        this.image = document.getElementById('player');
        this.jets_image = document.getElementById('player_jets');
        this.frameX = 0;
        this.jetsFrame = 1;
        this.smallLaser = new SmallLaser(this.game);
        this.bigLaser = new BigLaser(this.game);
        this.energy = settings.energyLaser;
        this.maxEnergy = settings.maxEnergyLaser;
        this.cooldown = false;
    }
   draw(context){
        if (this.game.keys.indexOf(' ') > -1){
            this.frameX = 1;
        } else if (this.game.keys.indexOf('x') > -1){
            this.smallLaser.render(context);
        } else if (this.game.keys.indexOf('z') > -1){
            this.bigLaser.render(context);
        } else {
            this.frameX = 0;
        }
        context.drawImage(this.jets_image, this.jetsFrame * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    update(){
        // energyy
        if (this.energy < this.maxEnergy) this.energy += 0.05;
        if (this.energy < 1) this.cooldown = true;
        else if (this.energy > this.maxEnergy * 0.2) this.cooldown = false;
        // move <=== / ===>
        if (this.game.keys.indexOf('ArrowLeft') > -1) {
            this.x -= this.speed;
            this.jetsFrame = 0;
        } else if (this.game.keys.indexOf('ArrowRight') > -1) {
            this.x += this.speed;
            this.jetsFrame = 2;
        } else {
            this.jetsFrame = 1;
        }
        if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
        else if (this.x > this.game.width - this.width * 0.5) this.x = this.game.width - this.width * 0.5;
    }
    shoot(){
        const projectile = this.game.getProjectile();
        if (projectile) projectile.start(this.x + this.width * 0.5, this.y);
    }
    restart(){
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = this.game.height - this.height;
        this.lives = 3;
    }
}

class Projectile {
    constructor(){
        this.width = settings.shootingNormalWidth;
        this.height = settings.shootingNormalHight;
        this.x = 0;
        this.y = 0;
        this.speed = 20;
        this.free = true;
    }
    draw(context){
        if (!this.free){
            context.save();
            context.fillStyle = settings.shootColor1;
            context.fillRect(this.x, this.y, this.width, this.height);
            context.fillStyle = settings.shootColor2;
            context.fillRect(this.x + this.width * 0.2, this.y, this.width * 0.6, this.height);
          
            context.restore();
        }
    }
    update(){
        if (!this.free){
            this.y -= this.speed;
            if (this.y < -this.height) this.reset();
        }
    }
    start(x, y){
        this.x = x - this.width * 0.5;
        this.y = y;
        this.free = false;
    }
    reset(){
        this.free = true;
    }
}


class PlayerTwo{
    constructor(game){
        this.game= game;
        this.width = 100;
        this.height  =100;
        this.x = this.game.width*0.2-this.width*0.2;
        this.y = this.game.height-this.height;
        this.speed = 5;
        this.lives2 = 3
    }
    draw(context){
        context.fillRect(this.x,this.y,this.width,this.height)
    }
    update(){
        if(this.game.keys.indexOf('a') > -1) this.x -= this.speed;
        if(this.game.keys.indexOf('d') > -1) this.x += this.speed;
        if(this.x <0) this.x = 0;
        else if(this.x > this.game.width - this.width) this.x = this.game.width - this.width
    }
    shootTow(){
        const projectileTwo = this.game.getProjectileTow();
        if(projectileTwo) projectileTwo.start(this.x+this.width*0.5,this.y)
    }
}

class projectileTwo{
    constructor(){
        this.width = 8;
        this.height= 10;
        this.x = 0;
        this.y = 0;
        this.speed = 20;
        this.free = true;

    }
    draw(context){
        if(!this.free){
            context.fillRect(this.x,this.y,this.width,this.height);
        }
    }
    update(){
        if(!this.free){
            this.y-= this.speed;
            if(this.y < -this.height) this.reset();
        }

    }
    start(x,y){
        this.x =x - this.width * 0.5;
        this.y =y;

        this.free=false;
    }
    reset(){
this.free = true;
    }
}



class Enemy {
    constructor(game, positionX, positionY){
        this.game = game;
        this.width = this.game.enemySize;
        this.height = this.game.enemySize;
        this.x = 0;
        this.y = 0;
        this.positionX = positionX;
        this.positionY = positionY;
        this.markedForDeletion = false;
    }
    draw(context){
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    update(x, y){
        this.x = x + this.positionX;
        this.y = y + this.positionY;
        // checkk collision 
        this.game.projectilesPool.forEach(projectile => {
            if (!projectile.free && this.game.checkCollision(this, projectile) && this.lives > 0){
                this.hit(1);
                projectile.reset();
            }
        });
     
        if (this.lives < 1){
            if (this.game.spriteUpdate) this.frameX++;
            if (this.frameX > this.maxFrame){
                this.markedForDeletion = true;
                if (!this.game.gameOver) this.game.score += this.maxLives;
            }
        }
       
        if (this.game.checkCollision(this, this.game.player) && this.lives > 0){
            this.lives = 0;
            this.game.player.lives--;
        }


        if(this.game.checkCollision2(this,this.game.PlayerTwo)){
            this.markedForDeletion = true;
            if(!this.game.gameOver && this.game.score2 >0) this.game.score2--;
            this.game.PlayerTwo.lives2--
            if(this.game.PlayerTwo.lives2<1) this.game.gameOver = true
        }
        // lose 
        if (this.y + this.height > this.game.height || this.game.player.lives < 1){
            this.game.gameOver = true;
        }
      if(this.y+this.height>this.game.height){
        this.game.gameOver = true;
        this.markedForDeletion = true
      }
     
    }
    hit(damage){
        this.lives -= damage;
    }
    
}



class EnemyTWO{
constructor(game){
    this.game = game;
    this.width;
    this.height;
    this.x;
    this.y;
}
draw(context){
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
}
update(){

}
}

class Wave2{
constructor(game){
    this.game = game;
    this.width = this.game.columns2 * this.game.enemySize2;
    this.height = this.game.rows2 * this.game.enemySize2;
    this.x = 0;
    this.y = 0;
    this.speedX = 3
}
render(context){
    context.strokeRect(this.x,this.y,this.width,this.height);
    this.x+= this.speedX;
    if(this.x < 0 || this.x>this.game.width-this.width){
        this.speedX*=-1
    }
}
}
class Beetlemorph extends Enemy {
    constructor(game, positionX, positionY){
        super(game, positionX, positionY);
        this.image = document.getElementById('beetlemorph');
        this.frameX = 0;
        this.maxFrame = 2;
        this.frameY = Math.floor(Math.random() * 4);
        this.lives = settings.BeetlemorphLives;
        this.maxLives = this.lives;
    }
}

class Rhinomorph extends Enemy {
    constructor(game, positionX, positionY){
        super(game, positionX, positionY);
        this.image = document.getElementById('rhinomorph');
        this.frameX = 0;
        this.maxFrame = 5;
        this.frameY = Math.floor(Math.random() * 4);
        this.lives = settings.RhinomorphLives;
        this.maxLives = this.lives;
    }
    hit(damage){
        this.lives -= damage;
        this.frameX = this.maxLives - Math.floor(this.lives);
    }
}

class Squidmorph extends Enemy {
    constructor(game, positionX, positionY){
        super(game, positionX, positionY);
        this.image = document.getElementById('squidmorph');
        this.frameX = 0;
        this.maxFrame = 16;
        this.frameY = Math.floor(Math.random() * 4);
        this.lives = settings.SquidmorphLives;
        this.maxLives = this.lives;
    }
    hit(damage){
        this.lives -= damage;
        if (this.lives >= 1) this.frameX = this.maxLives - Math.floor(this.lives);
    }
}
class Eaglemorph extends Enemy {
    constructor(game, positionX, positionY){
        super(game, positionX, positionY);
        this.image = document.getElementById('eaglemorph');
        this.frameX = 0;
        this.maxFrame = 8;
        this.frameY = Math.floor(Math.random() * 4);
        this.lives = settings.EaglemorphLives;
        this.maxLives = this.lives;
        this.shots = 0;
    }
    hit(damage){
        if (this.shots < 4) this.shoot();
        this.lives -= damage;
        this.frameX = this.maxLives - Math.floor(this.lives);
        this.y += 3;
    }
    shoot(){
        const projectile = this.game.getEnemyProjectile();
        if (projectile) {
            projectile.start(this.x + this.width * 0.5, this.y + this.height * 0.5);
            this.shots++;
        }
    }
}
class EnemyProjectile {
    constructor(game){
        this.game = game;
        this.width = 50;
        this.height = 35;
        this.x = 0;
        this.y = 0;
        this.speed = Math.random() * 3 + 2;
        this.free = true;
        this.image = document.getElementById('enemyProjectile');
        this.frameX = Math.floor(Math.random() * 4);
        this.frameY = Math.floor(Math.random() * 2);
        this.lives = settings.enemyShottingToDefeatEnemy;
    }
    draw(context){
        if (!this.free){
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }
    update(){
        if (!this.free){
            this.y += this.speed;
            if (this.y > this.game.height) this.reset();
            if (this.game.checkCollision(this, this.game.player)){
                this.reset();
                this.game.player.lives--;
                if (this.game.player.lives < 1) this.game.gameOver;
            }
            this.game.projectilesPool.forEach(projectile => {
                if (this.game.checkCollision(this, projectile) && !projectile.free){
                    projectile.reset();
                    this.hit(1);
                    if (this.lives < 1) this.reset();
                }
            })
        }
    }
    start(x, y){
        this.x = x - this.width * 0.5;
        this.y = y;
        this.free = false;
        this.frameX = Math.floor(Math.random() * 4);
        this.frameY = Math.floor(Math.random() * 2);
        this.lives = 5;
        this.speed = Math.random() * 3 + 2;
    }
    reset(){
        this.free = true;
    }
    hit(damage){
        this.lives -= damage;
        this.speed *= 1;
    }
}

class Boss {
    constructor(game, bossLives){
        this.game = game;
        this.width = 200;
        this.height = 200;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = -this.height;
        this.speedX = Math.random() < 0.5 ? -1 : 1;
        this.speedY = 0;
        this.lives = bossLives;
        this.maxLives = this.lives;
        this.markedForDeletion = false;
        this.image = document.getElementById('boss8');
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 8);
        this.maxFrame = 11;
    }
    draw(context){
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        if (this.lives >= 1){
            context.save();
            context.textAlign = 'center';
            context.shadowOffsetX = 3;
            context.shadowOffsetY = 3;
            context.shadowColor = settings.shadowColor;
            context.fillText(Math.floor(this.lives), this.x + this.width * 0.5, this.y + 50);
            context.restore();
        }
    }
    update(){
        this.speedY = 0;
        if (this.game.spriteUpdate && this.lives >= 1) this.frameX = 0;
        if (this.y < 0) this.y += 4;
        if (this.x < 0 || this.x > this.game.width - this.width && this.lives >= 1){
            this.speedX *= -1;
            this.speedY = this.height * 0.5;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.game.projectilesPool.forEach(projectile => {
            if (this.game.checkCollision(this, projectile) && !projectile.free && this.lives >= 1 && this.y >= 0){
                this.hit(1);
                projectile.reset();
            }
        })
        if (this.game.checkCollision(this, this.game.player) && this.lives >= 1){
            this.game.gameOver = true;
            this.lives = 0;
        }
        // boss destroyed
        if (this.lives < 1 && this.game.spriteUpdate){
            this.frameX++;
            if (this.frameX > this.maxFrame){
                this.markedForDeletion = true;
                this.game.score += this.maxLives;
                this.game.bossLives += 5;
                if (!this.game.gameOver) this.game.newWave();
            }
        }
        // lose 
        if (this.y + this.height > this.game.height) this.game.gameOver = true;
    }
    hit(damage){
        this.lives -= damage;
        if (this.lives >= 1) this.frameX = 1;
    }
}

class Wave {
    constructor(game){
        this.game = game;
        this.width = this.game.columns * this.game.enemySize;
        this.height = this.game.rows * this.game.enemySize;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = -this.height;
        this.speedX = Math.random() < 0.5 ? -1 : 1;
        this.speedY = 0;
        this.enemies = [];
        this.nextWaveTrigger = false;
        this.markedForDeletion = false;
        this.create();
    }
    render(context){
        if (this.y < 0) this.y += 5;
        this.speedY = 0;
        if (this.x < 0 || this.x > this.game.width - this.width){
            this.speedX *= -1;
            this.speedY = this.game.enemySize;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.enemies.forEach(enemy => {
            enemy.update(this.x, this.y);
            enemy.draw(context);
        })
        this.enemies = this.enemies.filter(object => !object.markedForDeletion);
        if (this.enemies.length <= 0) this.markedForDeletion = true;
    }
    create(){
        for (let y = 0; y < this.game.rows; y++){
            for (let x = 0; x < this.game.columns; x++){
                let enemyX = x * this.game.enemySize;
                let enemyY = y * this.game.enemySize;
                let randomNumber = Math.random();
                if (randomNumber < 0.25){
                    this.enemies.push(new Squidmorph(this.game, enemyX, enemyY));
                } else if (randomNumber < 0.5) {
                    this.enemies.push(new Rhinomorph(this.game, enemyX, enemyY));
                } else if (randomNumber < 0.7) {1
                    this.enemies.push(new Eaglemorph(this.game, enemyX, enemyY));
                } else {
                    this.enemies.push(new Beetlemorph(this.game, enemyX, enemyY));
                }

            }
        }
    }
}

class Game {
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.keys = [];
        this.player = new Player(this);
        this.PlayerTwo = new PlayerTwo(this)
        this.projectilesPool = [];
        this.numberOfProjectiles = settings.numberOfProjectilesInIn1S;
        this.createProjectiles();
        this.fired = false;
        this.projectilesPoolTow = [];
        this.numberOfEnemyProjectilesTow = 10;
        this.createProjectilesTow();
        console.log(this.projectilesPoolTow);
        this.columns2 = 3;
        this.rows2 = 3;
        this.enemySize2 = 80
        this.columns = 1;
        this.rows = 1;
        this.enemySize = 80;

        this.waves = [];
        this.waves2 =[];
        this.waves2.push(new Wave2(this));

        this.waveCount = 1;
        this.enemyProjectilesPool = [];
        this.numberOfEnemyProjectiles = 25;
        this.createEnemyProjectiles();

        this.spriteUpdate = false;
        this.spriteTimer = 0;
        this.spriteInterval = 150;

        this.score = 0;
        this.score2 = 0;
        this.gameOver = false;

        this.bossArray = [];
        this.bossLives = settings.startedBossLives;
        this.restart();

        // keys
        window.addEventListener('keydown', e => {
            if (e.key === ' ' && !this.fired) this.player.shoot();
            this.fired = true;
            if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);
             if (e.key === 'r' && this.gameOver) this.restart();
        });


        window.addEventListener('keydown', e => {
            if (this.keys.indexOf(e.key)=== -1) this.keys.push(e.key) 
          if(e.key === '1') this.PlayerTwo.shootTow();
        });
        
        window.addEventListener('keyUp', e => {
            const index = this.keys.indexOf(e.key)
          if(index> -1) this.keys.splice(index,1)
        });
        

        window.addEventListener('keyup', e => {
            this.fired = false;
            const index = this.keys.indexOf(e.key);
            if (index > -1) this.keys.splice(index, 1);
        });
    }
    render(context, deltaTime){
        // sprite timing
        if (this.spriteTimer > this.spriteInterval){
            this.spriteUpdate = true;
            this.spriteTimer = 0;
        } else {
            this.spriteUpdate = false;
            this.spriteTimer += deltaTime;
        }

        this.drawStatusText(context);
        this.drawStatusText2(context)
        this.projectilesPool.forEach(projectile => {
            projectile.update();
            projectile.draw(context);
        })
        this.enemyProjectilesPool.forEach(projectile => {
            projectile.update();
            projectile.draw(context);
        })
        this.projectilesPoolTow.forEach(ProjectileTwo =>{
            ProjectileTwo.update();
            ProjectileTwo.draw(context)
        })
        this.player.draw(context);
        this.PlayerTwo.draw(context)
        this.PlayerTwo.update();
        this.player.update();
        this.bossArray.forEach(boss => {
            boss.draw(context);
            boss.update();
        })
        this.bossArray = this.bossArray.filter(object => !object.markedForDeletion);
        this.waves.forEach(wave => {
            wave.render(context);
            if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver){
                this.newWave();
                wave.nextWaveTrigger = true;
            }
        });
        this.waves2.forEach(wave2=>{
            wave2.render(context)
        })
    }
    
    createProjectiles(){
        for (let i = 0; i < this.numberOfProjectiles; i++){
            this.projectilesPool.push(new Projectile());
        }
    }
    getProjectile(){
        for (let i = 0; i < this.projectilesPool.length; i++){
            if (this.projectilesPool[i].free) return this.projectilesPool[i];
        }
    }

    createProjectilesTow(){
        for(let i = 0;i<this.numberOfEnemyProjectilesTow;i++){
            this.projectilesPoolTow.push(new projectileTwo())
        }
    }

    getProjectileTow(){
        for(let i =0;i < this.projectilesPoolTow.length;i++){
            if(this.projectilesPoolTow[i].free) return this.projectilesPoolTow[i];
        }
    }

    createEnemyProjectiles(){
        for (let i = 0; i < this.numberOfEnemyProjectiles; i++){
            this.enemyProjectilesPool.push(new EnemyProjectile(this));
        }
    }
    getEnemyProjectile(){
        for (let i = 0; i < this.enemyProjectilesPool.length; i++){
            if (this.enemyProjectilesPool[i].free) return this.enemyProjectilesPool[i];
        }
    }
    checkCollision(a, b){
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        )
    }
    checkCollision2(a, b){
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        )
    }
    drawStatusText(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        context.fillText('Score: ' + this.score, 20, 40);
        context.fillText('Wave: ' + this.waveCount, 20, 80);
        for (let i = 0; i < this.player.maxLives; i++){
            context.strokeRect(20 + 20 * i,100,10,15);
        }
        for (let i = 0; i < this.player.lives; i++){
            context.fillRect(20 + 20 * i,100,10,15);
        }
        // energy
        context.save();
        this.player.cooldown ? context.fillStyle = 'red' : context.fillStyle = 'blue';
        for (let i = 0; i < this.player.energy; i++){
            context.fillRect(20 + 2 * i, 130, 2, 15);
        }
        context.restore();
        if (this.gameOver){
            context.textAlign = 'center';
            context.font = '100px Impact';
            context.fillText('YOU ARE FINSHED', this.width * 0.5, this.height * 0.5);
            context.font = '20px Impact';
            context.fillText('Press R to restart DUMBY!', this.width * 0.5, this.height * 0.5 + 30);
        }
        context.restore();
    }


    drawStatusText2(context){
        context.fillText('Score(2): '+this.score2,1160,40);
        for (let i = 0; i < this.PlayerTwo.maxLives2; i++){
            context.strokeRect(1160 + 20 * i,100,10,15);
        }
        for (let i = 0; i < this.PlayerTwo.lives2; i++){
            context.fillRect(1160 + 20 * i,100,10,15);
        }
     

    }
    newWave(){
        this.waveCount++;
        if (this.player.lives < this.player.maxLives) //this.player.lives++;
        if (this.waveCount % 5 === 0){
           this.bossArray.push(new Boss(this, this.bossLives));
        } else {
            if (Math.random() < 0.5 && this.columns * this.enemySize < this.width * 0.8){
                this.columns++;
            } else if (this.rows * this.enemySize < this.height * 0.6){
                this.rows++;
            }
            this.waves.push(new Wave(this));
        }

        this.waves = this.waves.filter(object => !object.markedForDeletion);
    }
    //ارقام عدد الوحوش
    restart(){
        this.player.restart();
        this.columns = settings.columnsEnemy;
        this.rows = settings.rowEnemy ;
        this.waves = [];
        this.bossArray = [];
        this.bossLives = settings.bosssLive;
        this.waves.push(new Wave(this));
   // this.bossArray.push(new Boss(this, this.bossLives));
        this.waveCount = 1;
        this.score = 0;
        this.gameOver = false;
    }
}

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = settings.gamewidth;
    canvas.height = settings.gameHight;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.font = '30px Impact';

    const game = new Game(canvas);
    
    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);
});