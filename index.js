const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1830
canvas.height = 940

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.3

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/2DBackground_36.png'
})

const shop = new Sprite({
    position: {
        x: 800,
        y: 565
    },
    imageSrc: './img/shop_anim.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
    x: 0,
    y: 0
},
velocity: {
    x: 0,
    y: 0
},
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/EvilWizard2/Sprites/Idle.png',
    framesMax: 8,
    scale: 3.5,
    offset: {
        x: -220,
        y: 435
    },
    sprites: {
        idle: {
            imageSrc: './img/EvilWizard2/Sprites/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/EvilWizard2/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/EvilWizard2/Sprites/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/EvilWizard2/Sprites/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/EvilWizard2/Sprites/Attack1.png',
            framesMax: 8
        },
        attack2: {
            imageSrc: './img/EvilWizard2/Sprites/Attack2.png',
            framesMax: 8
        },
        takeHit: {
            imageSrc: './img/EvilWizard2/Sprites/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/EvilWizard2/Sprites/Death.png',
            framesMax: 7
        },
},
    attackBox: {
        offset: {
            x: 0,
            y: 0
        },
        width: 200,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
    x: 400,
    y: 100
},
velocity: {
    x: 0,
    y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/FantasyWarrior/Sprites/Idle.png',
    framesMax: 10,
    scale: 3.5,
    offset: {
        x: -550,
        y: 200
    },
    sprites: {
        idle: {
            imageSrc: './img/FantasyWarrior/Sprites/Idle.png',
            framesMax: 10
        },
        run: {
            imageSrc: './img/FantasyWarrior/Sprites/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/FantasyWarrior/Sprites/Jump.png',
            framesMax: 3
        },
        fall: {
            imageSrc: './img/FantasyWarrior/Sprites/Fall.png',
            framesMax: 3
        },
        attack1: {
            imageSrc: './img/FantasyWarrior/Sprites/Attack1.png',
            framesMax: 7
        },
        attack2: {
            imageSrc: './img/FantasyWarrior/Sprites/Attack2.png',
            framesMax: 8
        },
        takeHit: {
            imageSrc: './img/FantasyWarrior/Sprites/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/FantasyWarrior/Sprites/Death.png',
            framesMax: 7
        },
    },
    attackBox: {
        offset: {
            x: -50,
            y: 0
        },
        width: 130,
        height: 50
    }
})

console.log(player);

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
    
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

//player movement

if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -4
    player.switchSprite('run')
} else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 4
    player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
//jumping
    if (player.velocity.y < 0) {
      player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
}

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -4
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 4
        enemy.switchSprite('run')
        } else {
            enemy.switchSprite('idle')
        }

        //jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
      } else if (enemy.velocity.y > 0) {
          enemy.switchSprite('fall')
  }

        // detect for collision & enemy get hit
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: enemy
            }) &&
            player.isAttacking && 
            player.framesCurrent === 3
        ) {
            enemy.takeHit()
            player.isAttacking = false

            gsap.to('#enemyHealth', {
            width: enemy.health + '%'    
            })
        }

        // if player misses
        if (player.isAttacking && player.framesCurrent === 3) {
            player.isAttacking = false
        }

        // this is when player gets hit
        if (
            rectangularCollision({
                rectangle1: enemy,
                rectangle2: player
            }) &&
            enemy.isAttacking && 
            enemy.framesCurrent === 4
        ) {
            player.takeHit()
            enemy.isAttacking = false

            
            gsap.to('#playerHealth', {
                width: player.health + '%'    
                })
        }

          // if player misses
          if (enemy.isAttacking && enemy.framesCurrent === 4) {
            enemy.isAttacking = false
        }

        //end game based on health
        if (enemy.health <= 0 || player.health <= 0) {
            determineWinner({player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
 
    switch (event.key) {
        case 'd':
           keys.d.pressed = true
           player.lastKey = 'd'
            break
        case 'a':
             keys.a.pressed = true   
             player.lastKey= 'a'     
            break
        case 'w':
            player.velocity.y = -10    
            break
        case 's':
            player.attack()
            break
    }
}
    if (!enemy.dead) {
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
             break
         case 'ArrowLeft':
              keys.ArrowLeft.pressed = true   
              enemy.lastKey= 'ArrowLeft'     
             break
         case 'ArrowUp':
             enemy.velocity.y = -10    
             break
         case 'ArrowDown':
                enemy.attack()
                
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
                keys.a.pressed = false
                break
    }

    //enemy keys

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
                break
    }
})