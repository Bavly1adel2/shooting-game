class Player{
    constructor(game){
        this.game = game;
        this.width = 50;
        this.height = 100;
        this.x = this.game.width * 0.52-this.width * 0.800;
        this.y = this.game.height - this.height;
        this.speed = 8;
    }
    draw(context){
        context.fillRect(this.x,this.y,this.width,this.height);
    }
    update(){
        if(this.game.keys.indexOf('ArrowLeft') > -1) this.x -= this.speed;
        if(this.game.keys.indexOf('ArrowRight') > -1) this.x += this.speed;
        if(this.x <0) this.x = 0;
        else if(this.x>this.game.width - this.width) this.x = this.game.width - this.width
    }
    shoot(){
        const Projectile = this.game.getprojecttil();
        if(Projectile) Projectile.start(this.x+this.width*0.5,this.y);
    }
    }
    class Projectile{
    constructor(){
    this.width = 4;
    this.height = 20;
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
            this.y -= this.speed;
            if(this.y < - this.height) this.reset()
        }
    }
    start(x,y){
        this.x = x-this.width *0.5;
        this.y  = y;
    this.free = false
    }
    reset(){
    this.free = true
    }
    }
    
    class Enemy{
    constructor(game,positionX,positionY){
        this.game = game;
        this.width = this.game.enemySize;
        this.height=this.game.enemySize;
        this.x=0;
        this.y=0;
        this.positionX=positionX;
        this.positionY=positionY;
        this.markForDeletion = false 
    }
    draw(context){
    context.strokeRect(this.x,this.y,this.width,this.height)
    }
    update(x,y){
    this.x = x +this.positionX;
    this.y = y +this.positionY;
    this.game.ProjectilePool.forEach(projectile=>{
       if( !projectile.free&&this.game.checkCollision(this,projectile)){
            this.markForDeletion = true;
    projectile.reset();
    this.game.score++;
       }
        
    });
    if(this.game.checkCollision(this,this.game.Player)){
        this.markForDeletion= true;
        if(this.game.gameOver && this.game.score >0) this.game.score--;
        this.game.Player.lives--;
        
    }
    if(y+this.height>this.game.height){
        this.game.gameOver = true;
        this.markForDeletion = true
    }
    }
    }
    class Wave{
        constructor(game){
            
        this.game = game;
        this.width=this.game.columns * this.game.enemySize;
        this.height=this.game.rows * this.game.enemySize;
        this.x=0;
        this.y=-this.height;
        //speed
        this.speedX = 3;
        this.speedY = 0;
        this.enemies = [];
        this.nextWave = false;
        this.create()
        }
        render(context){
            //move
            if(this.y<0)this.y +=1;
            this.speedY = 0
         
            if(this.x <0 || this.x>this.game.width-this.width){
                this.speedX*=-1;
               this.speedY = this.game.enemySize
            }
            this.x += this.speedX;
            this.y += this.speedY;
            this.enemies.forEach(enemy=>{
                enemy.update(this.x,this.y);
                enemy.draw(context)
            });
            this.enemies = this.enemies.filter(object => !object.markForDeletion);
        }
        create(){
            for(let y = 0;y<this.game.rows;y++){
                for(let x = 0;x<this.game.columns;x++){
                    let enemyX = x*this.game.enemySize;
                    let enemyY = y*this.game.enemySize;
                    this.enemies.push(new Enemy(this.game,enemyX,enemyY));
                }
            }
        }
    }
    class Game{
    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.keys = [];
        this.Player = new Player(this);
        this.gameOver =false
    this.ProjectilePool = [];
    this.numberOfProjectiles = 10;
    this.creatProjectiles();
    //console.log(this.ProjectilePool);
    this.columns = 3;
    this.rows = 3;
    this.enemySize = 40;
    this.score = 0;
    this.waves = [];
    this.waveCount = 1;
    
    this.waves.push(new Wave(this));
        window.addEventListener('keydown', e =>{
            if(this.keys.indexOf(e.key)=== -1) this.keys.push(e.key);
            if(e.key === ' ') this.Player.shoot();
             // console.log(this.keys);
        });
        window.addEventListener('keyup', e =>{
          const index = this.keys.indexOf(e.key);
            if(index >-1) this.keys.splice(index,1)
             // console.log(this.keys);
        });
    }
    render(context){
     //  console.log(this.width,this.height);
     this.drawText(context)
     this.Player.draw(context);
     this.Player.update();
     this.ProjectilePool.forEach(projectile=>{
        projectile.update();
        projectile.draw(context)
     });
    this.waves.forEach(wave=>{
        wave.render(context);
        if(wave.enemies.length < 1 &&!wave.nextWave&&!this.gameOver){
        this.newWave();
        this.waveCount++;
        wave.nextWave = true
        }
    })
    }
    creatProjectiles(){
        for(let i = 0; i<this.numberOfProjectiles;i++){
            this.ProjectilePool.push(new Projectile());
        }
    }
    getprojecttil(){
        for(let i =0;i < this.ProjectilePool.length;i++){
            if(this.ProjectilePool[i].free) return this.ProjectilePool[i];
        }
    }
    //colllistion
    checkCollision(a,b){
        return(
    a.x < b.x + b.width&&
    a.x + a.width > b.x&&
    a.y <b.y + b.height&&
    a.y + a.height > b.y
        )
    }
    drawText(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        context.fillText('Score: ' + this.score, 20, 40);
        context.fillText('Wave: ' + this.waveCount, 20, 80);
    
        if (this.gameOver){
            context.textAlign = 'center';
            context.font = '100px Impact';
            context.fillText('YOU ARE FINSHED!', this.width * 0.5, this.height * 0.5);
            context.font = '20px Impact';
            context.fillText('Press R to restart!', this.width * 0.5, this.height * 0.5 + 30);
        }
        context.restore();
    }
    newWave(){
        this.columns++;
        this.rows++;
    
        this.waves.push(new Wave(this))
    }
    }
    window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1100;
    canvas.height = 700;
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'white'
    ctx.font = '30px impact'
    const game = new Game(canvas);
    
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.render(ctx);
       requestAnimationFrame(animate)
    }
    animate();
});